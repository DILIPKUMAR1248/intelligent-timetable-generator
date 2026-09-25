import axios from 'axios';

const solverClient = axios.create({
  baseURL: 'http://localhost:8084/api/solver',
  timeout: 60000, // 60 seconds for solver
  headers: {
    'Content-Type': 'application/json',
  },
});

export const solverApi = {
  generateTimetable: (data) => solverClient.post('/generate', data),
  healthCheck: () => solverClient.get('/health'),
};
