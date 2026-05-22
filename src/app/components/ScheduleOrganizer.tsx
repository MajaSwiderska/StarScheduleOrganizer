import { useState, useEffect } from 'react';
import { Calendar, Plus, LogOut, Edit2, Trash2, X } from 'lucide-react';
import { getSchedules, createSchedule, updateSchedule, deleteSchedule, Schedule, CreateScheduleData } from '../../utils/api';

interface ScheduleOrganizerProps {
  accessToken: string;
  onSignOut: () => void;
}

export default function ScheduleOrganizer({ accessToken, onSignOut }: ScheduleOrganizerProps) {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [formData, setFormData] = useState<CreateScheduleData>({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    loadSchedules();
  }, []);

  const loadSchedules = async () => {
    try {
      const data = await getSchedules(accessToken);
      setSchedules(data.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()));
    } catch (err) {
      console.error('Failed to load schedules:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingSchedule) {
        const updated = await updateSchedule(accessToken, editingSchedule.id, formData);
        setSchedules(schedules.map(s => s.id === updated.id ? updated : s));
      } else {
        const newSchedule = await createSchedule(accessToken, formData);
        setSchedules([...schedules, newSchedule].sort((a, b) =>
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
        ));
      }

      setShowForm(false);
      setEditingSchedule(null);
      setFormData({ title: '', description: '', startDate: '', endDate: '' });
    } catch (err) {
      console.error('Failed to save schedule:', err);
    }
  };

  const handleEdit = (schedule: Schedule) => {
    setEditingSchedule(schedule);
    setFormData({
      title: schedule.title,
      description: schedule.description,
      startDate: schedule.startDate,
      endDate: schedule.endDate,
    });
    setShowForm(true);
  };

  const handleDelete = async (scheduleId: string) => {
    if (!confirm('Are you sure you want to delete this schedule?')) return;

    try {
      await deleteSchedule(accessToken, scheduleId);
      setSchedules(schedules.filter(s => s.id !== scheduleId));
    } catch (err) {
      console.error('Failed to delete schedule:', err);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="size-full bg-gradient-to-br from-[#667eea] to-[#764ba2] p-8 overflow-auto">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <Calendar className="w-8 h-8 text-white" />
            <h1 className="text-3xl font-bold text-white">Schedule Organizer</h1>
          </div>
          <button
            onClick={onSignOut}
            className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>

        <div className="mb-6">
          <button
            onClick={() => {
              setShowForm(true);
              setEditingSchedule(null);
              setFormData({ title: '', description: '', startDate: '', endDate: '' });
            }}
            className="flex items-center gap-2 px-6 py-3 bg-white text-[#667eea] rounded-lg hover:scale-105 transition-transform shadow-lg font-semibold"
          >
            <Plus className="w-5 h-5" />
            New Schedule
          </button>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  {editingSchedule ? 'Edit Schedule' : 'New Schedule'}
                </h2>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setEditingSchedule(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block mb-2 text-gray-700 font-medium">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#667eea] text-black"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-gray-700 font-medium">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#667eea] text-black"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-gray-700 font-medium">Start Date & Time</label>
                  <input
                    type="datetime-local"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#667eea] text-black"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-gray-700 font-medium">End Date & Time</label>
                  <input
                    type="datetime-local"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#667eea] text-black"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-md hover:scale-105 transition-transform font-semibold"
                  >
                    {editingSchedule ? 'Update' : 'Create'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingSchedule(null);
                    }}
                    className="flex-1 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-white text-center text-xl">Loading schedules...</div>
        ) : schedules.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-12 text-center">
            <Calendar className="w-16 h-16 text-white/50 mx-auto mb-4" />
            <p className="text-white text-lg">No schedules yet. Create your first one!</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {schedules.map((schedule) => (
              <div
                key={schedule.id}
                className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold text-gray-800 flex-1">{schedule.title}</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(schedule)}
                      className="text-blue-600 hover:text-blue-800 p-1"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(schedule.id)}
                      className="text-red-600 hover:text-red-800 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="text-gray-600 mb-4">{schedule.description}</p>

                <div className="space-y-1 text-sm text-gray-500">
                  <div>
                    <span className="font-semibold">Start:</span> {formatDate(schedule.startDate)}
                  </div>
                  <div>
                    <span className="font-semibold">End:</span> {formatDate(schedule.endDate)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
