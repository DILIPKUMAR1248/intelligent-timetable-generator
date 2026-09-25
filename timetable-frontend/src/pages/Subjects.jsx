import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Edit, Trash2, BookOpen, Grid, List } from 'lucide-react';
import { masterApi } from '../api/masterApi';
import toast from 'react-hot-toast';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import FormInput from '../components/ui/FormInput';
import Badge from '../components/ui/Badge';
import PageHeader from '../components/ui/PageHeader';
import EmptyState from '../components/ui/EmptyState';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';
import { DEPARTMENTS, SEMESTERS, SUBJECT_TYPES } from '../utils/constants';

const Subjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('table');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    department: '',
    semester: '',
    type: 'THEORY',
    weeklyHours: '',
  });

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const response = await masterApi.getSubjects();
      setSubjects(response.data || []);
    } catch (error) {
      toast.error('Failed to fetch subjects');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSubject) {
        await masterApi.updateSubject(editingSubject.id, formData);
        toast.success('Subject updated successfully');
      } else {
        await masterApi.createSubject(formData);
        toast.success('Subject created successfully');
      }
      setIsModalOpen(false);
      setEditingSubject(null);
      setFormData({ code: '', name: '', department: '', semester: '', type: 'THEORY', weeklyHours: '' });
      fetchSubjects();
    } catch (error) {
      toast.error(error.message || 'Failed to save subject');
    }
  };

  const handleEdit = (subject) => {
    setEditingSubject(subject);
    setFormData({
      code: subject.code,
      name: subject.name,
      department: subject.department,
      semester: subject.semester,
      type: subject.type,
      weeklyHours: subject.weeklyHours,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this subject?')) {
      try {
        await masterApi.deleteSubject(id);
        toast.success('Subject deleted successfully');
        fetchSubjects();
      } catch (error) {
        toast.error('Failed to delete subject');
      }
    }
  };

  const filteredSubjects = subjects.filter((subject) =>
    subject.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subject.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subject.department?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Subjects" icon={BookOpen} />
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
        title="Subjects"
        subtitle="Manage course subjects and their details"
        icon={BookOpen}
        actions={
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              icon={viewMode === 'table' ? Grid : List}
              onClick={() => setViewMode(viewMode === 'table' ? 'card' : 'table')}
            >
              {viewMode === 'table' ? 'Card View' : 'Table View'}
            </Button>
            <Button icon={Plus} onClick={() => setIsModalOpen(true)}>
              Add Subject
            </Button>
          </div>
        }
      />

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search subjects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Content */}
      {filteredSubjects.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No subjects found"
          description="Get started by adding your first subject"
          action={
            <Button icon={Plus} onClick={() => setIsModalOpen(true)}>
              Add Subject
            </Button>
          }
        />
      ) : viewMode === 'table' ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-soft overflow-hidden">
          <table className="w-full">
            <thead className="bg-gradient-primary text-white">
              <tr>
                <th className="px-6 py-4 text-left font-semibold">Code</th>
                <th className="px-6 py-4 text-left font-semibold">Name</th>
                <th className="px-6 py-4 text-left font-semibold">Department</th>
                <th className="px-6 py-4 text-left font-semibold">Semester</th>
                <th className="px-6 py-4 text-left font-semibold">Type</th>
                <th className="px-6 py-4 text-left font-semibold">Hours/Week</th>
                <th className="px-6 py-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubjects.map((subject, index) => (
                <motion.tr
                  key={subject.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <td className="px-6 py-4 font-mono text-sm text-gray-900 dark:text-white">
                    {subject.code}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                    {subject.name}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="primary">{subject.department}</Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="info">Semester {subject.semester}</Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={subject.type === 'LAB' ? 'lab' : 'theory'}>
                      {subject.type}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                    {subject.weeklyHours}h
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(subject)}
                        className="p-2 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/30 text-indigo-600 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(subject.id)}
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
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSubjects.map((subject, index) => (
            <motion.div
              key={subject.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-soft hover:shadow-glow transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">{subject.name}</h3>
                  <p className="text-sm text-gray-500 font-mono">{subject.code}</p>
                </div>
                <Badge variant={subject.type === 'LAB' ? 'lab' : 'theory'}>
                  {subject.type}
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="primary" size="sm">{subject.department}</Badge>
                  <Badge variant="info" size="sm">Sem {subject.semester}</Badge>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {subject.weeklyHours} hours per week
                </p>
              </div>
              <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button
                  size="sm"
                  variant="ghost"
                  className="flex-1"
                  onClick={() => handleEdit(subject)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="flex-1 text-rose-600 hover:text-rose-700"
                  onClick={() => handleDelete(subject.id)}
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
          setEditingSubject(null);
          setFormData({ code: '', name: '', department: '', semester: '', type: 'THEORY', weeklyHours: '' });
        }}
        title={editingSubject ? 'Edit Subject' : 'Add Subject'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            label="Subject Code"
            name="code"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            placeholder="e.g., CS101"
            required
          />
          
          <FormInput
            label="Subject Name"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Introduction to Programming"
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
          
          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="Semester"
              name="semester"
              value={formData.semester}
              onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
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
              label="Type"
              name="type"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              required
              select
            >
              <option value="THEORY">Theory</option>
              <option value="LAB">Lab</option>
              <option value="SEMINAR">Seminar</option>
            </FormInput>
          </div>
          
          <FormInput
            label="Weekly Hours"
            name="weeklyHours"
            type="number"
            value={formData.weeklyHours}
            onChange={(e) => setFormData({ ...formData, weeklyHours: e.target.value })}
            placeholder="e.g., 4"
            required
          />
          
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              {editingSubject ? 'Update' : 'Create'} Subject
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

export default Subjects;
