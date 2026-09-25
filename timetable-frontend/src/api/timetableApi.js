import axios from 'axios';

const timetableClient = axios.create({
  baseURL: 'http://localhost:8083/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const timetableApi = {
  getTimetableSlots: () => timetableClient.get('/timetable-slots'),
  getTimetableSlotsByDivision: (id) => timetableClient.get(`/timetable-slots/division/${id}`),
  getTimetableSlotsByFaculty: (id) => timetableClient.get(`/timetable-slots/faculty/${id}`),
  saveTimetableSlots: (data) => timetableClient.post('/timetable-slots/bulk', data),
};
