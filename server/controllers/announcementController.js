const db = require('../db');

exports.getAnnouncements = async (req, res) => {
  try {
    const announcements = await db.query('SELECT * FROM announcements ORDER BY created_at DESC');
    res.json(announcements.rows);
  } catch (err) { res.status(500).send('Server Error'); }
};

exports.addAnnouncement = async (req, res) => {
  const { date, title, description } = req.body;
  try {
    const newAnnouncement = await db.query(
      'INSERT INTO announcements (date, title, description) VALUES ($1, $2, $3) RETURNING *',
      [date, title, description]
    );
    res.status(201).json(newAnnouncement.rows[0]);
  } catch (err) { res.status(500).send('Server Error'); }
};

exports.deleteAnnouncement = async (req, res) => {
  try {
    await db.query('DELETE FROM announcements WHERE announcement_id = $1', [req.params.id]);
    res.json({ msg: 'Announcement removed' });
  } catch (err) { res.status(500).send('Server Error'); }
};