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

io.on('connection', (sock) => {
  console.log('user Connected');
  sock.on('disconnect', () => {
    console.log('user disconnected');
  });
});
const port = process.env.PORT;

server.listen(port, () => {
  console.log(`server listening on ${port}`);
});

module.exports = io;
