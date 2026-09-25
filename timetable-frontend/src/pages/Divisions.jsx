import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Edit, Trash2, Users } from 'lucide-react';
import { masterApi } from '../api/masterApi';
import toast from 'react-hot-toast';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import FormInput from '../components/ui/FormInput';
import Badge from '../components/ui/Badge';
import PageHeader from '../components/ui/PageHeader';
import EmptyState from '../components/ui/EmptyState';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';
import { DEPARTMENTS, SEMESTERS } from '../utils/constants';

const Divisions = () => {
  const [divisions, setDivisions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDivision, setEditingDivision] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    department: '',
    strength: '',
    semester: '',
  });

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingDivision) {
        await masterApi.updateDivision(editingDivision.id, formData);
        toast.success('Division updated successfully');
      } else {
        await masterApi.createDivision(formData);
        toast.success('Division created successfully');
      }
      setIsModalOpen(false);
      setEditingDivision(null);
      setFormData({ name: '', department: '', strength: '', semester: '' });
      fetchDivisions();
    } catch (error) {
      toast.error(error.message || 'Failed to save division');
    }
  };

  const handleEdit = (division) => {
    setEditingDivision(division);
    setFormData({
      name: division.name,
      department: division.department,
      strength: division.strength,
      semester: division.semester,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this division?')) {
      try {
        await masterApi.deleteDivision(id);
        toast.success('Division deleted successfully');
        fetchDivisions();
      } catch (error) {
        toast.error('Failed to delete division');
      }
    }
  };

  const filteredDivisions = divisions.filter((division) =>
    division.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    division.department?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Divisions" icon={Users} />
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <LoadingSkeleton key={i} className="h-16" variant="card" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Divisions"
        subtitle="Manage student divisions and classes"
        icon={Users}
        actions={
          <Button icon={Plus} onClick={() => setIsModalOpen(true)}>
            Add Division
          </Button>
        }
      />

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search divisions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Table */}
      {filteredDivisions.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No divisions found"
          description="Get started by adding your first division"
          action={
            <Button icon={Plus} onClick={() => setIsModalOpen(true)}>
              Add Division
            </Button>
          }
        />
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-soft overflow-hidden">
          <table className="w-full">
            <thead className="bg-gradient-primary text-white">
              <tr>
                <th className="px-6 py-4 text-left font-semibold">Name</th>
                <th className="px-6 py-4 text-left font-semibold">Department</th>
                <th className="px-6 py-4 text-left font-semibold">Semester</th>
                <th className="px-6 py-4 text-left font-semibold">Strength</th>
                <th className="px-6 py-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDivisions.map((division, index) => (
                <motion.tr
                  key={division.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                    {division.name}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="primary">{division.department}</Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="info">Semester {division.semester}</Badge>
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                    {division.strength} students
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(division)}
                        className="p-2 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/30 text-indigo-600 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(division.id)}
                        className="p-2 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-900/30 text-rose-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingDivision(null);
          setFormData({ name: '', department: '', strength: '', semester: '' });
        }}
        title={editingDivision ? 'Edit Division' : 'Add Division'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            label="Division Name"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Computer Science A"
            required
          />
          
          <FormInput
            label="Department"
            name="department"
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            placeholder="Select department"
            required
            select
          >
            <option value="">Select Department</option>
            {Object.values(DEPARTMENTS).map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </FormInput>
          
          <FormInput
            label="Semester"
            name="semester"
            value={formData.semester}
            onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
            placeholder="Select semester"
            required
            select
          >
            <option value="">Select Semester</option>
            {SEMESTERS.map((sem) => (
              <option key={sem} value={sem}>
                Semester {sem}
              </option>
            ))}
          </FormInput>
          
          <FormInput
            label="Strength"
            name="strength"
            type="number"
            value={formData.strength}
            onChange={(e) => setFormData({ ...formData, strength: e.target.value })}
            placeholder="Number of students"
            required
          />
          
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              {editingDivision ? 'Update' : 'Create'} Division
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

export default Divisions;
