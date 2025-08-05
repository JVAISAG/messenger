const dotenv = require('dotenv');
const mongoose = require('mongoose');
const { Server } = require('socket.io');
const { createServer } = require('node:http');

dotenv.config({ path: './config.env' });
const app = require('./app');
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

mongoose
  .connect(process.env.MONGODB)
  .then(() => {
    console.log('Database connected succesfully');
  })
  .catch((err) => {
    console.log('Database Error: ', err);
  });

const users = new Map();
const publicKeys = new Map();

io.on('connection', (sock) => {
  // console.log('user Connected: ', sock.id);

  //creating a room (roomId is conversation id)
  sock.on('join-room', ({ roomId, userId }) => {
    sock.join(roomId);
    users.set(sock.id, userId);
    // console.log(`${userId} joined the room ${roomId}`);
    sock.on('public-key', ({ publicKey }) => {
      console.log('data: ', publicKey);
      // publicKeys.set(userId, data);
    });
  });

  //sending messages to everyone in the room
  sock.on('send-message', ({ roomId, message, sender }) => {
    sock.to(roomId).emit('recieve-message', { message, sender });
  });

  //disconnecting from the room
  sock.on('disconnect', () => {
    // console.log('user disconnected');
    users.delete(sock.id);
  });
});
const port = process.env.PORT;

server.listen(port, () => {
  console.log(`server listening on ${port}`);
});

module.exports = io;
