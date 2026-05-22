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
    priority: 'medium',
    progress: 0,
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
      setFormData({ title: '', description: '', startDate: '', endDate: '', priority: 'medium', progress: 0});
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
      priority: schedule.priority,
      progress: schedule.progress,
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

  const totalSchedules = schedules.length:
  const completedSchedules = schedules.filter( s => s.progress === 100).length;
  const averageProgress = totalSchedules > 0
    ? Math.round(schedules.reduce((acc, s) => acc + s.progress, 0) / totalSchedules)
    : 0;
  const highPriorityCount = schedules.filters(s => s.priority === 'high').length;
  const mediumPriorityCount = schedules.filter(s => s.priority === 'medium').length;
  const lowPriorityCount = schedules.filter(s => s.priority === 'low').length;

  return (
    <div className="size-full bg-gradient-to-br from-[#667eea] to-[#764ba2] overflow-auto">
      <div className="flex h-full">
        <div className="flex-1 p-8 overflow-auto">
          <div className="max-w-fx1 mx-auto">
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
                    setFormData({ title: '', description:'', startDate:'', endDate:'', priority:'medium', progress: 0});
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

                <div>
                  <label className="block mb-2 text-gray-700 font-medium">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'low' | 'medium' | 'high' })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#667eea] text-black"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                {editingSchedule && (
                  <div>
                    <label className="block mb-2 text-gray-700 font-medium">
                      Progress: {formData.progress}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={formData.progress}
                      onChange={(e) => setFormData({ ...formData, progress: parseInt(e.target.value) })}
                      className="w-full"
                    />
                  </div>
                )}

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
                      setFormData({ title: '', description: '', startDate: '', endDate: '', priority: 'medium', progress: 0 });
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
              const priorityColors = {
                low: 'bg-green-100 text-green-800',
                medium: 'bg-yellow-100 text-yellow-800',
                high: 'bg-red-100 text-red-800',
              };

              const progressColors = {
                low: 'bg-green-500',
                medium: 'bg-yellow-500',
                high: 'bg-red-500',
              };
              
               return (
                <div
                  key={schedule.id}
                  className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{schedule.title}</h3>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${priorityColors[schedule.priority]}`}>
                        {schedule.priority.toUpperCase()}
                      </span>
                    </div>
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

                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-semibold text-gray-700">Progress</span>
                      <span className="text-sm font-semibold text-gray-700">{schedule.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className={`h-2.5 rounded-full ${progressColors[schedule.progress < 33 ? 'low' : schedule.progress < 66 ? 'medium' : 'high']}`}
                        style={{ width: `${schedule.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="space-y-1 text-sm text-gray-500">
                    <div>
                      <span className="font-semibold">Start:</span> {formatDate(schedule.startDate)}
                    </div>
                    <div>
                      <span className="font-semibold">End:</span> {formatDate(schedule.endDate)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
          </div>
        </div>

        <div className="w-80 bg-white/10 backdrop-blur-sm p-6 overflow-auto">
          <h2 className="text-2xl font-bold text-white mb-6">Progress Report</h2>

          <div className="space-y-6">
            <div className="bg-white/20 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-2">Overall Progress</h3>
              <div className="flex items-center justify-center">
                <div className="relative w-32 h-32">
                  <svg className="w-32 h-32 transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="rgba(255,255,255,0.2)"
                      strokeWidth="12"
                      fill="none"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="white"
                      strokeWidth="12"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 56}`}
                      strokeDashoffset={`${2 * Math.PI * 56 * (1 - averageProgress / 100)}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-bold text-white">{averageProgress}%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/20 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-3">Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-white/80">Total Schedules</span>
                  <span className="text-white font-bold text-xl">{totalSchedules}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/80">Completed</span>
                  <span className="text-white font-bold text-xl">{completedSchedules}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/80">In Progress</span>
                  <span className="text-white font-bold text-xl">{totalSchedules - completedSchedules}</span>
                </div>
              </div>
            </div>

            {/* Priority Breakdown */}
            <div className="bg-white/20 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-3">Priority Breakdown</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-white/80">High Priority</span>
                    <span className="text-white font-bold">{highPriorityCount}</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div
                      className="bg-red-400 h-2 rounded-full"
                      style={{ width: totalSchedules > 0 ? `${(highPriorityCount / totalSchedules) * 100}%` : '0%' }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-white/80">Medium Priority</span>
                    <span className="text-white font-bold">{mediumPriorityCount}</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full"
                      style={{ width: totalSchedules > 0 ? `${(mediumPriorityCount / totalSchedules) * 100}%` : '0%' }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-white/80">Low Priority</span>
                    <span className="text-white font-bold">{lowPriorityCount}</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div
                      className="bg-green-400 h-2 rounded-full"
                      style={{ width: totalSchedules > 0 ? `${(lowPriorityCount / totalSchedules) * 100}%` : '0%' }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
