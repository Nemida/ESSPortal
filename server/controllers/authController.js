
const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


exports.registerUser = async (req, res) => {
  const { firstName, lastName, email, password, jobTitle, department } = req.body;

  try {

    let user = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (user.rows.length > 0) {
      return res.status(400).json({ msg: 'User already exists' });
    }


    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);


    const newUser = await db.query(
      'INSERT INTO users (first_name, last_name, email, password_hash, job_title, department) VALUES ($1, $2, $3, $4, $5, $6) RETURNING user_id, email, role',
      [firstName, lastName, email, passwordHash, jobTitle, department]
    );


    const payload = {
      user: {
        id: newUser.rows[0].user_id,
        role: newUser.rows[0].role,
      },
    };


    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '5h' }, 
      (err, token) => {
        if (err) throw err;
        res.status(201).json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};


exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ msg: 'Email and password are required' });
  }
  
  try {
    const userResult = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userResult.rows.length === 0) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }
    const user = userResult.rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }
    
  
    delete user.password_hash;

    const payload = { user: { id: user.user_id, role: user.role } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' });
    

    res.json({ token, user });

  } catch (err) {
    res.status(500).send('Server error');
  }
};


exports.getLoggedInUser = async (req, res) => {
    try {
       
        const user = await db.query(
            'SELECT user_id, first_name, last_name, email, role, job_title, department FROM users WHERE user_id = $1',
            [req.user.id]
        );

        if(user.rows.length === 0) {
            return res.status(404).json({msg: 'User not found'});
        }

        res.json(user.rows[0]);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};