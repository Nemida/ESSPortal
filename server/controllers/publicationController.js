const db = require('../db');


exports.getPublications = async (req, res) => {
  try {
    const publications = await db.query('SELECT * FROM publications ORDER BY publication_id DESC');
    res.json(publications.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};


exports.addPublication = async (req, res) => {
  const { type, title, meta, description, pdfLink } = req.body;
  try {
    const newPublication = await db.query(
      'INSERT INTO publications (type, title, meta, description, pdf_link) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [type, title, meta, description, pdfLink]
    );
    // Emit WebSocket event
    req.app.get('io').emit('data-updated', { type: 'publications' });
    res.status(201).json(newPublication.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};


exports.deletePublication = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM publications WHERE publication_id = $1', [id]);
    // Emit WebSocket event
    req.app.get('io').emit('data-updated', { type: 'publications' });
    res.json({ msg: 'Publication removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};