// server.js
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

// User Schema
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true }
});

// Submission Schema
const submissionSchema = new mongoose.Schema({
    name: { type: String, required: true },
    country: { type: String, required: true },
    company: { type: String, required: true },
    questions: [{ type: String, required: true }],
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
const Submission = mongoose.model('Submission', submissionSchema);

// Authentication Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Routes
const bcrypt = require('bcrypt');

app.post('/api/register', async (req, res) => {
    try {
        const { email, password, name } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ email, password: hashedPassword, name });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
  

app.post('/api/login', async (req, res) => {
  try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
          return res.status(401).json({ error: 'Invalid credentials' });
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
          return res.status(401).json({ error: 'Invalid credentials' });
      }
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ token });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

// CRUD Operations for Submissions
app.post('/api/submissions', authenticateToken, async (req, res) => {
    try {
        const submission = new Submission({
            ...req.body,
            userId: req.user.userId
        });
        await submission.save();
        res.status(201).json(submission);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/submissions', async (req, res) => {
  try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const total = await Submission.countDocuments();
      const submissions = await Submission.find()
          .skip((page - 1) * limit)
          .limit(limit)
          .populate('userId', 'name');

      res.json({ total, submissions });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});


app.get('/api/submissions/my', authenticateToken, async (req, res) => {
    try {
        const submissions = await Submission.find({ userId: req.user.userId });
        res.json(submissions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));