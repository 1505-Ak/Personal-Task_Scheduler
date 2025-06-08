'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Task, TaskFormData } from '@/types/task';
import { api } from '@/lib/api';
import TaskCard from '@/components/TaskCard';
import TaskForm from '@/components/TaskForm';
import { Plus, Filter, Search, Calendar, CheckCircle, Clock, AlertCircle } from 'lucide-react';

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Load tasks on component mount
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const fetchedTasks = await api.getTasks();
      setTasks(fetchedTasks);
      setError(null);
    } catch (err) {
      setError('Failed to load tasks. Please make sure the server is running.');
      console.error('Error loading tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskData: TaskFormData) => {
    try {
      const newTask = await api.createTask(taskData);
      setTasks(prev => [newTask, ...prev]);
      setIsFormOpen(false);
      setError(null);
    } catch (err) {
      setError('Failed to create task');
      console.error('Error creating task:', err);
    }
  };

  const handleUpdateTask = async (taskData: TaskFormData) => {
    if (!editingTask) return;
    
    try {
      const updatedTask = await api.updateTask(editingTask.id, taskData);
      setTasks(prev => prev.map(task => 
        task.id === editingTask.id ? updatedTask : task
      ));
      setEditingTask(undefined);
      setIsFormOpen(false);
      setError(null);
    } catch (err) {
      setError('Failed to update task');
      console.error('Error updating task:', err);
    }
  };

  const handleToggleTask = async (id: string) => {
    try {
      const task = tasks.find(t => t.id === id);
      if (!task) return;

      const updatedTask = await api.updateTask(id, { 
        completed: !task.completed 
      });
      setTasks(prev => prev.map(t => 
        t.id === id ? updatedTask : t
      ));
      setError(null);
    } catch (err) {
      setError('Failed to update task');
      console.error('Error toggling task:', err);
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await api.deleteTask(id);
      setTasks(prev => prev.filter(task => task.id !== id));
      setError(null);
    } catch (err) {
      setError('Failed to delete task');
      console.error('Error deleting task:', err);
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (taskData: TaskFormData) => {
    if (editingTask) {
      handleUpdateTask(taskData);
    } else {
      handleCreateTask(taskData);
    }
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
    setEditingTask(undefined);
  };

  // Filter tasks based on search and filters
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'completed' && task.completed) ||
                         (filterStatus === 'pending' && !task.completed);
    
    return matchesSearch && matchesPriority && matchesStatus;
  });

  // Calculate stats
  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    pending: tasks.filter(t => !t.completed).length,
    overdue: tasks.filter(t => !t.completed && t.dueDate && new Date(t.dueDate) < new Date()).length
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="spinner-3d"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <motion.h1 
            className="text-6xl font-black gradient-text mb-4 float"
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1, ease: "backOut" }}
          >
            ✨ Personal Task Scheduler
          </motion.h1>
          <motion.p 
            className="text-slate-300 text-xl font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Stay organized, boost productivity, achieve your goals
          </motion.p>
          <motion.div
            className="mt-4 w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full pulse-glow"
            initial={{ width: 0 }}
            animate={{ width: 80 }}
            transition={{ delay: 1, duration: 0.8 }}
          />
        </motion.div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="mb-8 p-6 glass-card border border-red-400/30 text-red-300 rounded-xl backdrop-blur-xl shadow-xl"
            >
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">!</span>
                </div>
                {error}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
        >
          {[
            { label: 'Total', value: stats.total, icon: Calendar, color: 'from-blue-500 to-cyan-500', bgColor: 'bg-blue-500/10' },
            { label: 'Completed', value: stats.completed, icon: CheckCircle, color: 'from-green-500 to-emerald-500', bgColor: 'bg-green-500/10' },
            { label: 'Pending', value: stats.pending, icon: Clock, color: 'from-amber-500 to-orange-500', bgColor: 'bg-amber-500/10' },
            { label: 'Overdue', value: stats.overdue, icon: AlertCircle, color: 'from-red-500 to-pink-500', bgColor: 'bg-red-500/10' }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.1, duration: 0.6 }}
              className="glass-card glass-card-hover card-3d rounded-2xl p-6 group cursor-default"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400 font-medium mb-1">{stat.label}</p>
                  <motion.p 
                    className="text-3xl font-black text-white"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1, type: "spring", stiffness: 200 }}
                  >
                    {stat.value}
                  </motion.p>
                </div>
                <motion.div
                  className={`w-14 h-14 ${stat.bgColor} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <stat.icon className={`w-8 h-8 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`} />
                </motion.div>
              </div>
              <div className={`mt-4 h-1 w-full bg-gradient-to-r ${stat.color} rounded-full opacity-60 group-hover:opacity-100 transition-opacity`} />
            </motion.div>
          ))}
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="flex flex-col lg:flex-row gap-6 mb-12"
        >
          {/* Search */}
          <motion.div 
            className="flex-1 relative"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-slate-400" />
            <input
              type="text"
              placeholder="Search through your tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-4 glass-card text-white placeholder-slate-400 border border-slate-600/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all text-lg"
            />
          </motion.div>

          {/* Filters */}
          <motion.div 
            className="flex gap-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
          >
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-6 py-4 glass-card text-white border border-slate-600/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 bg-transparent text-lg min-w-[160px]"
            >
              <option value="all" className="bg-slate-800">All Priorities</option>
              <option value="high" className="bg-slate-800">🔴 High Priority</option>
              <option value="medium" className="bg-slate-800">🟡 Medium Priority</option>
              <option value="low" className="bg-slate-800">🟢 Low Priority</option>
            </select>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-6 py-4 glass-card text-white border border-slate-600/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 bg-transparent text-lg min-w-[140px]"
            >
              <option value="all" className="bg-slate-800">All Tasks</option>
              <option value="pending" className="bg-slate-800">⏳ Pending</option>
              <option value="completed" className="bg-slate-800">✅ Completed</option>
            </select>
          </motion.div>

          {/* Add Task Button */}
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsFormOpen(true)}
            className="btn-3d flex items-center gap-3 px-8 py-4 text-white rounded-2xl font-bold text-lg shadow-2xl relative overflow-hidden group min-w-[180px] justify-center z-10"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9, type: "spring", stiffness: 200 }}
          >
            <Plus className="w-6 h-6 relative z-10" />
            <span className="relative z-10">Add Task</span>
          </motion.button>
        </motion.div>

        {/* Tasks Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.8 }}
          className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
        >
          <AnimatePresence mode="popLayout">
            {filteredTasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -30, scale: 0.9 }}
                transition={{ 
                  delay: 1.1 + index * 0.1, 
                  duration: 0.6,
                  type: "spring",
                  stiffness: 100
                }}
                layout
              >
                <TaskCard
                  task={task}
                  onToggle={handleToggleTask}
                  onDelete={handleDeleteTask}
                  onEdit={handleEditTask}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredTasks.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="text-center py-20"
          >
            <motion.div
              className="glass-card rounded-3xl p-12 max-w-md mx-auto border border-slate-600/30"
              whileHover={{ scale: 1.02, y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.div 
                className="text-slate-400 mb-8"
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                {tasks.length === 0 ? (
                  <Calendar className="w-20 h-20 mx-auto mb-4" />
                ) : (
                  <Filter className="w-20 h-20 mx-auto mb-4" />
                )}
              </motion.div>
              
              <motion.h3 
                className="text-2xl font-bold text-white mb-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4 }}
              >
                {tasks.length === 0 ? '🚀 Ready to Get Started?' : '🔍 No Tasks Found'}
              </motion.h3>
              
              <motion.p 
                className="text-slate-300 mb-8 leading-relaxed"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 }}
              >
                {tasks.length === 0 
                  ? 'Create your first task and start organizing your life with our beautiful task scheduler!'
                  : 'Try adjusting your search or filter criteria to find what you\'re looking for.'
                }
              </motion.p>
              
              {tasks.length === 0 && (
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsFormOpen(true)}
                  className="btn-3d px-8 py-4 text-white rounded-2xl font-bold text-lg shadow-2xl relative z-10"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.6, type: "spring", stiffness: 200 }}
                >
                  <span className="relative z-10">✨ Create Your First Task</span>
                </motion.button>
              )}
            </motion.div>
          </motion.div>
        )}

        {/* Task Form Modal */}
        <TaskForm
          task={editingTask}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          isOpen={isFormOpen}
        />
      </div>
    </div>
  );
} 