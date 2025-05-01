import axios from "axios";
import * as types from "./types";
import { containsProp } from "@vueuse/core";

const API = axios.create({
  baseURL: "http://localhost:3000",
  responseType: "json",
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
  },
});

// -----------------------
// Function for Log In
// -----------------------

export async function authenticateUser(userId: string, password: string) {
  const response = await Promise.all([
    API.get("/students"),
    API.get("/teachers"),
    API.get("/directors"),
  ]).then(([studentsResponse, teachersResponse, directorsResponse]) => ({
    data: {
      students: studentsResponse.data,
      teachers: teachersResponse.data,
      directors: directorsResponse.data,
    },
  }));
  const data = response.data;

  let user = null;
  if (userId.startsWith("d")) {
    user = data.directors.find(
      (u: any) => u.id === userId && u.password === password,
    );
  } else if (userId.startsWith("t")) {
    user = data.teachers.find(
      (u: any) => u.id === userId && u.password === password,
    );
  } else if (userId.startsWith("a")) {
    user = data.students.find(
      (u: any) => u.id === userId && u.password === password,
    );
  }

  if (!user) {
    throw new Error("Credenciais inválidas! Verifique o ID e a palavra-passe.");
  }

  return {
    id: user.id,
    name: user.name,
    type: userId.startsWith("d")
      ? "director"
      : userId.startsWith("t")
        ? "teacher"
        : "student",
  };
}

// -----------------------
// Function for Tickets
// -----------------------

// Gets all the requests with the corresponding id
export async function list_Requests(): Promise<types.Request[]> {
  const response = await API.get('/requests')
  return response.data as types.Request[]
}

export async function getRequestByTicketId(ticketId: string): Promise<types.Request | undefined> {
  const all = await list_Requests()
  return all.find(r => r.id === ticketId)
}

export async function updateRequest(
  ticketId: string,
  updatedFields: Partial<{ status: string; response: string }>
): Promise<types.Request> {
  const response = await API.patch(`/requests/${ticketId}`, updatedFields)
  return response.data
}

export async function createRequest(newReq: {
  subject: string;
  sender: string;
  recipient: string;
  date: string;
  status: string;
  description: string;
  response: string;
}) {
  const payload = {
    id: "",
    ...newReq
  };

  const allRequests = await list_Requests();
  const lastId = allRequests.length > 0 ? Math.max(...allRequests.map((r) => parseInt(r.id))) : 0;
  payload.id = String(lastId + 1);

  const response = await API.post("/requests", payload);
  return response.data;
}

// "DD-MM-YYYY" → Date
function parseDDMMYYYY(str: string): Date {
  const [day, month, year] = str.split('-').map(s => parseInt(s, 10));
  return new Date(year, month - 1, day);
}

export async function list_Recent_Requests(limit: number, userID: string): Promise<{
  subject: string;
  date: string;
  name: string;
  email: string;
}[]> {
  try {
    const allRequests = await list_Requests();

    const userRequests = allRequests.filter(
      (request) => request.sender === userID || request.recipient === userID
    );

    const sortedRequests = userRequests.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateB - dateA;
    });

    const formattedRequests = await Promise.all(
      sortedRequests.slice(0, limit).map(async (req) => {
        const user = await getUserInfoById(userID)

        return {
          subject: req.subject,
          date: req.date.replace(/-/g, "/"),
          name: user?.name || "Unknown",
          email: user?.email || "Unknown",
        };
      })
    );



    return formattedRequests;
  } catch (error) {
    console.error("Error listing recent tickets:", error);
    throw error;
  }
}

// -----------------------
// Functions for Students
// -----------------------

// Get all students
export async function getStudents() {
  const response = await API.get("/students");
  return response.data;
}

export async function getUserInfoById(userId: string) {
  const response = await Promise.all([
    API.get("/students"),
    API.get("/teachers"),
    API.get("/directors"),
  ]).then(([studentsResponse, teachersResponse, directorsResponse]) => ({
    data: {
      students: studentsResponse.data,
      teachers: teachersResponse.data,
      directors: directorsResponse.data,
    },
  }));
  const data = response.data;

  let user = null;
  if (userId.startsWith("d")) {
    user = data.directors.find((u: any) => u.id === userId);
  } else if (userId.startsWith("t")) {
    user = data.teachers.find((u: any) => u.id === userId);
  } else if (userId.startsWith("a")) {
    user = data.students.find((u: any) => u.id === userId);
  }

  if (!user) {
    throw new Error("Utilizador não existe! Verifique o seu ID.");
  }

  return {
    name: user.name,
    email: user.email,
    age: user.age,
    location: user.location,
    profession: user.profession,
    objectives: user.objectives,
    challenges: user.challenges,
    solutions: user.solutions,
    quote: user.citation,
    specialStatus: user.specialStatus,
  };
}

