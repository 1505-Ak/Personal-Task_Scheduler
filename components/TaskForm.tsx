'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Task, TaskFormData } from '@/types/task';
import { X, Save, Plus, Sparkles, Calendar, Flag, Tag } from 'lucide-react';

interface TaskFormProps {
  task?: Task;
  onSubmit: (data: TaskFormData) => void;
  onCancel: () => void;
  isOpen: boolean;
}

export default function TaskForm({ task, onSubmit, onCancel, isOpen }: TaskFormProps) {
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    category: 'general',
  });

  const [errors, setErrors] = useState<Partial<TaskFormData>>({});

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        priority: task.priority,
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
        category: task.category,
      });
    } else {
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        dueDate: '',
        category: 'general',
      });
    }
  }, [task]);

  const validateForm = (): boolean => {
    const newErrors: Partial<TaskFormData> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted with data:', formData);
    console.log('Is editing task?', !!task);
    
    if (validateForm()) {
      console.log('Form validation passed, calling onSubmit');
      onSubmit(formData);
    } else {
      console.log('Form validation failed');
    }
  };

  const handleChange = (field: keyof TaskFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50"
          onClick={onCancel}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="glass-card w-full max-w-lg p-8 rounded-3xl shadow-2xl border border-slate-600/30 relative overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Animated background */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-cyan-500/10"
              animate={{
                backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear"
              }}
            />

            {/* Header */}
            <motion.div 
              className="flex items-center justify-between mb-8 relative"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center space-x-3">
                <motion.div
                  className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center"
                  whileHover={{ scale: 1.1, rotate: 180 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {task ? <Save className="w-6 h-6 text-white" /> : <Plus className="w-6 h-6 text-white" />}
                </motion.div>
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {task ? 'Edit Task' : 'Create New Task'}
                  </h2>
                  <p className="text-slate-400 text-sm">
                    {task ? 'Update your task details' : 'Add a new task to your list'}
                  </p>
                </div>
              </div>
              <motion.button
                onClick={onCancel}
                className="w-10 h-10 bg-slate-700/50 hover:bg-slate-600/50 text-slate-400 hover:text-white rounded-2xl flex items-center justify-center transition-all duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-5 h-5" />
              </motion.button>
            </motion.div>

            <form onSubmit={handleSubmit} className="space-y-6 relative">
              {/* Title Field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <label className="block text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  className={`w-full px-4 py-4 glass-card text-white placeholder-slate-400 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 text-lg ${
                    errors.title ? 'border-red-500/50 focus:ring-red-500/50' : 'border-slate-600/30'
                  }`}
                  placeholder="What needs to be done?"
                />
                <AnimatePresence>
                  {errors.title && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-red-400 text-sm mt-2"
                    >
                      {errors.title}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Description Field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <label className="block text-sm font-semibold text-slate-300 mb-3">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-4 glass-card text-white placeholder-slate-400 border border-slate-600/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 resize-none text-lg"
                  placeholder="Add more details about your task..."
                />
              </motion.div>

              {/* Priority and Due Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <label className="block text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                    <Flag className="w-4 h-4" />
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => handleChange('priority', e.target.value as 'low' | 'medium' | 'high')}
                    className="w-full px-4 py-4 glass-card text-white border border-slate-600/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 text-lg bg-transparent"
                  >
                    <option value="low" className="bg-slate-800 text-white">🟢 Low Priority</option>
                    <option value="medium" className="bg-slate-800 text-white">🟡 Medium Priority</option>
                    <option value="high" className="bg-slate-800 text-white">🔴 High Priority</option>
                  </select>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <label className="block text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => handleChange('dueDate', e.target.value)}
                    className="w-full px-4 py-4 glass-card text-white border border-slate-600/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 text-lg bg-transparent"
                  />
                </motion.div>
              </div>

              {/* Category Field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <label className="block text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  Category *
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  className={`w-full px-4 py-4 glass-card text-white placeholder-slate-400 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 text-lg ${
                    errors.category ? 'border-red-500/50 focus:ring-red-500/50' : 'border-slate-600/30'
                  }`}
                  placeholder="e.g., Work, Personal, Shopping..."
                />
                <AnimatePresence>
                  {errors.category && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-red-400 text-sm mt-2"
                    >
                      {errors.category}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                className="flex space-x-4 pt-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <motion.button
                  type="button"
                  onClick={onCancel}
                  className="flex-1 px-6 py-4 glass-card border border-slate-600/30 text-slate-300 hover:text-white rounded-2xl font-semibold transition-all duration-300 text-lg"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
                                 <motion.button
                   type="submit"
                   className="flex-1 btn-3d px-6 py-4 text-white rounded-2xl font-bold transition-all duration-300 flex items-center justify-center space-x-2 text-lg shadow-2xl relative z-10"
                   whileHover={{ scale: 1.02, y: -2 }}
                   whileTap={{ scale: 0.98 }}
                 >
                   {task ? <Save className="w-5 h-5 relative z-10" /> : <Plus className="w-5 h-5 relative z-10" />}
                   <span className="relative z-10">{task ? 'Update Task' : 'Create Task'}</span>
                 </motion.button>
              </motion.div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 