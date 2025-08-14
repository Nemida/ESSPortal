const db = require('../db');

exports.getAvailableForms = async (req, res) => {
  try {
    const forms = await db.query('SELECT * FROM forms ORDER BY title ASC');
    res.json(forms.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getFormById = async (req, res) => {
  try {
    const form = await db.query('SELECT * FROM forms WHERE form_id = $1', [req.params.id]);
    if (form.rows.length === 0) {
      return res.status(404).json({ msg: 'Form not found' });
    }
    res.json(form.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.submitForm = async (req, res) => {
  const { formId, submissionData } = req.body;
  const userId = req.user.id;
  try {
    await db.query(
      'INSERT INTO form_submissions (form_id, user_id, submission_data) VALUES ($1, $2, $3)',
      [formId, userId, submissionData]
    );
    res.status(201).json({ msg: 'Form submitted successfully!' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getAllSubmissions = async (req, res) => {
  try {
    const submissions = await db.query(`
      SELECT s.submission_id, s.submitted_at, s.status, f.title AS form_title,
             u.first_name, u.last_name, s.submission_data
      FROM form_submissions s
      JOIN users u ON s.user_id = u.user_id
      JOIN forms f ON s.form_id = f.form_id
      ORDER BY s.submitted_at DESC
    `);
    res.json(submissions.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getFormById = async (req, res) => {
  try {
    const form = await db.query('SELECT * FROM forms WHERE form_id = $1', [req.params.id]);
    if (form.rows.length === 0) {
      return res.status(404).json({ msg: 'Form not found' });
    }
    res.json(form.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};