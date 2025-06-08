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

const priorityConfig = {
  low: {
    color: 'from-emerald-500 to-green-600',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    icon: '🟢',
    glow: 'shadow-emerald-500/25'
  },
  medium: {
    color: 'from-amber-500 to-orange-500',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    icon: '🟡',
    glow: 'shadow-amber-500/25'
  },
  high: {
    color: 'from-red-500 to-pink-600',
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    icon: '🔴',
    glow: 'shadow-red-500/25'
  },
};

export default function TaskCard({ task, onToggle, onDelete, onEdit }: TaskCardProps) {
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;
  const config = priorityConfig[task.priority];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ 
        opacity: task.completed ? 0.8 : 1, 
        y: 0, 
        scale: 1,
        filter: task.completed ? 'grayscale(0.3)' : 'grayscale(0)'
      }}
      exit={{ opacity: 0, y: -20, scale: 0.9 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className={`glass-card glass-card-hover card-3d rounded-2xl p-6 border relative overflow-visible group cursor-default shadow-2xl ${
        task.completed 
          ? 'border-green-500/30 bg-green-500/5' 
          : `${config.border} ${config.glow}`
      }`}
    >
      {/* Animated background gradient */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-br ${config.color} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      {/* Priority indicator */}
      {!task.completed && (
        <motion.div
          className={`absolute top-4 right-4 w-8 h-8 ${config.bg} rounded-full flex items-center justify-center border ${config.border}`}
          whileHover={{ scale: 1.2, rotate: 180 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <span className="text-lg">{config.icon}</span>
        </motion.div>
      )}

      {/* Completion toggle - Click to mark complete */}
      <motion.button
        onClick={(e) => {
          e.stopPropagation();
          console.log('Toggling task completion:', task.id, 'currently completed:', task.completed);
          onToggle(task.id);
        }}
        className={`w-10 h-10 rounded-full border-2 flex items-center justify-center mb-4 transition-all duration-300 group/toggle ${
          task.completed
            ? 'bg-gradient-to-r from-green-500 to-emerald-600 border-green-500 shadow-lg shadow-green-500/25'
            : 'border-slate-400 hover:border-green-400 hover:bg-green-500/10 hover:shadow-lg hover:shadow-green-400/25'
        }`}
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.9 }}
        title={task.completed ? "Mark as incomplete" : "Mark as complete"}
      >
        {task.completed ? (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Check className="w-6 h-6 text-white" />
          </motion.div>
        ) : (
          <motion.div
            className="w-4 h-4 border-2 border-slate-400 rounded-full group-hover/toggle:border-green-400 transition-colors"
            whileHover={{ scale: 1.2 }}
          />
        )}
      </motion.button>

      {/* Clear instruction for new users */}
      {!task.completed && (
        <motion.p
          className="text-xs text-slate-500 mb-2 opacity-0 group-hover:opacity-100 transition-opacity"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
        >
          Click circle to mark complete
        </motion.p>
      )}

      {/* Task content */}
      <div className="space-y-3">
        <motion.h3
          className={`font-bold text-xl leading-tight transition-all duration-300 ${
            task.completed 
              ? 'text-slate-400 line-through opacity-60' 
              : 'text-white'
          }`}
          layout
        >
          {task.title}
        </motion.h3>

        {task.description && (
          <motion.p
            className={`text-sm leading-relaxed transition-all duration-300 ${
              task.completed 
                ? 'text-slate-500 line-through opacity-50' 
                : 'text-slate-300'
            }`}
            layout
          >
            {task.description}
          </motion.p>
        )}

        {/* Completion status badge */}
        {task.completed && (
          <motion.div
            className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/20 text-green-400 rounded-full border border-green-500/30 text-sm font-medium"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
          >
            <Check className="w-4 h-4" />
            <span>Task Completed</span>
          </motion.div>
        )}

        {/* Task metadata */}
        <div className="flex flex-wrap gap-3 text-xs">
          {task.category && (
            <motion.span
              className="px-3 py-1 bg-slate-700/50 text-slate-300 rounded-full border border-slate-600/30"
              whileHover={{ scale: 1.05 }}
            >
              {task.category}
            </motion.span>
          )}

          {task.dueDate && (
            <motion.div
              className={`flex items-center gap-2 px-3 py-1 rounded-full ${
                isOverdue
                  ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                  : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
              }`}
              whileHover={{ scale: 1.05 }}
            >
              <Calendar className="w-3 h-3" />
              <span>{format(new Date(task.dueDate), 'MMM dd')}</span>
              {isOverdue && <Clock className="w-3 h-3 text-red-400" />}
            </motion.div>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <motion.div
        className={`flex gap-2 mt-6 transition-opacity duration-300 relative z-20 ${
          task.completed ? 'opacity-60 group-hover:opacity-100' : 'opacity-0 group-hover:opacity-100'
        }`}
        initial={{ y: 10 }}
        animate={{ y: 0 }}
      >
        {!task.completed && (
          <motion.button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('Mark complete button clicked for task:', task.id);
              onToggle(task.id);
            }}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded-xl border border-green-500/30 transition-all duration-300 cursor-pointer z-30"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <Check className="w-4 h-4 pointer-events-none" />
            <span className="font-medium pointer-events-none">Complete</span>
          </motion.button>
        )}

        <motion.button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Edit button clicked for task:', task.id, task);
            onEdit(task);
          }}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-xl border border-blue-500/30 transition-all duration-300 cursor-pointer z-30"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          <Edit className="w-4 h-4 pointer-events-none" />
          <span className="font-medium pointer-events-none">Edit</span>
        </motion.button>

        <motion.button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Delete button clicked for task:', task.id);
            onDelete(task.id);
          }}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-xl border border-red-500/30 transition-all duration-300 cursor-pointer z-30"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          <Trash2 className="w-4 h-4 pointer-events-none" />
          <span className="font-medium pointer-events-none">Delete</span>
        </motion.button>
      </motion.div>

      {/* Completion indicator */}
      {task.completed && (
        <motion.div
          className="absolute top-2 right-2 bg-green-500/20 backdrop-blur-sm rounded-full px-3 py-1 border border-green-500/30"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
        >
          <motion.div
            className="text-green-400 font-semibold text-sm flex items-center gap-1"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          >
            <Check className="w-4 h-4" />
            <span>Done</span>
          </motion.div>
        </motion.div>
      )}

      {/* Overdue indicator */}
      {isOverdue && (
        <motion.div
          className="absolute top-2 left-2"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="w-3 h-3 bg-red-500 rounded-full shadow-lg shadow-red-500/50" />
        </motion.div>
      )}
    </motion.div>
  );
} 