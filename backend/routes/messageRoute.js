const express = require('express');
const MessageController = require('../controller/messagController');

const Router = express();

Router.route('/')
  .get(MessageController.getAllMessage)
  .post(MessageController.checkIfConvoExists, MessageController.createMessage);

Router.route('/:id')
  .get(MessageController.getMessageById)
  .delete(MessageController.deleteMessage)
  .patch(MessageController.updateMessages);

module.exports = Router;
