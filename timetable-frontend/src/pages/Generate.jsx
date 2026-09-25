import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Users, CheckCircle, XCircle, AlertTriangle, RefreshCw, Calendar } from 'lucide-react';
import { solverApi } from '../api/solverApi';
import { masterApi } from '../api/masterApi';
import toast from 'react-hot-toast';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import PageHeader from '../components/ui/PageHeader';
import EmptyState from '../components/ui/EmptyState';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';
import GradientText from '../components/ui/GradientText';
import confetti from 'canvas-confetti';

const Generate = () => {
  const [divisions, setDivisions] = useState([]);
  const [selectedDivisions, setSelectedDivisions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');
  const [result, setResult] = useState(null);

  useEffect(() => {
    fetchDivisions();
  }, []);

  const fetchDivisions = async () => {
    try {
      const response = await masterApi.getDivisions();
      setDivisions(response.data || []);
    } catch (error) {
      toast.error('Failed to fetch divisions');
    } finally {
      setLoading(false);
    }
  };

  const toggleDivision = (divisionId) => {
    setSelectedDivisions((prev) =>
      prev.includes(divisionId)
        ? prev.filter((id) => id !== divisionId)
        : [...prev, divisionId]
    );
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#6366f1', '#a855f7', '#ec4899', '#10b981', '#f59e0b'],
    });
  };

  const handleGenerate = async () => {
    if (selectedDivisions.length === 0) {
      toast.error('Please select at least one division');
      return;
    }

    setGenerating(true);
    setProgress(0);
    setStatus('Initializing...');
    setResult(null);

    const statusMessages = [
      'Analyzing constraints...',
      'Loading faculty data...',
      'Processing subject requirements...',
      'Building optimization model...',
      'Running OR-Tools solver...',
      'Optimizing schedule...',
      'Validating solution...',
      'Saving timetable...',
    ];

    let statusIndex = 0;
    const statusInterval = setInterval(() => {
      if (statusIndex < statusMessages.length) {
        setStatus(statusMessages[statusIndex]);
        statusIndex++;
        setProgress((prev) => Math.min(prev + 12.5, 87.5));
      }
    }, 1500);

    try {
      const response = await solverApi.generateTimetable({ divisionIds: selectedDivisions });
      
      clearInterval(statusInterval);
      setProgress(100);
      setStatus('Complete!');

      setResult(response.data);

      if (response.data.status === 'SUCCESS') {
        triggerConfetti();
        toast.success('Timetable generated successfully!');
      } else if (response.data.status === 'IMPOSSIBLE') {
        toast.error('Could not generate a feasible timetable');
      } else {
        toast.error('Failed to generate timetable');
      }
    } catch (error) {
      clearInterval(statusInterval);
      toast.error(error.message || 'Failed to generate timetable');
      setResult({
        status: 'ERROR',
        message: error.message || 'An error occurred',
        conflicts: [],
      });
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Generate Timetable" icon={Sparkles} />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <LoadingSkeleton key={i} className="h-24" variant="card" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Generate Timetable"
        subtitle="AI-powered timetable generation using constraint optimization"
        icon={Sparkles}
      />

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-primary rounded-3xl p-8 text-white relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTh6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
        
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-4">
            <GradientText size="text-4xl">AI-Powered Timetable Generation</GradientText>
          </h1>
          <p className="text-white/80 text-lg max-w-2xl">
            Our intelligent constraint solver uses Google OR-Tools to generate optimal timetables 
            that satisfy all your requirements in seconds.
          </p>
        </div>
      </motion.div>

      {/* Division Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-indigo-500" />
          Select Divisions
        </h2>
        
        {divisions.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No divisions available"
            description="Add divisions first to generate timetables"
            action={
              <Button icon={Users} onClick={() => (window.location.href = '/divisions')}>
                Add Divisions
              </Button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {divisions.map((division) => (
              <motion.button
                key={division.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => toggleDivision(division.id)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  selectedDivisions.includes(division.id)
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-indigo-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedDivisions.includes(division.id)
                        ? 'border-indigo-500 bg-indigo-500'
                        : 'border-gray-300'
                    }`}
                  >
                    {selectedDivisions.includes(division.id) && (
                      <CheckCircle className="w-3 h-3 text-white" />
                    )}
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-gray-900 dark:text-white">{division.name}</p>
                    <p className="text-sm text-gray-500">{division.department} - Sem {division.semester}</p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </motion.div>

      {/* Generate Button */}
      {!generating && !result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center"
        >
          <Button
            size="xl"
            icon={Sparkles}
            onClick={handleGenerate}
            disabled={selectedDivisions.length === 0}
            className="px-12 py-4 text-lg"
          >
            Generate Timetable
          </Button>
        </motion.div>
      )}

      {/* Generation Progress */}
      <AnimatePresence>
        {generating && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-soft"
          >
            <div className="text-center mb-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="inline-block bg-gradient-primary p-4 rounded-full mb-4"
              >
                <Sparkles className="w-8 h-8 text-white" />
              </motion.div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Generating Timetable
              </h3>
              <p className="text-gray-600 dark:text-gray-400">{status}</p>
            </div>

            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-gradient-primary rounded-full"
              />
            </div>
            <p className="text-center text-sm text-gray-500 mt-2">{Math.round(progress)}%</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Result */}
      <AnimatePresence>
        {result && !generating && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`rounded-2xl p-8 ${
              result.status === 'SUCCESS'
                ? 'bg-gradient-success text-white'
                : result.status === 'IMPOSSIBLE'
                ? 'bg-gradient-error text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-white/20">
                {result.status === 'SUCCESS' ? (
                  <CheckCircle className="w-8 h-8" />
                ) : result.status === 'IMPOSSIBLE' ? (
                  <XCircle className="w-8 h-8" />
                ) : (
                  <AlertTriangle className="w-8 h-8" />
                )}
              </div>
              
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2">
                  {result.status === 'SUCCESS'
                    ? 'Timetable Generated Successfully!'
                    : result.status === 'IMPOSSIBLE'
                    ? 'Could Not Generate Timetable'
                    : 'Generation Failed'}
                </h3>
                <p className="text-white/80 mb-4">{result.message}</p>

                {result.conflicts && result.conflicts.length > 0 && (
                  <div className="space-y-2">
                    <p className="font-semibold">Issues detected:</p>
                    <ul className="list-disc list-inside space-y-1 text-white/90">
                      {result.conflicts.map((conflict, index) => (
                        <li key={index}>{conflict}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.slots && result.slots.length > 0 && (
                  <p className="mt-4 font-semibold">
                    Generated {result.slots.length} timetable slots
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              {result.status === 'SUCCESS' && (
                <Button
                  icon={Calendar}
                  onClick={() => (window.location.href = '/timetable')}
                  className="!bg-white !text-emerald-600 hover:!bg-gray-100"
                >
                  View Timetable
                </Button>
              )}
              <Button
                variant="outline"
                icon={RefreshCw}
                onClick={() => {
                  setResult(null);
                  setSelectedDivisions([]);
                }}
                className="!bg-white/20 !border-white/30 !text-white hover:!bg-white/30"
              >
                Generate Again
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Generate;
