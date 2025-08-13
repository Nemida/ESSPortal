const db = require('../db');


exports.getMyAssets = async (req, res) => {
  try {
    const assets = await db.query(
      `SELECT a.asset_name, a.asset_type, a.expiry_date, al.assigned_date
       FROM asset_allocations al
       JOIN it_assets a ON al.asset_id = a.asset_id
       WHERE al.user_id = $1 AND al.returned_date IS NULL`,
      [req.user.id]
    );
    res.json(assets.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getAllAssets = async (req, res) => {
  try {
    const assets = await db.query(`
      SELECT
        a.asset_id,
        a.asset_name,
        a.asset_type,
        a.status,
        u.email
      FROM it_assets a
      LEFT JOIN asset_allocations al ON a.asset_id = al.asset_id AND al.is_active = true
      LEFT JOIN users u ON al.user_id = u.user_id
      ORDER BY a.asset_name ASC
    `);
    res.json(assets.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// ... (other functions)

exports.addAsset = async (req, res) => {
  const { asset_name, asset_type, license_key, email } = req.body; // Changed userId to email
  try {
    const newAsset = await db.query(
      'INSERT INTO it_assets (asset_name, asset_type, license_key) VALUES ($1, $2, $3) RETURNING *',
      [asset_name, asset_type, license_key]
    );
    const createdAsset = newAsset.rows[0];

    if (email && createdAsset) {
      // Find user by email
      const userResult = await db.query('SELECT user_id FROM users WHERE email = $1', [email]);
      if (userResult.rows.length > 0) {
        const userId = userResult.rows[0].user_id;
        // Create allocation
        await db.query('INSERT INTO asset_allocations (asset_id, user_id, is_active) VALUES ($1, $2, true)', [createdAsset.asset_id, userId]);
        // Update asset status
        await db.query("UPDATE it_assets SET status = 'Assigned' WHERE asset_id = $1", [createdAsset.asset_id]);
      }
    }
    res.status(201).json(createdAsset);
  } catch (err) { res.status(500).send('Server Error'); }
};

exports.deleteAsset = async (req, res) => {
  try {
    // First, delete any allocations of this asset
    await db.query('DELETE FROM asset_allocations WHERE asset_id = $1', [req.params.id]);
    // Then, delete the asset itself
    await db.query('DELETE FROM it_assets WHERE asset_id = $1', [req.params.id]);
    res.json({ msg: 'Asset removed' });
  } catch (err) { res.status(500).send('Server Error'); }
};

// ... (keep getAllAssets, addAsset, deleteAsset) ...

// @desc    Assign an asset to a user (Admin only)
exports.assignAsset = async (req, res) => {
  const { assetId, email } = req.body; // Changed userId to email
  try {
    const userResult = await db.query('SELECT user_id FROM users WHERE email = $1', [email]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ msg: 'User with that email not found.' });
    }
    const userId = userResult.rows[0].user_id;

    await db.query('INSERT INTO asset_allocations (asset_id, user_id, is_active) VALUES ($1, $2, true)', [assetId, userId]);
    await db.query("UPDATE it_assets SET status = 'Assigned' WHERE asset_id = $1", [assetId]);
    res.status(200).json({ msg: 'Asset assigned successfully' });
  } catch (err) { res.status(500).send('Server Error'); }
};

// @desc    Unassign an asset from a user (Admin only)
exports.unassignAsset = async (req, res) => {
  const { assetId, allocationId } = req.body;
  try {
    // 1. Mark the current allocation as inactive
    await db.query(
      "UPDATE asset_allocations SET is_active = false, returned_date = CURRENT_TIMESTAMP WHERE allocation_id = $1",
      [allocationId]
    );
    // 2. Update the asset's status back to 'Available'
    await db.query("UPDATE it_assets SET status = 'Available' WHERE asset_id = $1", [assetId]);
    res.status(200).json({ msg: 'Asset unassigned successfully' });
  } catch (err) { res.status(500).send('Server Error'); }
};

// @desc    Get the full allocation history for all assets (Admin only)
exports.getAssetHistory = async (req, res) => {
    try {
        const history = await db.query(`
            SELECT al.allocation_id, a.asset_name, u.first_name, u.last_name, al.assigned_date, al.returned_date
            FROM asset_allocations al
            JOIN it_assets a ON al.asset_id = a.asset_id
            JOIN users u ON al.user_id = u.user_id
            ORDER BY al.assigned_date DESC
        `);
        res.json(history.rows);
    } catch (err) { res.status(500).send('Server Error'); }
};