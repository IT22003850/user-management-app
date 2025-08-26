const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, gender, hobbies, skill_level, bio } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const hobbiesStr = hobbies.join(',');

    User.create(
      { name, email, password: hashedPassword, gender, hobbies: hobbiesStr, skill_level, bio },
      (err) => {
        if (err) return res.status(500).json({ error: 'Registration failed' });
        res.status(201).json({ message: 'User registered' });
      }
    );
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.loginUser = (req, res) => {
  const { email, password } = req.body;

  User.findByEmail(email, async (err, results) => {
    if (err || results.length === 0) return res.status(401).json({ error: 'Invalid credentials' });

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  });
};

exports.getUsers = (req, res) => {
  User.findAll((err, results) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch users' });
    const users = results.map(user => ({
      ...user,
      hobbies: user.hobbies ? user.hobbies.split(',') : [],
    }));
    res.json(users);
  });
};

exports.updateUser = (req, res) => {
  const { id } = req.params;
  const { name, email, gender, hobbies, skill_level, bio } = req.body;

  const hobbiesStr = hobbies && Array.isArray(hobbies) ? hobbies.join(',') : null;

  User.update(
    id,
    { name, email, gender, hobbies: hobbiesStr, skill_level, bio },
    (err, result) => {
      if (err) return res.status(500).json({ error: 'Failed to update user' });
      if (result.affectedRows === 0) return res.status(404).json({ error: 'User not found' });
      res.json({ message: 'User updated successfully' });
    }
  );
};


exports.deleteUser = (req, res) => {
  const { id } = req.params;

  User.delete(id, (err, result) => {
    if (err) return res.status(500).json({ error: 'Failed to delete user' });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  });
};

