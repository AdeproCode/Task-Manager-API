const Task = require('../models/Task');
const { Op } = require('sequelize');


// create a task
const handleCreateTask = async (req, res) => {
  try {
    const task = await Task.create({ ...req.body, userId: req.user.id });
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ error: 'Invalid data' });
  }
};

// get all tasks
const handleGetTasks = async (req, res) => {
  const { completed, priority, startDate, endDate, page = 1, limit = 10 } = req.query;
  const where = { userId: req.user.id };

  if (completed) where.completed = completed === 'true';
  if (priority) where.priority = priority;
  if (startDate && endDate) where.due_date = { [Op.between]: [startDate, endDate] };

  const tasks = await Task.findAndCountAll({
    where,
    limit: +limit,
    offset: (page - 1) * limit,
    order: [['updatedAt', 'DESC']]
  });

  res.json({
    total: tasks.count,
    pages: Math.ceil(tasks.count / limit),
    current: +page,
    tasks: tasks.rows
  });
};

// get task
const handleGetTask = async (req, res) => {
  const task = await Task.findOne({ where: { id: req.params.id, userId: req.user.id } });
  if (!task) return res.status(404).json({ error: 'Task not found' });
  res.json(task);
};

// update task
const handleUpdateTask = async (req, res) => {
  const task = await Task.findOne({ where: { id: req.params.id, userId: req.user.id } });
  if (!task) return res.status(404).json({ error: 'Task not found' });

  await task.update(req.body);
  res.json(task);
};


// mark if completed
const handleMarkComplete = async (req, res) => {
  const task = await Task.findOne({ where: { id: req.params.id, userId: req.user.id } });
  if (!task) return res.status(404).json({ error: 'Task not found' });

  await task.update({ completed: true });
  res.json(task);
};


// delete task
const handleDeleteTask = async (req, res) => {
  const task = await Task.findOne({ where: { id: req.params.id, userId: req.user.id } });
  if (!task) return res.status(404).json({ error: 'Task not found' });

  await task.destroy();
  res.json({ message: 'Task deleted' });
};




module.exports = {handleCreateTask, handleGetTasks, handleGetTask, handleUpdateTask, handleMarkComplete, handleDeleteTask };
