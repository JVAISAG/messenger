const Conversations = require('../models/conversationModel');
const Message = require('../models/messageModel');
const CatchAsync = require('../utils/catchAsync');

exports.getAllUserConversations = CatchAsync(async (req, res) => {
  const conversations = await Conversations.find({
    participants: req.body.id,
  });
  res.status(200).json({
    status: 'success',
    data: {
      conversations,
    },
  });
});

exports.getConversationById = CatchAsync(async (req, res) => {
  const convo = await Conversations.findById(req.params.id);
  res.status(200).json({
    status: 'success',
    data: {
      conversation: convo,
    },
  });
});

exports.createConversation = CatchAsync(async (req, res) => {
  const conversationExist = await Conversations.find({
    participants: { $all: [req.body.senderId, req.params.id] },
  });

  if (conversationExist.length === 0) {
    console.log('its here');
    return res.status(200).json({
      status: 'success',
      data: {
        conversationExist,
      },
    });
  }
  console.log('this is it');

  const newConversation = await Conversations.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      newConversation,
    },
  });
});

exports.getMessageByConversationId = CatchAsync(async (req, res) => {
  const message = await Message.find({ conversation: req.body.conversation });
  res.status(200).json({
    status: 'success',
    data: {
      message,
    },
  });
});
