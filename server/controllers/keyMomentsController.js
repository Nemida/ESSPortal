const db = require('../db');

exports.getImages = async (req, res) => {
  try {
    const images = await db.query('SELECT * FROM key_moments ORDER BY image_id DESC');
    res.json(images.rows);
  } catch (err) { res.status(500).send('Server Error'); }
};

exports.addImage = async (req, res) => {
  const { imageUrl, altText } = req.body;
  try {
    const newImage = await db.query(
      'INSERT INTO key_moments (image_url, alt_text) VALUES ($1, $2) RETURNING *',
      [imageUrl, altText]
    );
    // Emit WebSocket event
    req.app.get('io').emit('data-updated', { type: 'key-moments' });
    res.status(201).json(newImage.rows[0]);
  } catch (err) { res.status(500).send('Server Error'); }
};

exports.deleteImage = async (req, res) => {
  try {
    await db.query('DELETE FROM key_moments WHERE image_id = $1', [req.params.id]);
    // Emit WebSocket event
    req.app.get('io').emit('data-updated', { type: 'key-moments' });
    res.json({ msg: 'Image removed' });
  } catch (err) { res.status(500).send('Server Error'); }
};