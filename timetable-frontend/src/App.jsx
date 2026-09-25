import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Divisions from './pages/Divisions';
import Subjects from './pages/Subjects';
import Faculty from './pages/Faculty';
import Classrooms from './pages/Classrooms';
import Periods from './pages/Periods';
import FacultySubjects from './pages/FacultySubjects';
import Timetable from './pages/Timetable';
import Generate from './pages/Generate';
import Analytics from './pages/Analytics';

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" toastOptions={TOAST_STYLES} />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="divisions" element={<Divisions />} />
          <Route path="subjects" element={<Subjects />} />
          <Route path="faculty" element={<Faculty />} />
          <Route path="classrooms" element={<Classrooms />} />
          <Route path="periods" element={<Periods />} />
          <Route path="faculty-subjects" element={<FacultySubjects />} />
          <Route path="timetable" element={<Timetable />} />
          <Route path="generate" element={<Generate />} />
          <Route path="analytics" element={<Analytics />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

const TOAST_STYLES = {
  style: {
    background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)',
    color: 'white',
    borderRadius: '12px',
    padding: '16px',
    fontWeight: '500',
  },
  success: {
    style: {
      background: 'linear-gradient(135deg, #10b981 0%, #22c55e 100%)',
      color: 'white',
      borderRadius: '12px',
      padding: '16px',
    },
  },
  error: {
    style: {
      background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      color: 'white',
      borderRadius: '12px',
      padding: '16px',
    },
  },
};

export default App;
