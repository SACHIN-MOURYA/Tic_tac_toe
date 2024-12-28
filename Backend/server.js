const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const gameRoutes = require('./routes/gameRoutes');
const { handleSocketConnection } = require('./controllers/gameController');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = 3000;

// Middleware
app.use(express.json());
app.use('/api', gameRoutes);

// Socket.IO connection
handleSocketConnection(io);

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
