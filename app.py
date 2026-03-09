from flask import Flask, render_template, request, redirect, url_for
from models import db, User, Machine, WorkLog
from statistics import efficiency, calculate_worked_hours

app = Flask(__name__)

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///worktime.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/employee", methods=["GET","POST"])
def employee():
    if request.method == "POST":
        user_id = request.form["user_id"]
        machine_id = request.form["machine_id"]
        start = request.form["start"]
        end = request.form["end"]
        items = request.form["items"]

        new_worklog = WorkLog(
            user_id=user_id,
            machine_id=machine_id,
            start_time=start,
            end_time=end,
            produced_items=items
        )

        db.session.add(new_worklog)
        db.session.commit()

        return redirect(url_for('employee'))

    machines = Machine.query.all()
    users = User.query.filter_by(role='employee').all()

    return render_template("employee.html", machines=machines, users=users)

@app.route("/employer")
def employer():
    logs = db.session.query(
        User.name.label('user_name'),
        Machine.name.label('machine_name'),
        WorkLog.start_time,
        WorkLog.end_time,
        WorkLog.produced_items,
        Machine.expected_per_hour
    ).join(User, WorkLog.user_id == User.id
    ).join(Machine, WorkLog.machine_id == Machine.id
    ).order_by(WorkLog.start_time.desc()).all()

    logs_with_efficiency = []
    for log in logs:
        hours_worked = calculate_worked_hours(log.start_time, log.end_time)

        efficiency_value = efficiency(
            log.produced_items,
            log.expected_per_hour,
            log.start_time,
            log.end_time
        )

        # Oblicz średnią produkcję na godzinę
        if hours_worked > 0:
            avg_per_hour = round(log.produced_items / hours_worked, 2)
        else:
            avg_per_hour = 0
        log_dict = {
            'user_name': log.user_name,
            'machine_name': log.machine_name,
            'start_time': log.start_time,
            'end_time': log.end_time,
            'hours_worked': hours_worked,
            'produced_items': log.produced_items,
            'avg_per_hour': avg_per_hour,
            'expected_per_hour': log.expected_per_hour,
            'efficiency': efficiency_value
        }

        logs_with_efficiency.append(log_dict)

    return render_template("employer.html", logs=logs_with_efficiency)


def init_db():
    with app.app_context():
        db.create_all()

        if not User.query.first():
            print("Dodawanie przykładowych danych...")

            user1 = User(name="Jan Kowalski", role="employee")
            user2 = User(name="Anna Nowak", role="employee")
            user3 = User(name="Piotr Wiśniewski", role="employer")
            db.session.add_all([user1, user2, user3])
            db.session.flush()

            machine1 = Machine(name="Tokarka CNC", expected_per_hour=20)
            machine2 = Machine(name="Frezarka", expected_per_hour=60)
            machine3 = Machine(name="Prasa hydrauliczna", expected_per_hour=120)
            db.session.add_all([machine1, machine2, machine3])
            db.session.flush()

            db.session.commit()
            print("Przykładowe dane dodane!")

if __name__ == "__main__":
    init_db()
    app.run(debug=True)