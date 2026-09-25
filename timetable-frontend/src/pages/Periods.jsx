import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Edit, Trash2, Clock, Calendar } from 'lucide-react';
import { masterApi } from '../api/masterApi';
import toast from 'react-hot-toast';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import FormInput from '../components/ui/FormInput';
import Badge from '../components/ui/Badge';
import PageHeader from '../components/ui/PageHeader';
import EmptyState from '../components/ui/EmptyState';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';
import { DAYS } from '../utils/constants';

const Periods = () => {
  const [periods, setPeriods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPeriod, setEditingPeriod] = useState(null);
  const [formData, setFormData] = useState({
    day: 'Monday',
    startTime: '',
    endTime: '',
    periodNumber: '',
  });

  useEffect(() => {
    fetchPeriods();
  }, []);

  const fetchPeriods = async () => {
    try {
      const response = await masterApi.getPeriods();
      setPeriods(response.data || []);
    } catch (error) {
      toast.error('Failed to fetch periods');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPeriod) {
        await masterApi.updatePeriod(editingPeriod.id, formData);
        toast.success('Period updated successfully');
      } else {
        await masterApi.createPeriod(formData);
        toast.success('Period created successfully');
      }
      setIsModalOpen(false);
      setEditingPeriod(null);
      setFormData({ day: 'Monday', startTime: '', endTime: '', periodNumber: '' });
      fetchPeriods();
    } catch (error) {
      toast.error(error.message || 'Failed to save period');
    }
  };

  const handleEdit = (period) => {
    setEditingPeriod(period);
    setFormData({
      day: period.day,
      startTime: period.startTime,
      endTime: period.endTime,
      periodNumber: period.periodNumber,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this period?')) {
      try {
        await masterApi.deletePeriod(id);
        toast.success('Period deleted successfully');
        fetchPeriods();
      } catch (error) {
        toast.error('Failed to delete period');
      }
    }
  };

  const getDayColor = (day) => {
    const colors = {
      Monday: 'from-indigo-500 to-purple-500',
      Tuesday: 'from-blue-500 to-cyan-500',
      Wednesday: 'from-emerald-500 to-green-500',
      Thursday: 'from-amber-400 to-orange-500',
      Friday: 'from-rose-500 to-red-500',
    };
    return colors[day] || colors.Monday;
  };

  const groupedPeriods = DAYS.reduce((acc, day) => {
    acc[day] = periods.filter((p) => p.day === day);
    return acc;
  }, {});

  const filteredPeriods = periods.filter((period) =>
    period.day?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    period.startTime?.includes(searchTerm) ||
    period.endTime?.includes(searchTerm)
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Periods" icon={Clock} />
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <LoadingSkeleton key={i} className="h-20" variant="card" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Periods"
        subtitle="Manage time slots for the weekly schedule"
        icon={Clock}
        actions={
          <Button icon={Plus} onClick={() => setIsModalOpen(true)}>
            Add Period
          </Button>
        }
      />

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search periods..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Timeline View */}
      {filteredPeriods.length === 0 ? (
        <EmptyState
          icon={Clock}
          title="No periods found"
          description="Get started by adding your first period"
          action={
            <Button icon={Plus} onClick={() => setIsModalOpen(true)}>
              Add Period
            </Button>
          }
        />
      ) : (
        <div className="space-y-6">
          {DAYS.map((day) => {
            const dayPeriods = groupedPeriods[day] || [];
            if (dayPeriods.length === 0) return null;

            return (
              <motion.div
                key={day}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-soft"
              >
                <div className={`bg-gradient-to-r ${getDayColor(day)} text-white px-4 py-2 rounded-xl mb-4 inline-block`}>
                  <h3 className="font-bold">{day}</h3>
                </div>

                <div className="space-y-3">
                  {dayPeriods
                    .sort((a, b) => a.periodNumber - b.periodNumber)
                    .map((period, index) => (
                    <motion.div
                      key={period.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className={`bg-gradient-to-br ${getDayColor(day)} w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold`}>
                        {period.periodNumber}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {period.startTime} - {period.endTime}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(period)}
                          className="p-2 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/30 text-indigo-600 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(period.id)}
                          className="p-2 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-900/30 text-rose-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingPeriod(null);
          setFormData({ day: 'Monday', startTime: '', endTime: '', periodNumber: '' });
        }}
        title={editingPeriod ? 'Edit Period' : 'Add Period'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            label="Day"
            name="day"
            value={formData.day}
            onChange={(e) => setFormData({ ...formData, day: e.target.value })}
            required
            select
          >
            {DAYS.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </FormInput>
          
          <FormInput
            label="Period Number"
            name="periodNumber"
            type="number"
            value={formData.periodNumber}
            onChange={(e) => setFormData({ ...formData, periodNumber: e.target.value })}
            placeholder="e.g., 1"
            required
          />
          
          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="Start Time"
              name="startTime"
              type="time"
              value={formData.startTime}
              onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              required
            />
            
            <FormInput
              label="End Time"
              name="endTime"
              type="time"
              value={formData.endTime}
              onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              required
            />
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              {editingPeriod ? 'Update' : 'Create'} Period
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Periods;
