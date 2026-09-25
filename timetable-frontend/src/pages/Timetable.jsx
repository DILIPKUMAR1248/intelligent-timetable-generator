import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Download, Printer, Users, ChevronDown } from 'lucide-react';
import { timetableApi } from '../api/timetableApi';
import { masterApi } from '../api/masterApi';
import toast from 'react-hot-toast';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import PageHeader from '../components/ui/PageHeader';
import EmptyState from '../components/ui/EmptyState';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';
import { DAYS } from '../utils/constants';
import { getSubjectColor } from '../utils/colors';

const Timetable = () => {
  const [divisions, setDivisions] = useState([]);
  const [selectedDivision, setSelectedDivision] = useState(null);
  const [timetableSlots, setTimetableSlots] = useState([]);
  const [periods, setPeriods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (selectedDivision) {
      fetchTimetable(selectedDivision);
    }
  }, [selectedDivision]);

  const fetchInitialData = async () => {
    try {
      const [divisionsResponse, periodsResponse] = await Promise.all([
        masterApi.getDivisions(),
        masterApi.getPeriods(),
      ]);
      setDivisions(divisionsResponse.data || []);
      setPeriods(periodsResponse.data || []);
      
      if (divisionsResponse.data?.length > 0) {
        setSelectedDivision(divisionsResponse.data[0].id);
      }
    } catch (error) {
      toast.error('Failed to fetch initial data');
    } finally {
      setLoading(false);
    }
  };

  const fetchTimetable = async (divisionId) => {
    try {
      const response = await timetableApi.getTimetableSlotsByDivision(divisionId);
      setTimetableSlots(response.data || []);
    } catch (error) {
      toast.error('Failed to fetch timetable');
    }
  };

  const getSlotForPeriodAndDay = (periodId, day) => {
    return timetableSlots.find(
      (slot) => slot.periodId === periodId && slot.period?.day === day
    );
  };

  const handleExport = () => {
    toast.success('Exporting timetable to PDF...');
    // Implement PDF export logic here
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Timetable" icon={Calendar} />
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <LoadingSkeleton key={i} className="h-32" variant="card" />
          ))}
        </div>
      </div>
    );
  }

  const selectedDivisionData = divisions.find((d) => d.id === selectedDivision);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Timetable"
        subtitle="View and manage class schedules"
        icon={Calendar}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" icon={Download} onClick={handleExport}>
              Export
            </Button>
            <Button variant="outline" size="sm" icon={Printer} onClick={handlePrint}>
              Print
            </Button>
          </div>
        }
      />

      {/* Division Selector */}
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-indigo-500 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="bg-gradient-primary p-2 rounded-lg">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <p className="text-sm text-gray-500">Selected Division</p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {selectedDivisionData?.name || 'Select a division'}
              </p>
            </div>
          </div>
          <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
        </button>

        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-10 max-h-60 overflow-y-auto"
          >
            {divisions.map((division) => (
              <button
                key={division.id}
                onClick={() => {
                  setSelectedDivision(division.id);
                  setShowDropdown(false);
                }}
                className={`w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                  selectedDivision === division.id ? 'bg-indigo-50 dark:bg-indigo-900/20' : ''
                }`}
              >
                <p className="font-medium text-gray-900 dark:text-white">{division.name}</p>
                <p className="text-sm text-gray-500">{division.department} - Sem {division.semester}</p>
              </button>
            ))}
          </motion.div>
        )}
      </div>

      {/* Timetable Grid */}
      {timetableSlots.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No timetable generated"
          description="Generate a timetable for this division to view the schedule"
          action={
            <Button icon={Calendar} onClick={() => window.location.href = '/generate'}>
              Generate Timetable
            </Button>
          }
        />
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-primary text-white">
                  <th className="px-4 py-3 text-left font-semibold min-w-[120px]">Time</th>
                  {DAYS.map((day) => (
                    <th key={day} className="px-4 py-3 text-center font-semibold min-w-[150px]">
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {periods
                  .filter((p) => p.day === 'Monday')
                  .sort((a, b) => a.periodNumber - b.periodNumber)
                  .map((period) => (
                    <tr key={period.id} className="border-b border-gray-200 dark:border-gray-700">
                      <td className="px-4 py-3 font-medium text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700/50">
                        <div className="text-sm">
                          <p className="font-semibold">Period {period.periodNumber}</p>
                          <p className="text-xs text-gray-500">{period.startTime} - {period.endTime}</p>
                        </div>
                      </td>
                      {DAYS.map((day) => {
                        const slot = timetableSlots.find(
                          (s) => s.periodId === period.id && s.period?.day === day
                        );
                        
                        if (!slot) {
                          return (
                            <td key={day} className="px-2 py-2">
                              <div className="h-20 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center text-gray-400 text-sm">
                                Free
                              </div>
                            </td>
                          );
                        }

                        const subjectColor = getSubjectColor(slot.subject?.name);
                        
                        return (
                          <td key={day} className="px-2 py-2">
                            <motion.div
                              initial={{ scale: 0.9, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              whileHover={{ scale: 1.05, y: -2 }}
                              className={`h-20 rounded-lg p-2 bg-gradient-to-br ${subjectColor.bg} shadow-sm hover:shadow-md transition-all cursor-pointer`}
                            >
                              <p className="font-bold text-white text-sm truncate">
                                {slot.subject?.name || 'Unknown'}
                              </p>
                              <p className="text-xs text-white/80 truncate">
                                {slot.faculty?.name || 'TBA'}
                              </p>
                              <p className="text-xs text-white/60 truncate">
                                {slot.classroom?.roomNumber || 'TBA'}
                              </p>
                            </motion.div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Legend */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Subject Legend</p>
            <div className="flex flex-wrap gap-3">
              {Array.from(new Set(timetableSlots.map((s) => s.subject?.name))).map((subjectName) => {
                const color = getSubjectColor(subjectName);
                return (
                  <div key={subjectName} className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded bg-gradient-to-br ${color.bg}`} />
                    <span className="text-sm text-gray-600 dark:text-gray-400">{subjectName}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Timetable;
