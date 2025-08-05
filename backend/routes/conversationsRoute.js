const express = require('express');
const conversationsController = require('../controller/coversationController');
const authController = require('../controller/authController');

const Router = express();

Router.route('/').post(
  authController.protect,
  conversationsController.createConversation
);

Router.route('/userConversation').get(
  authController.protect,
  conversationsController.getAllUserConversations
);

Router.route('/:id').get(conversationsController.getConversationById);

Router.route('/:id/messages').get(
  conversationsController.getMessageByConversationId
);

module.exports = Router;
