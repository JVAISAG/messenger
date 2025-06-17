const Message = require('../models/messageModel');
const io = require('../server');

const createRoom = (userId, conversationId) => {
  io.on('connection', (socket) => {
    socket.on('join', () => {
      socket.join(userId);
    });

    socket.on('sendMessage', async ({ toUserId, message }) => {
      console.log('message: ', message);
      try {
        await Message.create({
          content: message,
          conversation: conversationId,
        });

        io.to(toUserId).emit('recieveMessage', {
          message,
          from: socket.id,
        });
      } catch (err) {
        console.error(err);
      }
    });

    socket.on('disconnect', () => {
      console.log('disconnected');
    });
  });
};

module.exports = createRoom;
