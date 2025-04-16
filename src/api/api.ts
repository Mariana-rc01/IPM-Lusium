import axios from 'axios';
import * as types from './types';

const API = axios.create({
    baseURL: 'http://localhost:8001',
    responseType: 'json',
    withCredentials: false,
    headers: {
        'Content-Type': 'application/json',
    },
});

// -----------------------
// Function for Log In
// -----------------------

export async function authenticateUser(userId: string, password: string) {
  const response = await axios.get('/db/db.json');
  const data = response.data;

  let user = null;
  if (userId.startsWith('d')) {
    user = data.directors.find((u: any) => u.id === userId && u.password === password);
  } else if (userId.startsWith('t')) {
    user = data.teachers.find((u: any) => u.id === userId && u.password === password);
  } else if (userId.startsWith('a')) {
    user = data.students.find((u: any) => u.id === userId && u.password === password);
  }

  if (!user) {
    throw new Error('Credenciais inválidas! Verifique o ID e a palavra-passe.');
  }

  return {
    id: user.id,
    name: user.name,
    type: userId.startsWith('d') ? 'director' : userId.startsWith('t') ? 'teacher' : 'student',
  };
}

// -----------------------
// Function for Tickets
// -----------------------

// Gets all the requests from the student with the corresponding id
export async function list_RequestsStudents_by_id(id: number) {
    const response = await API.get('/requestsStudents');
    const data: types.RequestsStudents[] = response.data;
    const dict: types.RequestsStudentsDict = {};
    data.forEach((item) => {
      if (item.studentId === id) dict[item.id] = item;
    });
    return dict;
  }

// Gets all the requests from the teacher with the corresponding id
export async function list_RequestsTeachers_by_id(id: number) {
  const response = await API.get('/requestsTeachers');
  const data: types.RequestsTeachers[] = response.data;
  const dict: types.RequestsTeachersDict = {};
  data.forEach((item) => {
    if (item.teacherId === id) dict[item.id] = item;
  });
  return dict;
}

// Gets all the requests from the director
export async function list_RequestsDirector_by_id() {
  const response = await API.get('/requestsDirector');
  const data: types.RequestsDirector[] = response.data;
  const dict: types.RequestsDirectorDict = {};
  data.forEach((item) => {
    dict[item.id] = item;
  });
  return dict;
}

// -----------------------
// Functions for Shifts
// -----------------------

// Get a shift by ID
export async function getShiftById(shiftId: string) {
  const response = await API.get(`/shifts/${shiftId}`);
  return response.data;
}

// Update the totalStudentsRegistered for a shift
export async function updateShiftTotalStudents(shiftId: string, totalStudentsRegistered: number) {
  await API.patch(`/shifts/${shiftId}`, { totalStudentsRegistered });
}

// Get student by ID
export async function getStudentById(studentId: string) {
  const response = await API.get('/students');
  const student = response.data.find((s: any) => String(s.id) === String(studentId));
  if (!student) {
    throw new Error('Aluno não encontrado!');
  }
  return {
    ...student,
    enrolled: student.enrolled.map((id: any) => String(id)),
  };
}

// Get allocations for a specific student
export async function getStudentAllocations(studentId: string) {
  const response = await API.get('/allocations');
  return response.data
    .filter((a: any) => String(a.studentId) === String(studentId))
    .map((a: any) => String(a.shiftId));
}

// Get available courses and shifts
export async function getAvailableCourses(enrolledCourses: string[]) {
  const coursesResponse = await API.get('/courses');
  const shiftsResponse = await API.get('/shifts');
  const classroomsResponse = await API.get('/classrooms');
  const buildingsResponse = await API.get('/buildings');

  const courses = coursesResponse.data;
  const shifts = shiftsResponse.data;
  const classrooms = classroomsResponse.data;
  const buildings = buildingsResponse.data;

  return courses
    .filter((course: any) => enrolledCourses.includes(String(course.id)))
    .map((course: any) => {
      const turnos = shifts
        .filter((shift: any) => String(shift.courseId) === String(course.id))
        .map((shift: any) => {
          const classroom = classrooms.find((c: any) => String(c.id) === String(shift.classroomId));
          const building = buildings.find((b: any) => String(b.id) === String(classroom?.buildingId));
          return {
            id: String(shift.id),
            name: shift.name,
            type: shift.type,
            room: classroom && building ? `${building.abbreviation} - ${classroom.name}` : 'Desconhecida',
            day: shift.day,
            startHour: shift.from,
            endHour: shift.to,
            occupancy: {
              current: shift.totalStudentsRegistered,
              total: classroom ? classroom.capacity : 0,
              percentage: classroom
                ? parseFloat(((shift.totalStudentsRegistered / classroom.capacity) * 100).toFixed(2))
                : 0,
            },
          };
        })
        .sort((a: any, b: any) => a.name.localeCompare(b.name));

      return {
        uc: course.abbreviation,
        turnos,
      };
    });
}

// --------------------------
// Functions for Allocations
// --------------------------

// Get all allocations to calculate the last ID
export async function getAllAllocations() {
  const response = await API.get('/allocations');
  return response.data.map((allocation: any) => ({
    ...allocation,
    id: String(allocation.id),
  }));
}

// Get all allocations for a specific student
export async function getAllocationsByStudentId(studentId: string) {
  const response = await API.get(`/allocations?studentId=${studentId}`);
  return response.data.map((allocation: any) => ({
    ...allocation,
    id: String(allocation.id),
  }));
}

// Create a new allocation
export async function createAllocation(allocation: { id: string; studentId: string; shiftId: string }) {
  await API.post('/allocations', allocation);
}

// Delete an allocation by ID
export async function deleteAllocation(allocationId: string) {
  await API.delete(`/allocations/${allocationId}`);
}

// Add a student to the noAllocations table
export async function addStudentToNoAllocations(studentId: string) {
  const response = await API.get('/noAllocations');
  const noAllocations = response.data;

  const exists = noAllocations.some((entry: any) => entry.studentId === studentId);
  if (!exists) {
    await API.post('/noAllocations', { studentId });
  }
}
