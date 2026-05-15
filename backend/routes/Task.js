const express = require('express');
const Task = require('../models/Task');
const { authenticate, requireAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authenticate, async (req, res) => {
  try {
    let tasks;
    if (req.user.role === 'Admin') {
      tasks = await Task.find().populate('assignedTo', 'name').populate('projectId', 'title');
    } else {
      tasks = await Task.find({ assignedTo: req.user._id }).populate('assignedTo', 'name').populate('projectId', 'title');
    }
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', authenticate, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate('assignedTo', 'name email').populate('projectId', 'title');
    if (!task) return res.status(404).json({ message: 'Task not found' });
    
    if (req.user.role !== 'Admin' && (!task.assignedTo || task.assignedTo._id.toString() !== req.user._id)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', [authenticate, requireAdmin], async (req, res) => {
  try {
    const { title, description, assignedTo, projectId, dueDate, priority } = req.body;
    const task = new Task({ title, description, assignedTo, projectId, dueDate, priority });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', [authenticate, requireAdmin], async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.patch('/:id', authenticate, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    // Members can only update status of their own tasks
    if (req.user.role === 'Member') {
      if (task.assignedTo.toString() !== req.user._id) {
        return res.status(403).json({ message: 'Not authorized to update this task' });
      }
      // Only allow status update for members
      task.status = req.body.status || task.status;
    } else {
      // Admins can update everything
      Object.assign(task, req.body);
    }

    await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
