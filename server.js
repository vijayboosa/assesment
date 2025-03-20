// server.js (Updated)
import http from 'http';
import { Server } from 'socket.io';
import app from './app.js';
import config from './config/config.js';
import db from './models/index.js';
import { verifyToken } from './utils/jwt.js';
import cookie from 'cookie';


// HTTP server
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: config.clientUrl, 
    credentials: true // allow cookies
  },
  connectionStateRecovery: {
    maxDisconnectionDuration: 2 * 60 * 1000 // 2 minutes
  }
});

// Socket io authentication middleware
io.use((socket, next) => {
  try {
    const cookieHeader = socket.handshake.headers.cookie;
    if (!cookieHeader) throw new Error("No cookies found");

    // Parse cookies
    const cookies = cookie.parse(cookieHeader);
    let token = cookies.token;
    if (!token) throw new Error("No JWT token found");

    // Verify token
    const decoded = verifyToken(token);
    socket.user = { id: decoded.id, role: decoded.role };

    next();
  } catch (err) {
    console.error("Authentication error:", err.message);
    next(new Error("WebSocket authentication failed"));
  }
});

//  Handle when client connected
io.on('connection', (socket) => {
  console.log(`User ${socket.user.id} connected. role ${socket.user.role}`);
    
  if (socket.user.role === "jobseeker") {
    // Join jobseeker-specific room
    socket.join('jobSeeker');
    socket.join(`user:${socket.user.id}`);
  } else {

    // Join employee-specific room
    socket.join(`employee:${socket.user.id}`);  
  }
  

  socket.on('disconnect', () => {
    console.log(`User ${socket.user.id} disconnected`);
  });
});

// Attaching io instance to Express app
app.set('io', io);

// In production it see better to use migrations
db.sequelize.sync() 
.then(() => {
  server.listen(config.port, () => {
    console.log(`Server running on port http://localhost:${config.port}`);
    console.log(`Socket.IO endpoint: ws://localhost:${config.port}/socket.io/`);
  });
})
.catch(err => console.error('Failed to sync database:', err));
