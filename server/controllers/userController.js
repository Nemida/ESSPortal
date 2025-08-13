const db = require('../db');
const bcrypt = require('bcryptjs');


exports.getAllUsers = async (req, res) => {
  try {
    const users = await db.query('SELECT user_id, email, first_name, last_name, role, job_title, department FROM users ORDER BY last_name ASC');
    res.json(users.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};


exports.addUser = async (req, res) => {
  const { first_name, last_name, email, password, role, job_title, department } = req.body;
  try {
    let user = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (user.rows.length > 0) {
      return res.status(400).json({ msg: 'User with this email already exists' });
    }
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);
    const newUser = await db.query(
      'INSERT INTO users (first_name, last_name, email, password_hash, role, job_title, department) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING user_id, email, first_name, last_name, role',
      [first_name, last_name, email, password_hash, role, job_title, department]
    );
    res.status(201).json(newUser.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error: Could not add user.');
  }
};


exports.updateUser = async (req, res) => {
  const { userIdToUpdate } = req.params;
  const { first_name, last_name, job_title, department } = req.body;
  const loggedInUserId = req.user.id;
  const loggedInUserRole = req.user.role;

  if (loggedInUserRole !== 'admin' && loggedInUserId.toString() !== userIdToUpdate) {
    return res.status(403).json({ msg: 'Authorization denied' });
  }

  try {
    const updatedUser = await db.query(
      'UPDATE users SET first_name = $1, last_name = $2, job_title = $3, department = $4 WHERE user_id = $5 RETURNING user_id, email, first_name, last_name, role, job_title, department',
      [first_name, last_name, job_title, department, userIdToUpdate]
    );
    
    if (updatedUser.rows.length > 0) {
  return res.status(200).json(updatedUser.rows[0]);
} else {
  return res.status(200).json({ msg: "User updated but no fields returned" });
}
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};


exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    if (req.user.id.toString() === id) {
      return res.status(400).json({ msg: 'Admin cannot delete their own account.' });
    }
    await db.query('DELETE FROM users WHERE user_id = $1', [id]);
    res.json({ msg: 'User removed successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};