// Get all non-allocated students
export async function getNonAllocatedStudents() {
  const noAllocationsResponse = await API.get("/noAllocations");
  const studentsResponse = await API.get("/students");

  const noAllocations = noAllocationsResponse.data;
  const students = studentsResponse.data;

  // get the students ID from the noAllocations and filter the students by that ID
  const nonAllocatedStudents = students.filter((student: any) =>
    noAllocations.some(
      (noAllocation: any) => String(noAllocation.studentId) === String(student.id),
    ),
  );
  return nonAllocatedStudents;
}


// Delete a student by ID
export async function deleteStudentById(studentId: string) {
  await API.delete(`/students/${studentId}`);
}

// -----------------------
// Functions for Course Director
// -----------------------

export async function schedulesPublished() {
  const response = await API.get("/directors");
  const directors = response.data;
  if (directors.length === 0) {
    throw new Error("No directors found!");
  }
  const director = directors[0];
  return director.schedulePublished;
}

export async function publishSchedules() {
  const response = await API.get("/directors");
  const directors = response.data;
  if (directors.length === 0) {
    throw new Error("No directors found!");
  }
  const director = directors[0];
  await API.patch(`/directors/${director.id}`, {
    schedulePublished: true,
  });
}

// -----------------------
// Functions for Courses
// -----------------------

// Get each course shifts ocupation
export async function getCoursesOccupancy() {
  const response = await API.get("/courses");
  const courses = response.data;

  const shiftsResponse = await API.get("/shifts");
  const shifts = shiftsResponse.data;

  const classroomsResponse = await API.get("/classrooms");
  const classrooms = classroomsResponse.data;

  return courses.map((course: any) => {
    const courseShifts = shifts.filter(
      (shift: any) => String(shift.courseId) === String(course.id),
    );

    const totalCapacity = courseShifts.reduce((acc: number, shift: any) => {
      const classroom = classrooms.find(
        (c: any) => String(c.id) === String(shift.classroomId),
      );
      return acc + (classroom ? classroom.capacity : 0);
    }, 0);

    const totalRegistered = courseShifts.reduce(
      (acc: number, shift: any) => acc + shift.totalStudentsRegistered,
      0,
    );

    return {
      id: course.id,
      abbreviation: course.abbreviation,
      occupancy: {
        current: totalRegistered,
        total: totalCapacity,
        percentage:
          totalCapacity > 0
            ? parseFloat(((totalRegistered / totalCapacity) * 100).toFixed(2))
            : 0,
      },
    };
  });
}

// -----------------------
// Functions for Statistics
// -----------------------

// Get global occupancy percentage (one unique value)
export async function getGlobalOccupancy() {
  const shiftsResponse = await API.get("/shifts");
  const classroomsResponse = await API.get("/classrooms");

  const shifts = shiftsResponse.data;
  const classrooms = classroomsResponse.data;

  const totalCapacity = classrooms.reduce(
    (acc: number, classroom: any) => acc + classroom.capacity,
    0,
  );

  const totalRegistered = shifts.reduce(
    (acc: number, shift: any) => acc + shift.totalStudentsRegistered,
    0,
  );

  return {
    percentage:
      totalCapacity > 0
        ? parseFloat(((totalRegistered / totalCapacity) * 100).toFixed(2))
        : 0,
  };
}

// Get students not allocated to any shift
export async function getStudentsNotAllocated() {
  const studentsResponse = await API.get("/students");
  const allocationsResponse = await API.get("/allocations");

  const students = studentsResponse.data;
  const allocations = allocationsResponse.data;

  const allocatedStudentIds = new Set(
    allocations.map((allocation: any) => allocation.studentId),
  );

  return students.filter(
    (student: any) => !allocatedStudentIds.has(student.id),
  );
}

