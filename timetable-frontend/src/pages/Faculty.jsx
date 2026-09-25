import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Edit, Trash2, UserCheck, Mail, Building2 } from 'lucide-react';
import { masterApi } from '../api/masterApi';
import toast from 'react-hot-toast';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import FormInput from '../components/ui/FormInput';
import Badge from '../components/ui/Badge';
import PageHeader from '../components/ui/PageHeader';
import EmptyState from '../components/ui/EmptyState';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';
import { DEPARTMENTS, DESIGNATIONS } from '../utils/constants';

const Faculty = () => {
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    designation: '',
    maxHoursPerWeek: '',
  });

  useEffect(() => {
    fetchFaculty();
  }, []);

  const fetchFaculty = async () => {
    try {
      const response = await masterApi.getFaculty();
      setFaculty(response.data || []);
    } catch (error) {
      toast.error('Failed to fetch faculty');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingFaculty) {
        await masterApi.updateFaculty(editingFaculty.id, formData);
        toast.success('Faculty updated successfully');
      } else {
        await masterApi.createFaculty(formData);
        toast.success('Faculty created successfully');
      }
      setIsModalOpen(false);
      setEditingFaculty(null);
      setFormData({ name: '', email: '', department: '', designation: '', maxHoursPerWeek: '' });
      fetchFaculty();
    } catch (error) {
      toast.error(error.message || 'Failed to save faculty');
    }
  };

  const handleEdit = (facultyMember) => {
    setEditingFaculty(facultyMember);
    setFormData({
      name: facultyMember.name,
      email: facultyMember.email,
      department: facultyMember.department,
      designation: facultyMember.designation,
      maxHoursPerWeek: facultyMember.maxHoursPerWeek,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this faculty member?')) {
      try {
        await masterApi.deleteFaculty(id);
        toast.success('Faculty deleted successfully');
        fetchFaculty();
      } catch (error) {
        toast.error('Failed to delete faculty');
      }
    }
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const filteredFaculty = faculty.filter((member) =>
    member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.department?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Faculty" icon={UserCheck} />
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
        title="Faculty"
        subtitle="Manage faculty members and their details"
        icon={UserCheck}
        actions={
          <Button icon={Plus} onClick={() => setIsModalOpen(true)}>
            Add Faculty
          </Button>
        }
      />

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search faculty..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Faculty Cards */}
      {filteredFaculty.length === 0 ? (
        <EmptyState
          icon={UserCheck}
          title="No faculty found"
          description="Get started by adding your first faculty member"
          action={
            <Button icon={Plus} onClick={() => setIsModalOpen(true)}>
              Add Faculty
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFaculty.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-soft hover:shadow-glow transition-all relative overflow-hidden"
            >
              {/* Designation Ribbon */}
              <div className="absolute top-0 right-0 bg-gradient-primary text-white text-xs font-semibold px-3 py-1 rounded-bl-xl">
                {member.designation}
              </div>

              <div className="flex items-start gap-4 mb-4">
                <div className="bg-gradient-primary w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {getInitials(member.name)}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 dark:text-white">{member.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                    <Mail className="w-3 h-3" />
                    {member.email}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-gray-400" />
                  <Badge variant="primary">{member.department}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Max Hours/Week</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{member.maxHoursPerWeek}h</span>
                </div>
              </div>

              <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button
                  size="sm"
                  variant="ghost"
                  className="flex-1"
                  onClick={() => handleEdit(member)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="flex-1 text-rose-600 hover:text-rose-700"
                  onClick={() => handleDelete(member.id)}
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
          setEditingFaculty(null);
          setFormData({ name: '', email: '', department: '', designation: '', maxHoursPerWeek: '' });
        }}
        title={editingFaculty ? 'Edit Faculty' : 'Add Faculty'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Dr. John Smith"
            required
          />
          
          <FormInput
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="e.g., john.smith@college.edu"
            required
          />
          
          <FormInput
            label="Department"
            name="department"
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
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
            label="Designation"
            name="designation"
            value={formData.designation}
            onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
            required
            select
          >
            <option value="">Select Designation</option>
            {Object.values(DESIGNATIONS).map((designation) => (
              <option key={designation} value={designation}>
                {designation}
              </option>
            ))}
          </FormInput>
          
          <FormInput
            label="Max Hours Per Week"
            name="maxHoursPerWeek"
            type="number"
            value={formData.maxHoursPerWeek}
            onChange={(e) => setFormData({ ...formData, maxHoursPerWeek: e.target.value })}
            placeholder="e.g., 20"
            required
          />
          
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              {editingFaculty ? 'Update' : 'Create'} Faculty
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

export default Faculty;
