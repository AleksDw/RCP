from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    role = db.Column(db.String(20))  # employee / employer


class Machine(db.Model):
    __tablename__ = "machines"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    expected_per_hour = db.Column(db.Integer)


class WorkLog(db.Model):
    __tablename__ = "worklogs"

    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    machine_id = db.Column(db.Integer, db.ForeignKey("machines.id"))

    start_time = db.Column(db.String(10))
    end_time = db.Column(db.String(10))
    produced_items = db.Column(db.Integer)

    user = db.relationship("User")
    machine = db.relationship("Machine")