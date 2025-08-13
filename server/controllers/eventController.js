const db = require('../db');

exports.getEvents = async (req, res) => {
  try {
    const events = await db.query('SELECT * FROM events ORDER BY created_at DESC');
    res.json(events.rows);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

exports.addEvent = async (req, res) => {
  const { day, month, title, description } = req.body;
  try {
    const newEvent = await db.query(
      'INSERT INTO events (day, month, title, description) VALUES ($1, $2, $3, $4) RETURNING *',
      [day, month, title, description]
    );
    res.status(201).json(newEvent.rows[0]);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM events WHERE event_id = $1', [id]);
    res.json({ msg: 'Event removed' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
};