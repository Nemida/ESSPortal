const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// Build allowed origins array
const allowedOrigins = [];

// Add production origin if set
if (process.env.CLIENT_ORIGIN) {
  allowedOrigins.push(process.env.CLIENT_ORIGIN);
}

// Add localhost for development
if (process.env.NODE_ENV !== 'production') {
  allowedOrigins.push('http://localhost:5173');
}

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }
});

// Make io available to routes/controllers
app.set('io', io);

io.on('connection', (socket) => {
  console.log('🔌 Client connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('🔌 Client disconnected:', socket.id);
  });
});

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or Postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('Blocked by CORS:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
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
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
