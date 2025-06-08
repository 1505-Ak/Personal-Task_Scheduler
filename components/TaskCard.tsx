'use client';

import { Task } from '@/types/task';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Calendar, Clock, Flag, Trash2, Edit, Check, X } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

const priorityColors = {
  low: 'bg-green-100 text-green-800 border-green-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  high: 'bg-red-100 text-red-800 border-red-200',
};

const priorityIcons = {
  low: '🟢',
  medium: '🟡',
  high: '🔴',
};

export default function TaskCard({ task, onToggle, onDelete, onEdit }: TaskCardProps) {
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -2 }}
      className={`glass p-6 rounded-xl shadow-soft transition-all duration-200 border-l-4 ${
        task.completed 
          ? 'border-l-green-400 opacity-75' 
          : isOverdue 
          ? 'border-l-red-400' 
          : 'border-l-primary-400'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <button
            onClick={() => onToggle(task.id)}
            className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
              task.completed
                ? 'bg-green-500 border-green-500 text-white'
                : 'border-gray-300 hover:border-primary-400'
            }`}
          >
            {task.completed && <Check size={12} />}
          </button>
          
          <div className="flex-1">
            <h3 className={`font-semibold text-lg mb-2 ${
              task.completed ? 'line-through text-gray-500' : 'text-gray-800'
            }`}>
              {task.title}
            </h3>
            
            {task.description && (
              <p className={`text-sm mb-3 ${
                task.completed ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {task.description}
              </p>
            )}
            
            <div className="flex items-center space-x-4 text-xs">
              <div className={`px-2 py-1 rounded-full border flex items-center space-x-1 ${priorityColors[task.priority]}`}>
                <span>{priorityIcons[task.priority]}</span>
                <Flag size={10} />
                <span className="font-medium capitalize">{task.priority}</span>
              </div>
              
              <div className="flex items-center space-x-1 text-gray-500">
                <Calendar size={12} />
                <span className="font-mono">{task.category}</span>
              </div>
              
              {task.dueDate && (
                <div className={`flex items-center space-x-1 ${
                  isOverdue ? 'text-red-600 font-medium' : 'text-gray-500'
                }`}>
                  <Clock size={12} />
                  <span className="font-mono">
                    {format(new Date(task.dueDate), 'MMM dd, yyyy')}
                  </span>
                  {isOverdue && <span className="text-red-500 animate-pulse">⚠️</span>}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onEdit(task)}
            className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-200"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
} 