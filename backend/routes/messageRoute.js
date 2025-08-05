const express = require('express');
const MessageController = require('../controller/messagController');
const AuthController = require('../controller/authController');

const Router = express();

Router.route('/')
  .get(MessageController.getAllMessage)
  .post(MessageController.checkIfConvoExists, MessageController.createMessage);

Router.get(
  '/privatekey',
  AuthController.protect,
  MessageController.getPrivateKey
);

Router.route('/:id')
  .get(MessageController.getMessageById)
  .delete(MessageController.deleteMessage)
  .patch(MessageController.updateMessages);

Router.get('/publickey/:userId', MessageController.getPublicKey);

module.exports = Router;
