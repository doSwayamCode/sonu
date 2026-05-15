const express = require('express');
const Project = require('../models/Project');
const Task = require('../models/Task');
const { authenticate, requireAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authenticate, async (req, res) => {
  try {
    let projects;
    if (req.user.role === 'Admin') {
      projects = await Project.find().populate('members', 'name email');
    } else {
      projects = await Project.find({ members: req.user._id }).populate('members', 'name email');
    }
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', [authenticate, requireAdmin], async (req, res) => {
  try {
    const { title, description, members } = req.body;
    const project = new Project({ title, description, members });
    await project.save();
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', authenticate, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('members', 'name email');
    if (!project) return res.status(404).json({ message: 'Project not found' });

    // Validate if user has access
    if (req.user.role !== 'Admin' && !project.members.some(m => m._id.toString() === req.user._id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const tasks = await Task.find({ projectId: project._id }).populate('assignedTo', 'name');
    res.json({ project, tasks });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', [authenticate, requireAdmin], async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    await Task.deleteMany({ projectId: req.params.id });
    res.json({ message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.patch('/:id', [authenticate, requireAdmin], async (req, res) => {
  try {
    const { title, description, members } = req.body;
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { title, description, members },
      { new: true }
    );
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