// Get all "Aceite" or "Recusado" requests
export async function getSolvedRequests() {
  const requestsResponse = await API.get("/requests");
  const requests = requestsResponse.data;

  return requests.filter(
    (request: any) => request.status === "Aceite" || request.status === "Recusado",
  );
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
export async function updateShiftTotalStudents(
  shiftId: string,
  totalStudentsRegistered: number,
) {
  const validTotal = Math.max(0, totalStudentsRegistered);
  await API.patch(`/shifts/${shiftId}`, {
    totalStudentsRegistered: validTotal,
  });
}

// Atualizar a sala de um turno
export async function updateShiftRoom(shiftId: string, classroomId: string) {
  await API.patch(`/shifts/${shiftId}`, { classroomId });
}

// Get student by ID
export async function getStudentById(studentId: string) {
  const response = await API.get("/students");
  const student = response.data.find(
    (s: any) => String(s.id) === String(studentId),
  );
  if (!student) {
    throw new Error("Aluno não encontrado!");
  }
  return {
    ...student,
    enrolled: student.enrolled.map((id: any) => String(id)),
  };
}

// Get available courses and shifts
export async function getAvailableCourses(enrolledCourses: string[]) {
  const coursesResponse = await API.get("/courses");
  const shiftsResponse = await API.get("/shifts");
  const classroomsResponse = await API.get("/classrooms");
  const buildingsResponse = await API.get("/buildings");

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
          const classroom = classrooms.find(
            (c: any) => String(c.id) === String(shift.classroomId),
          );
          const building = buildings.find(
            (b: any) => String(b.id) === String(classroom?.buildingId),
          );
          return {
            id: String(shift.id),
            name: shift.name,
            type: shift.type,
            room:
              classroom && building
                ? `${building.abbreviation} - ${classroom.name}`
                : "Desconhecida",
            day: shift.day,
            startHour: shift.from,
            endHour: shift.to,
            occupancy: {
              current: shift.totalStudentsRegistered,
              total: classroom ? classroom.capacity : 0,
              percentage: classroom
                ? parseFloat(
                  (
                    (shift.totalStudentsRegistered / classroom.capacity) *
                    100
                  ).toFixed(2),
                )
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

// Get all shifts for a specific UC
export async function getShiftsByCourse(courseId: string) {
  const shiftsResponse = await API.get("/shifts");
  const classroomsResponse = await API.get("/classrooms");
  const buildingsResponse = await API.get("/buildings");

  const shifts = shiftsResponse.data;
  const classrooms = classroomsResponse.data;
  const buildings = buildingsResponse.data;

  return shifts
    .filter((shift: any) => String(shift.courseId) === String(courseId))
    .map((shift: any) => {
      const classroom = classrooms.find(
        (c: any) => String(c.id) === String(shift.classroomId),
      );
      const building = buildings.find(
        (b: any) => String(b.id) === String(classroom?.buildingId),
      );
      return {
        id: String(shift.id),
        name: shift.name,
        type: shift.type,
        room:
          classroom && building
            ? `${building.abbreviation} - ${classroom.name}`
            : "Desconhecida",
        day: shift.day,
        startHour: shift.from,
        endHour: shift.to,
        totalStudentsRegistered: shift.totalStudentsRegistered,
      };
    });
}

// Get available rooms for a specific shift
export async function getAvailableRooms(
  shiftId: string,
  day: string,
  startHour: string,
  endHour: string,
) {
  const shiftsResponse = await API.get("/shifts");
  const classroomsResponse = await API.get("/classrooms");
  const buildingsResponse = await API.get("/buildings");

  const allShifts = shiftsResponse.data;
  const allClassrooms = classroomsResponse.data;
  const allBuildings = buildingsResponse.data;

  const occupiedRooms = allShifts
    .filter(
      (s: any) =>
        s.id !== shiftId &&
        s.day === day &&
        ((s.from >= startHour && s.from < endHour) ||
          (s.to > startHour && s.to <= endHour)),
    )
    .map((s: any) => s.classroomId);

  return allClassrooms
    .filter((room: any) => !occupiedRooms.includes(room.id))
    .map((room: any) => {
      const building = allBuildings.find(
        (b: any) => String(b.id) === String(room.buildingId),
      );
      return {
        id: room.id,
        name: building ? `${building.abbreviation} - ${room.name}` : room.name,
        capacity: room.capacity,
        building: room.buildingId,
      };
    });
}

// --------------------------
// Functions for Classrooms
// --------------------------

// Get info from all classrooms
export async function getAllClassrooms() {
  const classroomsResponse = await API.get("/classrooms");
  const buildingsResponse = await API.get("/buildings");

  const classrooms = classroomsResponse.data.map((room: any) => {
    const building = buildingsResponse.data.find(
      (b: any) => String(b.id) === String(room.buildingId),
    );
    return {
      name: room.name,
      capacity: room.capacity,
      building: building ? building.abbreviation : "-",
    };
  });
  return classrooms;
}

// Get a specific room by ID
export async function getRoomById(roomId: string) {
  const response = await API.get("/classrooms");
  const room = response.data.find((r: any) => String(r.id) === String(roomId));
  if (!room) {
    throw new Error("Sala não encontrada!");
  }
  return room;
}

// Get a room by Shift ID
export async function getRoomByShiftId(shiftId: string) {
  // Buscar o turno pelo ID
  const shiftResponse = await API.get(`/shifts/${shiftId}`);
  const shift = shiftResponse.data;

  if (!shift || !shift.classroomId) {
    throw new Error("Turno ou sala associada não encontrada!");
  }

  // Buscar a sala pelo classroomId do turno
  const roomResponse = await API.get("/classrooms");
  const room = roomResponse.data.find(
    (r: any) => String(r.id) === String(shift.classroomId),
  );

  if (!room) {
    throw new Error("Sala não encontrada para o turno fornecido!");
  }

  const buildingResponse = await API.get("/buildings");
  const building = buildingResponse.data.find(
    (b: any) => String(b.id) === String(room.buildingId),
  );

  return {
    id: room.id,
    name: building ? `${building.name} - ${room.name}` : room.name,
    capacity: room.capacity,
  };
}

// --------------------------
// Functions for Allocations
// --------------------------

// Get all allocations to calculate the last ID
export async function getAllAllocations() {
  const response = await API.get("/allocations");
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
export async function createAllocation(allocation: {
  id: string;
  shiftId: Number;
  studentId: string;
}) {
  await API.post("/allocations", allocation);
}

// Delete an allocation by ID
export async function deleteAllocation(allocationId: string) {
  await API.delete(`/allocations/${allocationId}`);
}

// Add a student to the noAllocations table
export async function addStudentToNoAllocations(studentId: string) {
  const response = await API.get("/noAllocations");
  const noAllocations = response.data;

  const exists = noAllocations.some(
    (entry: any) => entry.studentId === studentId,
  );
  if (!exists) {
    await API.post("/noAllocations", { studentId });
  }
}

// Get allocations for a specific student
export async function getStudentAllocations(studentId: string) {
  const response = await API.get("/allocations");
  return response.data
    .filter((a: any) => String(a.studentId) === String(studentId))
    .map((a: any) => String(a.shiftId));
}

// --------------------------
// Functions for Courses
// --------------------------

// Get all UCs (Unidades Curriculares)
export async function getAllUCs() {
  const response = await API.get("/courses");
  return response.data.map((course: any) => ({
    id: course.id,
    name: course.name,
    abbreviation: course.abbreviation,
    degreeId: course.degreeId,
  }));
}

// Get all UCs (Unidades Curriculares) with ocupation percentage
export async function getAllCoursesWithOccupation(enrolledCourses: string[]) {
  const coursesResponse = await API.get("/courses");
  const shiftsResponse = await API.get("/shifts");
  const classroomsResponse = await API.get("/classrooms");

  const courses = coursesResponse.data;
  const shifts = shiftsResponse.data;
  const classrooms = classroomsResponse.data;

  return courses
    .filter((course: any) => enrolledCourses.includes(String(course.id)))
    .map((course: any) => {
      const courseShifts = shifts.filter(
        (shift: any) => String(shift.courseId) === String(course.id),
      );

      let totalStudents = 0;
      let totalCapacity = 0;

      courseShifts.forEach((shift: any) => {
        const classroom = classrooms.find(
          (c: any) => String(c.id) === String(shift.classroomId),
        );
        if (classroom) {
          totalStudents += shift.totalStudentsRegistered;
          totalCapacity += classroom.capacity;
        }
      });

      const occupancyPercentage =
        totalCapacity > 0 ? (totalStudents / totalCapacity) * 100 : 0;

      let occupancyLevel = "Baixa";
      if (occupancyPercentage > 70) {
        occupancyLevel = "Alta";
      } else if (occupancyPercentage > 30) {
        occupancyLevel = "Média";
      }

      return {
        id: course.id,
        name: course.name,
        year: course.year,
        occupancyLevel,
      };
    });
}

// Get all UCs (Unidades Curriculares) with occupation percentage for all courses
export async function getAllCoursesWithOccupationForAll() {
  const coursesResponse = await API.get("/courses");
  const shiftsResponse = await API.get("/shifts");
  const classroomsResponse = await API.get("/classrooms");

  const courses = coursesResponse.data;
  const shifts = shiftsResponse.data;
  const classrooms = classroomsResponse.data;

  return courses.map((course: any) => {
    const courseShifts = shifts.filter(
      (shift: any) => String(shift.courseId) === String(course.id),
    );

    let totalStudents = 0;
    let totalCapacity = 0;

    courseShifts.forEach((shift: any) => {
      const classroom = classrooms.find(
        (c: any) => String(c.id) === String(shift.classroomId),
      );
      if (classroom) {
        totalStudents += shift.totalStudentsRegistered;
        totalCapacity += classroom.capacity;
      }
    });

    const occupancyPercentage =
      totalCapacity > 0 ? (totalStudents / totalCapacity) * 100 : 0;

    let occupancyLevel = "Baixa";
    if (occupancyPercentage > 70) {
      occupancyLevel = "Alta";
    } else if (occupancyPercentage > 30) {
      occupancyLevel = "Média";
    }

    return {
      id: course.id,
      name: course.name,
      year: course.year,
      occupancyLevel,
    };
  });
}