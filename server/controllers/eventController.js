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
  const { event_date, title, description } = req.body;
  
  const date = new Date(event_date);
  const day = String(date.getDate()).padStart(2, '0');
  const month = date.toLocaleString('en-US', { month: 'short' });

  try {
    const newEvent = await db.query(
      'INSERT INTO events (event_date, day, month, title, description) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [event_date, day, month, title, description]
    );
    res.status(201).json(newEvent.rows[0]);
  } catch (err) {
    console.error(err.message);
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