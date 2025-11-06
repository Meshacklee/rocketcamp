const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Simple in-memory storage for testing
let todos = [];
let currentId = 1;

// Test route
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Server is working!', 
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// POST route for todos
app.post('/api/todos', async (req, res) => {
  try {
    console.log('📨 POST /api/todos - Body:', req.body);
    
    const { title } = req.body;
    
    if (!title || title.trim() === '') {
      return res.status(400).json({ 
        success: false, 
        error: 'Title is required and cannot be empty' 
      });
    }
    
    // Create todo object
    const todo = {
      id: currentId++,
      title: title.trim(),
      completed: false,
      createdAt: new Date()
    };
    
    // Add to array (temporary storage)
    todos.push(todo);
    
    console.log('✅ Todo created:', todo);
    console.log('All todos:', todos);
    
    res.status(201).json({
      success: true,
      data: todo
    });
    
  } catch (error) {
    console.error('❌ Error creating todo:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create todo'
    });
  }
});

// GET all todos
app.get('/api/todos', (req, res) => {
  res.json({
    success: true,
    data: todos,
    count: todos.length
  });
});

// DELETE a todo
app.delete('/api/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const initialLength = todos.length;
  todos = todos.filter(todo => todo.id !== id);
  
  if (todos.length < initialLength) {
    res.json({ success: true, message: 'Todo deleted' });
  } else {
    res.status(404).json({ success: false, error: 'Todo not found' });
  }
});

const PORT = process.env.PORT || 5000;

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB Connected');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📝 Test the API at http://localhost:${PORT}/api/test`);
    });
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
  });