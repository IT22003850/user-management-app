const db = require("../config/dbConfig");

// Create users table if not exists
db.query(`
  CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    gender ENUM('Male', 'Female', 'Other'),
    hobbies VARCHAR(255),
    skill_level ENUM('Beginner', 'Intermediate', 'Advanced'),
    bio TEXT
  )
`);

const User = {
  create: (userData, callback) => {
    const { name, email, password, gender, hobbies, skill_level, bio } =
      userData;
    db.query(
      "INSERT INTO users (name, email, password, gender, hobbies, skill_level, bio) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [name, email, password, gender, hobbies, skill_level, bio],
      callback
    );
  },

  findByEmail: (email, callback) => {
    db.query("SELECT * FROM users WHERE email = ?", [email], callback);
  },

  findAll: (callback) => {
    db.query(
      "SELECT id, name, email, gender, hobbies, skill_level, bio FROM users",
      callback
    );
  },
};

update: (id, userData, callback) => {
  const { name, email, gender, hobbies, skill_level, bio } = userData;
  db.query(
    "UPDATE users SET name=?, email=?, gender=?, hobbies=?, skill_level=?, bio=? WHERE id=?",
    [name, email, gender, hobbies, skill_level, bio, id],
    callback
  );
},
  (module.exports = User);
