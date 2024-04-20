// app.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const port = 3001;
const productRoutes = require('./route/productRoutes'); // Import product routes
const categoryRoutes = require('./route/categoryRoutes'); // Import category routes

app.use(cors());
app.use(express.json());


// Replace 'your-mongodb-uri' with your MongoDB connection string
mongoose.connect('mongodb+srv://SATYA_PRAKASH:SATYA_PRAKASH@cluster0.pceyq7j.mongodb.net/arab', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// User model and schema
const userSchema = new mongoose.Schema({
  fullName: String,
  userName: String,
  email: String,
  password: String
});

const User = mongoose.model('User', userSchema);

// Welcome route
app.get('/', (req, res) => {
  res.send('Welcome to the API!');
});


// Signup route
app.post('/api/users/signup', async (req, res) => {
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
app.post('/api/users/login', async (req, res) => {
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
// Update profile route (PUT)
app.put('/api/users/:id', async (req, res) => {
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


// Assuming User model and schema are defined elsewhere in your code

app.get('/api/users/:id', async (req, res) => {
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
// Use product routes
app.use('/api/products', productRoutes);
// Use category routes
app.use('/api/categories', categoryRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
