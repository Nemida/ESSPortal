const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// Build allowed origins array
const allowedOrigins = [
  'http://localhost:5173',  // Vite dev server
  'http://localhost:3000',  // Alternative local dev
];

// Add production origin if set
if (process.env.CLIENT_ORIGIN) {
  allowedOrigins.push(process.env.CLIENT_ORIGIN);
}

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }
});

app.set('io', io);

const connectedUsers = new Map();
const chatHistory = [];
const MAX_HISTORY = 100;

io.on('connection', (socket) => {
  
  socket.on('user-join', (userData) => {
    connectedUsers.set(socket.id, userData);
    
    socket.emit('chat-history', chatHistory);
    io.emit('users-online', Array.from(connectedUsers.values()));
  });
  
  socket.on('chat-message', (messageData) => {
    const user = connectedUsers.get(socket.id);
    if (user) {
      const message = {
        id: Date.now(),
        user_id: user.user_id,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
        content: messageData.content,
        timestamp: new Date().toISOString(),
      };
      
      chatHistory.push(message);
      if (chatHistory.length > MAX_HISTORY) {
        chatHistory.shift();
      }
      
      io.emit('new-message', message);
    }
  });
  
  socket.on('typing', (isTyping) => {
    const user = connectedUsers.get(socket.id);
    if (user) {
      socket.broadcast.emit('user-typing', { user, isTyping });
    }
  });
  
  socket.on('disconnect', () => {
    connectedUsers.delete(socket.id);
    io.emit('users-online', Array.from(connectedUsers.values()));
  });
});

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
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
app.use('/api/ai', require('./routes/ai'));


const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
