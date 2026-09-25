import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { BarChart3, Users, BookOpen, Building2, TrendingUp } from 'lucide-react';
import { masterApi } from '../api/masterApi';
import { timetableApi } from '../api/timetableApi';
import toast from 'react-hot-toast';
import PageHeader from '../components/ui/PageHeader';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';

const Analytics = () => {
  const [data, setData] = useState({
    divisions: [],
    subjects: [],
    faculty: [],
    classrooms: [],
    timetableSlots: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      const [divisions, subjects, faculty, classrooms, slots] = await Promise.all([
        masterApi.getDivisions(),
        masterApi.getSubjects(),
        masterApi.getFaculty(),
        masterApi.getClassrooms(),
        timetableApi.getTimetableSlots(),
      ]);

      setData({
        divisions: divisions.data || [],
        subjects: subjects.data || [],
        faculty: faculty.data || [],
        classrooms: classrooms.data || [],
        timetableSlots: slots.data || [],
      });
    } catch (error) {
      toast.error('Failed to fetch analytics data');
    } finally {
      setLoading(false);
    }
  };

  // Prepare chart data...
  const facultyLoadData = data.faculty.map((f) => ({
    name: f.name.split(' ')[1] || f.name,
    maxHours: f.maxHoursPerWeek,
    assigned: data.timetableSlots.filter((s) => s.facultyId === f.id).length,
  }));

  const roomUtilizationData = data.classrooms.map((c) => ({
    name: c.roomNumber,
    capacity: c.capacity,
    used: data.timetableSlots.filter((s) => s.classroomId === c.id).length,
  }));

  const subjectDistributionData = data.subjects.reduce((acc, subject) => {
    const dept = subject.department;
    if (!acc[dept]) acc[dept] = 0;
    acc[dept]++;
    return acc;
  }, {});

  const subjectChartData = Object.entries(subjectDistributionData).map(([name, value]) => ({
    name,
    value,
  }));

  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#84cc16'];

  const departmentWiseDivisions = data.divisions.reduce((acc, div) => {
    if (!acc[div.department]) acc[div.department] = 0;
    acc[div.department]++;
    return acc;
  }, {});

  const divisionChartData = Object.entries(departmentWiseDivisions).map(([name, value]) => ({
    name,
    value,
  }));

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Analytics" icon={BarChart3} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <LoadingSkeleton key={i} className="h-80" variant="card" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        subtitle="Insights and statistics for your timetable system"
        icon={BarChart3}
      />

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Divisions', value: data.divisions.length, icon: Users, color: 'indigo' },
          { label: 'Total Subjects', value: data.subjects.length, icon: BookOpen, color: 'emerald' },
          { label: 'Total Faculty', value: data.faculty.length, icon: TrendingUp, color: 'amber' },
          { label: 'Total Classrooms', value: data.classrooms.length, icon: Building2, color: 'rose' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-soft"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{stat.label}</p>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</h3>
              </div>
              <div className={`bg-gradient-to-br ${
                stat.color === 'indigo' ? 'from-indigo-500 to-purple-500' :
                stat.color === 'emerald' ? 'from-emerald-500 to-green-500' :
                stat.color === 'amber' ? 'from-amber-400 to-orange-500' :
                'from-rose-500 to-red-500'
              } p-3 rounded-xl`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Faculty Load */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-soft"
        >
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Faculty Load Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={facultyLoadData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
              <Bar dataKey="assigned" fill="url(#gradient)" radius={[8, 8, 0, 0]} />
              <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Room Utilization */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-soft"
        >
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Classroom Utilization</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={roomUtilizationData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
              <Bar dataKey="used" fill="url(#gradient2)" radius={[8, 8, 0, 0]} />
              <defs>
                <linearGradient id="gradient2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#34d399" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Subject Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-soft"
        >
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Subject Distribution by Department</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={subjectChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {subjectChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Division Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-soft"
        >
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Divisions by Department</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={divisionChartData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis type="number" stroke="#6b7280" />
              <YAxis dataKey="name" type="category" width={100} stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
              <Bar dataKey="value" fill="url(#gradient3)" radius={[0, 8, 8, 0]} />
              <defs>
                <linearGradient id="gradient3" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#f97316" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics;
