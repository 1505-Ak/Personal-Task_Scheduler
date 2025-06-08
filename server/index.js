const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;
const TASKS_FILE = path.join(__dirname, 'tasks.json');

// Middleware
app.use(cors());
app.use(express.json());

// Initialize tasks file if it doesn't exist
if (!fs.existsSync(TASKS_FILE)) {
  fs.writeFileSync(TASKS_FILE, JSON.stringify([]));
}

// Helper function to read tasks
const readTasks = () => {
  try {
    const data = fs.readFileSync(TASKS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

// Helper function to write tasks
const writeTasks = (tasks) => {
  fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2));
};

// Get all tasks
app.get('/api/tasks', (req, res) => {
  const tasks = readTasks();
  res.json(tasks);
});

// Create a new task
app.post('/api/tasks', (req, res) => {
  const { title, description, priority, dueDate, category } = req.body;
  const tasks = readTasks();
  
  const newTask = {
    id: Date.now().toString(),
    title,
    description: description || '',
    priority: priority || 'medium',
    dueDate: dueDate || null,
    category: category || 'general',
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  tasks.push(newTask);
  writeTasks(tasks);
  res.status(201).json(newTask);
});

// Update a task
app.put('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  const tasks = readTasks();
  const taskIndex = tasks.findIndex(task => task.id === id);
  
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }
  
  tasks[taskIndex] = {
    ...tasks[taskIndex],
    ...req.body,
    updatedAt: new Date().toISOString()
  };
  
  writeTasks(tasks);
  res.json(tasks[taskIndex]);
});

// Delete a task
app.delete('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  const tasks = readTasks();
  const filteredTasks = tasks.filter(task => task.id !== id);
  
  if (tasks.length === filteredTasks.length) {
    return res.status(404).json({ error: 'Task not found' });
  }
  
  writeTasks(filteredTasks);
  res.status(204).send();
});

// Toggle task completion
app.patch('/api/tasks/:id/toggle', (req, res) => {
  const { id } = req.params;
  const tasks = readTasks();
  const taskIndex = tasks.findIndex(task => task.id === id);
  
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }
  
  tasks[taskIndex].completed = !tasks[taskIndex].completed;
  tasks[taskIndex].updatedAt = new Date().toISOString();
  
  writeTasks(tasks);
  res.json(tasks[taskIndex]);
});

app.listen(PORT, () => {
  console.log(`🚀 Task Scheduler API running on http://localhost:${PORT}`);
}); 