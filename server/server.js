
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();


const allowedOrigins = [process.env.CLIENT_ORIGIN];


if (process.env.NODE_ENV !== 'production') {
  allowedOrigins.push('http://localhost:5173'); // or 3000 depending on your React port
}

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));


app.use(express.json());


app.use('/api/auth', require('./routes/auth'));
app.use('/api/forms', require('./routes/forms'));
app.use('/api/assets', require('./routes/assets'));
app.use('/api/grievances', require('./routes/grievances'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/publications', require('./routes/publications'));
app.use('/api/events', require('./routes/events'));
app.use('/api/users', require('./routes/users'));
app.use('/api/announcements', require('./routes/announcements'));
app.use('/api/key-moments', require('./routes/keyMoments'));


const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
