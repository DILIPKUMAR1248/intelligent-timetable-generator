import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Link, UserCheck, BookOpen, Search } from 'lucide-react';
import { masterApi } from '../api/masterApi';
import toast from 'react-hot-toast';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import FormInput from '../components/ui/FormInput';
import Badge from '../components/ui/Badge';
import PageHeader from '../components/ui/PageHeader';
import EmptyState from '../components/ui/EmptyState';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';

const FacultySubjects = () => {
  const [facultySubjects, setFacultySubjects] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMapping, setEditingMapping] = useState(null);
  const [formData, setFormData] = useState({
    facultyId: '',
    subjectId: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [fsResponse, facultyResponse, subjectsResponse] = await Promise.all([
        masterApi.getFacultySubjects(),
        masterApi.getFaculty(),
        masterApi.getSubjects(),
      ]);
      setFacultySubjects(fsResponse.data || []);
      setFaculty(facultyResponse.data || []);
      setSubjects(subjectsResponse.data || []);
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingMapping) {
        await masterApi.updateFacultySubject(editingMapping.id, formData);
        toast.success('Mapping updated successfully');
      } else {
        await masterApi.createFacultySubject(formData);
        toast.success('Mapping created successfully');
      }
      setIsModalOpen(false);
      setEditingMapping(null);
      setFormData({ facultyId: '', subjectId: '' });
      fetchData();
    } catch (error) {
      toast.error(error.message || 'Failed to save mapping');
    }
  };

  const handleEdit = (mapping) => {
    setEditingMapping(mapping);
    setFormData({
      facultyId: mapping.faculty?.id || mapping.facultyId,
      subjectId: mapping.subject?.id || mapping.subjectId,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this mapping?')) {
      try {
        await masterApi.deleteFacultySubject(id);
        toast.success('Mapping deleted successfully');
        fetchData();
      } catch (error) {
        toast.error('Failed to delete mapping');
      }
    }
  };

  const getFacultyName = (facultyId) => {
    const f = faculty.find((f) => f.id === facultyId);
    return f?.name || 'Unknown';
  };

  const getSubjectName = (subjectId) => {
    const s = subjects.find((s) => s.id === subjectId);
    return s?.name || 'Unknown';
  };

  const filteredMappings = facultySubjects.filter((mapping) => {
    const facultyName = mapping.faculty?.name || getFacultyName(mapping.facultyId);
    const subjectName = mapping.subject?.name || getSubjectName(mapping.subjectId);
    return (
      facultyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subjectName?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Faculty-Subjects" icon={Link} />
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
        title="Faculty-Subjects"
        subtitle="Map faculty members to subjects they can teach"
        icon={Link}
        actions={
          <Button icon={Plus} onClick={() => setIsModalOpen(true)}>
            Add Mapping
          </Button>
        }
      />

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search mappings..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Mappings */}
      {filteredMappings.length === 0 ? (
        <EmptyState
          icon={Link}
          title="No mappings found"
          description="Get started by mapping faculty to subjects"
          action={
            <Button icon={Plus} onClick={() => setIsModalOpen(true)}>
              Add Mapping
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMappings.map((mapping, index) => (
            <motion.div
              key={mapping.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-soft hover:shadow-glow transition-all"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-gradient-primary p-3 rounded-xl">
                  <UserCheck className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 dark:text-white">
                    {mapping.faculty?.name || getFacultyName(mapping.facultyId)}
                  </h3>
                  <p className="text-sm text-gray-500">Faculty</p>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <div className="bg-gradient-secondary p-2 rounded-lg">
                  <BookOpen className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {mapping.subject?.name || getSubjectName(mapping.subjectId)}
                  </p>
                  <p className="text-xs text-gray-500">{mapping.subject?.code || ''}</p>
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button
                  size="sm"
                  variant="ghost"
                  className="flex-1"
                  onClick={() => handleEdit(mapping)}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="flex-1 text-rose-600 hover:text-rose-700"
                  onClick={() => handleDelete(mapping.id)}
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
          setEditingMapping(null);
          setFormData({ facultyId: '', subjectId: '' });
        }}
        title={editingMapping ? 'Edit Mapping' : 'Add Mapping'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            label="Faculty"
            name="facultyId"
            value={formData.facultyId}
            onChange={(e) => setFormData({ ...formData, facultyId: e.target.value })}
            required
            select
          >
            <option value="">Select Faculty</option>
            {faculty.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name} - {f.department}
              </option>
            ))}
          </FormInput>
          
          <FormInput
            label="Subject"
            name="subjectId"
            value={formData.subjectId}
            onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
            required
            select
          >
            <option value="">Select Subject</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.code}) - {s.department}
              </option>
            ))}
          </FormInput>
          
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              {editingMapping ? 'Update' : 'Create'} Mapping
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

export default FacultySubjects;
