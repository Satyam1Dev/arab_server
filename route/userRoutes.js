// userRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../modal/User');
const mongoose = require('mongoose');

// Signup route
router.post('/signup', async (req, res) => {
  try {
    const { fullName, userName, email, password } = req.body;
    const newUser = new User({ fullName, userName, email, password });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    console.error('Error signing up:', error);
    res.status(500).json({ error: 'Error signing up' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Error logging in' });
  }
});

// Update profile route (PUT)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, password, avatar } = req.body;

    // Construct the update object based on the provided data
    const updateObject = {};
    if (fullName) updateObject.fullName = fullName;
    if (password) updateObject.password = password;
    if (avatar) updateObject.avatar = avatar; // Assuming 'avatar' is the field name for the avatar image

    // Update the user document in the database
    const updatedUser = await User.findByIdAndUpdate(id, updateObject, { new: true });

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Error updating profile' });
  }
});

// Get user route
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if id is valid ObjectId format
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    console.log('Fetching user data for ID:', id); // Add this logging statement
    // Fetch user data from the database using the provided ID
    const user = await User.findById(id);
    console.log('User data:', user); // Add this logging statement
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ error: 'Error fetching user data' });
  }
});

module.exports = router;
