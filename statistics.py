def calculate_worked_hours(start_time, end_time):
    try:
        start_h, start_m = map(int, start_time.split(':'))
        end_h, end_m = map(int,end_time.split(':'))

        start_decimal = start_h + start_m / 60
        end_decimal = end_h + end_m / 60

        hours_worked = end_decimal - start_decimal

        if hours_worked < 0:
            hours_worked += 24

        return round(hours_worked, 2)
    except (ValueError, TypeError, AttributeError):
        return 0

def efficiency(produced, expected, start_time, end_time):

    hours_worked = calculate_worked_hours(start_time, end_time)

    if hours_worked == 0 or expected == 0:
        return 0

    expected_total = expected * hours_worked

    efficiency_value = (produced / expected_total) * 100
    return round(efficiency_value, 2)
