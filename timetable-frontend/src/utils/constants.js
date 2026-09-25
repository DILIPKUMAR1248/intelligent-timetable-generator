// API endpoints
export const API_ENDPOINTS = {
  MASTER_DATA: 'http://localhost:8082/api',
  TIMETABLE: 'http://localhost:8083/api',
  SOLVER: 'http://localhost:8084/api/solver',
};

// Subject types
export const SUBJECT_TYPES = {
  THEORY: 'THEORY',
  LAB: 'LAB',
  SEMINAR: 'SEMINAR',
};

// Classroom types
export const CLASSROOM_TYPES = {
  LECTURE: 'LECTURE',
  LAB: 'LAB',
  SEMINAR: 'SEMINAR',
};

// Days of week
export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

// Designations
export const DESIGNATIONS = {
  PROFESSOR: 'Professor',
  ASSOCIATE_PROFESSOR: 'Associate Professor',
  ASSISTANT_PROFESSOR: 'Assistant Professor',
  LECTURER: 'Lecturer',
};

// Departments
export const DEPARTMENTS = {
  COMPUTER_SCIENCE: 'Computer Science',
  ELECTRICAL_ENGINEERING: 'Electrical Engineering',
  MECHANICAL_ENGINEERING: 'Mechanical Engineering',
  CIVIL_ENGINEERING: 'Civil Engineering',
  PHYSICS: 'Physics',
  CHEMISTRY: 'Chemistry',
  MATHEMATICS: 'Mathematics',
};

// Semesters
export const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];

// Navigation items
export const NAV_ITEMS = [
  {
    path: '/',
    label: 'Dashboard',
    icon: 'LayoutDashboard',
    color: 'from-indigo-500 to-purple-500',
  },
  {
    path: '/divisions',
    label: 'Divisions',
    icon: 'Users',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    path: '/subjects',
    label: 'Subjects',
    icon: 'BookOpen',
    color: 'from-emerald-500 to-green-500',
  },
  {
    path: '/faculty',
    label: 'Faculty',
    icon: 'UserCheck',
    color: 'from-amber-500 to-orange-500',
  },
  {
    path: '/classrooms',
    label: 'Classrooms',
    icon: 'Building2',
    color: 'from-rose-500 to-red-500',
  },
  {
    path: '/periods',
    label: 'Periods',
    icon: 'Clock',
    color: 'from-violet-500 to-purple-500',
  },
  {
    path: '/faculty-subjects',
    label: 'Faculty-Subjects',
    icon: 'Link',
    color: 'from-pink-500 to-rose-500',
  },
  {
    path: '/timetable',
    label: 'Timetable',
    icon: 'Calendar',
    color: 'from-cyan-500 to-blue-500',
  },
  {
    path: '/generate',
    label: 'Generate',
    icon: 'Sparkles',
    color: 'from-purple-500 to-pink-500',
  },
  {
    path: '/analytics',
    label: 'Analytics',
    icon: 'BarChart3',
    color: 'from-teal-500 to-emerald-500',
  },
];

// Toast styles
export const TOAST_STYLES = {
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
  info: {
    style: {
      background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
      color: 'white',
      borderRadius: '12px',
      padding: '16px',
    },
  },
};
