const db = require('../db');


exports.getProjects = async (req, res) => {
  try {
    const projects = await db.query('SELECT * FROM projects ORDER BY project_id DESC');
    res.json(projects.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};


exports.addProject = async (req, res) => {
  const { projectName, description, status } = req.body;
  try {
    const newProject = await db.query(
      'INSERT INTO projects (project_name, description, status) VALUES ($1, $2, $3) RETURNING *',
      [projectName, description, status]
    );
    res.status(201).json(newProject.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};


exports.deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM projects WHERE project_id = $1', [id]);
    res.json({ msg: 'Project removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};