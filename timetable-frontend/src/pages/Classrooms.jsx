import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Edit, Trash2, Building2, Users } from 'lucide-react';
import { masterApi } from '../api/masterApi';
import toast from 'react-hot-toast';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import FormInput from '../components/ui/FormInput';
import Badge from '../components/ui/Badge';
import PageHeader from '../components/ui/PageHeader';
import EmptyState from '../components/ui/EmptyState';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';
import { CLASSROOM_TYPES } from '../utils/constants';

const Classrooms = () => {
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClassroom, setEditingClassroom] = useState(null);
  const [formData, setFormData] = useState({
    roomNumber: '',
    capacity: '',
    type: 'LECTURE',
    building: '',
  });

  useEffect(() => {
    fetchClassrooms();
  }, []);

  const fetchClassrooms = async () => {
    try {
      const response = await masterApi.getClassrooms();
      setClassrooms(response.data || []);
    } catch (error) {
      toast.error('Failed to fetch classrooms');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingClassroom) {
        await masterApi.updateClassroom(editingClassroom.id, formData);
        toast.success('Classroom updated successfully');
      } else {
        await masterApi.createClassroom(formData);
        toast.success('Classroom created successfully');
      }
      setIsModalOpen(false);
      setEditingClassroom(null);
      setFormData({ roomNumber: '', capacity: '', type: 'LECTURE', building: '' });
      fetchClassrooms();
    } catch (error) {
      toast.error(error.message || 'Failed to save classroom');
    }
  };

  const handleEdit = (classroom) => {
    setEditingClassroom(classroom);
    setFormData({
      roomNumber: classroom.roomNumber,
      capacity: classroom.capacity,
      type: classroom.type,
      building: classroom.building,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this classroom?')) {
      try {
        await masterApi.deleteClassroom(id);
        toast.success('Classroom deleted successfully');
        fetchClassrooms();
      } catch (error) {
        toast.error('Failed to delete classroom');
      }
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'LAB':
        return 'from-amber-400 to-orange-500';
      case 'SEMINAR':
        return 'from-emerald-500 to-green-500';
      default:
        return 'from-indigo-500 to-purple-500';
    }
  };

  const filteredClassrooms = classrooms.filter((classroom) =>
    classroom.roomNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    classroom.building?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Classrooms" icon={Building2} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <LoadingSkeleton key={i} className="h-40" variant="card" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Classrooms"
        subtitle="Manage classrooms and their capacities"
        icon={Building2}
        actions={
          <Button icon={Plus} onClick={() => setIsModalOpen(true)}>
            Add Classroom
          </Button>
        }
      />

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search classrooms..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Classroom Cards */}
      {filteredClassrooms.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No classrooms found"
          description="Get started by adding your first classroom"
          action={
            <Button icon={Plus} onClick={() => setIsModalOpen(true)}>
              Add Classroom
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClassrooms.map((classroom, index) => (
            <motion.div
              key={classroom.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-soft hover:shadow-glow transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`bg-gradient-to-br ${getTypeColor(classroom.type)} p-3 rounded-xl`}>
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <Badge variant={classroom.type === 'LAB' ? 'lab' : classroom.type === 'SEMINAR' ? 'success' : 'primary'}>
                  {classroom.type}
                </Badge>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {classroom.roomNumber}
              </h3>
              <p className="text-sm text-gray-500 mb-4">{classroom.building}</p>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Capacity</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((classroom.capacity / 100) * 100, 100)}%` }}
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                  />
                </div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {classroom.capacity} students
                </p>
              </div>

              <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button
                  size="sm"
                  variant="ghost"
                  className="flex-1"
                  onClick={() => handleEdit(classroom)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="flex-1 text-rose-600 hover:text-rose-700"
                  onClick={() => handleDelete(classroom.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingClassroom(null);
          setFormData({ roomNumber: '', capacity: '', type: 'LECTURE', building: '' });
        }}
        title={editingClassroom ? 'Edit Classroom' : 'Add Classroom'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            label="Room Number"
            name="roomNumber"
            value={formData.roomNumber}
            onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
            placeholder="e.g., 101"
            required
          />
          
          <FormInput
            label="Building"
            name="building"
            value={formData.building}
            onChange={(e) => setFormData({ ...formData, building: e.target.value })}
            placeholder="e.g., Main Building"
            required
          />
          
          <FormInput
            label="Type"
            name="type"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            required
            select
          >
            <option value="LECTURE">Lecture Hall</option>
            <option value="LAB">Laboratory</option>
            <option value="SEMINAR">Seminar Room</option>
          </FormInput>
          
          <FormInput
            label="Capacity"
            name="capacity"
            type="number"
            value={formData.capacity}
            onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
            placeholder="e.g., 60"
            required
          />
          
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              {editingClassroom ? 'Update' : 'Create'} Classroom
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

export default Classrooms;
