import axiosClient from './axiosClient';

export const masterApi = {
  // Divisions
  getDivisions: () => axiosClient.get('/divisions'),
  getDivision: (id) => axiosClient.get(`/divisions/${id}`),
  createDivision: (data) => axiosClient.post('/divisions', data),
  updateDivision: (id, data) => axiosClient.put(`/divisions/${id}`, data),
  deleteDivision: (id) => axiosClient.delete(`/divisions/${id}`),

  // Subjects
  getSubjects: () => axiosClient.get('/subjects'),
  getSubject: (id) => axiosClient.get(`/subjects/${id}`),
  createSubject: (data) => axiosClient.post('/subjects', data),
  updateSubject: (id, data) => axiosClient.put(`/subjects/${id}`, data),
  deleteSubject: (id) => axiosClient.delete(`/subjects/${id}`),

  // Faculty
  getFaculty: () => axiosClient.get('/faculty'),
  getFacultyMember: (id) => axiosClient.get(`/faculty/${id}`),
  createFaculty: (data) => axiosClient.post('/faculty', data),
  updateFaculty: (id, data) => axiosClient.put(`/faculty/${id}`, data),
  deleteFaculty: (id) => axiosClient.delete(`/faculty/${id}`),

  // Classrooms
  getClassrooms: () => axiosClient.get('/classrooms'),
  getClassroom: (id) => axiosClient.get(`/classrooms/${id}`),
  createClassroom: (data) => axiosClient.post('/classrooms', data),
  updateClassroom: (id, data) => axiosClient.put(`/classrooms/${id}`, data),
  deleteClassroom: (id) => axiosClient.delete(`/classrooms/${id}`),

  // Periods
  getPeriods: () => axiosClient.get('/periods'),
  getPeriod: (id) => axiosClient.get(`/periods/${id}`),
  createPeriod: (data) => axiosClient.post('/periods', data),
  updatePeriod: (id, data) => axiosClient.put(`/periods/${id}`, data),
  deletePeriod: (id) => axiosClient.delete(`/periods/${id}`),

  // Faculty-Subjects
  getFacultySubjects: () => axiosClient.get('/faculty-subjects'),
  getFacultySubject: (id) => axiosClient.get(`/faculty-subjects/${id}`),
  createFacultySubject: (data) => axiosClient.post('/faculty-subjects', data),
  updateFacultySubject: (id, data) => axiosClient.put(`/faculty-subjects/${id}`, data),
  deleteFacultySubject: (id) => axiosClient.delete(`/faculty-subjects/${id}`),
};
