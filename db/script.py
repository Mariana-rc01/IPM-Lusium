import json
from datetime import datetime, timedelta

# Load the JSON
with open('dados.json', 'r') as f:
    data = json.load(f)

# Mapping of shifts by course and type, with capacity control
shifts_by_course = {}
for shift in data['shifts']:
    course = shift['courseId']
    if course not in shifts_by_course:
        shifts_by_course[course] = {'T': [], 'PL': []}
    shifts_by_course[course][shift['type']].append(shift)
    # Initialize the registered students counter
    if 'allocations_count' not in shift:
        shift['allocations_count'] = 0

# Auxiliary functions
def time_to_minutes(t):
    hours, minutes = map(int, t.split(':'))
    return hours * 60 + minutes

def has_overlap(new_shift, scheduled_shifts):
    new_day = new_shift['day']
    new_start = time_to_minutes(new_shift['from'])
    new_end = time_to_minutes(new_shift['to'])

    for existing in scheduled_shifts:
        existing_day = existing['day']
        existing_start = time_to_minutes(existing['from'])
        existing_end = time_to_minutes(existing['to'])

        if new_day == existing_day and (new_start < existing_end and new_end > existing_start):
            return True
    return False

# Allocations
allocations = []
unallocated_students = []

for student in data['students']:
    student_id = student['id']
    enrolled = student['enrolled']
    scheduled_shifts = []
    success = True

    for course_id in enrolled:
        course_shifts = shifts_by_course.get(course_id, {'T': [], 'PL': []})
        t_shifts = course_shifts['T']
        pl_shifts = course_shifts['PL']

        # Try to allocate T (max 100)
        allocated_t = next((s for s in t_shifts
                          if s['allocations_count'] < 100
                          and not has_overlap(s, scheduled_shifts)), None)

        # Try to allocate PL (max 20)
        allocated_pl = next((s for s in pl_shifts
                           if s['allocations_count'] < 20
                           and not has_overlap(s, scheduled_shifts)), None)

        # Update allocations
        if allocated_t:
            allocated_t['allocations_count'] += 1
            scheduled_shifts.append(allocated_t)
        if allocated_pl:
            allocated_pl['allocations_count'] += 1
            scheduled_shifts.append(allocated_pl)

        # Check if at least one shift was allocated
        if not allocated_t and not allocated_pl:
            success = False
            break

    if success:
        for shift in scheduled_shifts:
            allocations.append({
                "id": len(allocations) + 1,
                "shiftId": shift['id'],
                "studentId": student_id
            })
    else:
        unallocated_students.append(student_id)

# Update the totalStudentsRegistered field in shifts
for shift in data['shifts']:
    shift['totalStudentsRegistered'] = shift.get('allocations_count', 0)

# Remove the auxiliary field
for shift in data['shifts']:
    if 'allocations_count' in shift:
        del shift['allocations_count']

data['allocations'] = allocations
with open('allocations.json', 'w') as f:
    json.dump(data, f, indent=2)

print(f"Allocations completed! Students without allocation: {unallocated_students}")