import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, BookOpen, UserCheck, Building2, 
  BarChart3, Calendar, Sparkles, TrendingUp,
  ArrowRight, Clock
} from 'lucide-react';
import StatCard from '../components/ui/StatCard';
import Button from '../components/ui/Button';
import GradientText from '../components/ui/GradientText';
import { masterApi } from '../api/masterApi';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    divisions: 0,
    subjects: 0,
    faculty: 0,
    classrooms: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [divisions, subjects, faculty, classrooms] = await Promise.all([
        masterApi.getDivisions(),
        masterApi.getSubjects(),
        masterApi.getFaculty(),
        masterApi.getClassrooms(),
      ]);

      setStats({
        divisions: divisions.data?.length || 0,
        subjects: subjects.data?.length || 0,
        faculty: faculty.data?.length || 0,
        classrooms: classrooms.data?.length || 0,
      });
    } catch (error) {
      toast.error('Failed to fetch statistics');
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    { icon: Users, label: 'Add Division', path: '/divisions', color: 'indigo' },
    { icon: BookOpen, label: 'Add Subject', path: '/subjects', color: 'emerald' },
    { icon: UserCheck, label: 'Add Faculty', path: '/faculty', color: 'amber' },
    { icon: Building2, label: 'Add Classroom', path: '/classrooms', color: 'rose' },
  ];

  const recentActivity = [
    { action: 'Timetable generated for CS Division A', time: '2 hours ago', type: 'success' },
    { action: 'New faculty member added: Dr. Smith', time: '5 hours ago', type: 'info' },
    { action: 'Physics Lab schedule updated', time: '1 day ago', type: 'warning' },
    { action: 'Room 101 capacity increased', time: '2 days ago', type: 'info' },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-primary rounded-3xl p-8 text-white relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTh6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
        
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-2">
            Welcome to <GradientText size="text-4xl">TimetableAI</GradientText>
          </h1>
          <p className="text-white/80 text-lg mb-6 max-w-2xl">
            AI-powered timetable generation for educational institutions. 
            Create optimal schedules in seconds with our intelligent constraint solver.
          </p>
          
          <div className="flex gap-4">
            <Button
              size="lg"
              icon={Sparkles}
              onClick={() => navigate('/generate')}
            >
              Generate Timetable
            </Button>
            <Button
              size="lg"
              variant="secondary"
              icon={Calendar}
              onClick={() => navigate('/timetable')}
              className="!bg-white/20 !border-white/30 !text-white hover:!bg-white/30"
            >
              View Timetable
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Divisions"
          value={stats.divisions}
          icon={Users}
          trend="up"
          trendValue="12%"
          color="indigo"
        />
        <StatCard
          title="Subjects"
          value={stats.subjects}
          icon={BookOpen}
          trend="up"
          trendValue="8%"
          color="emerald"
        />
        <StatCard
          title="Faculty"
          value={stats.faculty}
          icon={UserCheck}
          trend="up"
          trendValue="5%"
          color="amber"
        />
        <StatCard
          title="Classrooms"
          value={stats.classrooms}
          icon={Building2}
          trend="up"
          trendValue="3%"
          color="rose"
        />
      </div>

      {/* Quick Actions & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-soft"
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-500" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {quickActions.map((action) => (
              <button
                key={action.label}
                onClick={() => navigate(action.path)}
                className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all group"
              >
                <div className={`bg-gradient-to-br ${action.color === 'indigo' ? 'from-indigo-500 to-purple-500' : action.color === 'emerald' ? 'from-emerald-500 to-green-500' : action.color === 'amber' ? 'from-amber-400 to-orange-500' : 'from-rose-500 to-red-500'} p-2 rounded-lg`}>
                  <action.icon className="w-5 h-5 text-white" />
                </div>
                <span className="font-medium text-gray-700 dark:text-gray-300 group-hover:text-indigo-600">
                  {action.label}
                </span>
                <ArrowRight className="w-4 h-4 text-gray-400 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-soft"
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-500" />
            Recent Activity
          </h2>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  activity.type === 'success' ? 'bg-emerald-500' :
                  activity.type === 'warning' ? 'bg-amber-500' :
                  'bg-blue-500'
                }`} />
                <div className="flex-1">
                  <p className="text-sm text-gray-700 dark:text-gray-300">{activity.action}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Faculty Load Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-soft"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-500" />
            Faculty Load Overview
          </h2>
          <Button variant="ghost" size="sm" icon={TrendingUp} onClick={() => navigate('/analytics')}>
            View Analytics
          </Button>
        </div>
        
        <div className="space-y-4">
          {[
            { name: 'Dr. Johnson', load: 85, color: 'from-indigo-500 to-purple-500' },
            { name: 'Prof. Smith', load: 72, color: 'from-emerald-500 to-green-500' },
            { name: 'Dr. Williams', load: 65, color: 'from-amber-400 to-orange-500' },
            { name: 'Prof. Brown', load: 58, color: 'from-rose-500 to-red-500' },
          ].map((faculty, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="w-32 text-sm font-medium text-gray-700 dark:text-gray-300">
                {faculty.name}
              </div>
              <div className="flex-1 h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${faculty.load}%` }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                  className={`h-full bg-gradient-to-r ${faculty.color} rounded-full`}
                />
              </div>
              <div className="w-12 text-sm font-semibold text-gray-700 dark:text-gray-300 text-right">
                {faculty.load}%
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
