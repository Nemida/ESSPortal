const db = require('../db');


exports.submitGrievance = async (req, res) => {
  const { subject, details } = req.body;
  const userId = req.user.id;

  try {
    await db.query(
      'INSERT INTO grievances (user_id, grievance_subject, grievance_details) VALUES ($1, $2, $3)',
      [userId, subject, details]
    );
    res.status(201).json({ msg: 'Grievance submitted successfully.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
exports.getAllGrievances = async (req, res) => {
  try {

    const grievances = await db.query(
      'SELECT grievance_id, grievance_subject, grievance_details, status, submitted_at FROM grievances ORDER BY submitted_at DESC'
    );
    res.json(grievances.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};