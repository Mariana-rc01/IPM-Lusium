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
