
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

exports.submitForm = async (req, res) => {
  const { formId, submissionData } = req.body;
  const userId = req.user.id; 

  try {
    const newSubmission = await db.query(
      'INSERT INTO form_submissions (form_id, user_id, submission_data) VALUES ($1, $2, $3) RETURNING submission_id',
      [formId, userId, submissionData]
    );

    res.status(201).json({
      msg: 'Form submitted successfully!',
      submissionId: newSubmission.rows[0].submission_id,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};


exports.getMySubmissions = async (req, res) => {
  try {
    const submissions = await db.query(
        `SELECT s.submission_id, s.status, s.submitted_at, f.form_name
         FROM form_submissions s
         JOIN forms f ON s.form_id = f.form_id
         WHERE s.user_id = $1
         ORDER BY s.submitted_at DESC`,
        [req.user.id]
    );
    res.json(submissions.rows);
  } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
  }
};