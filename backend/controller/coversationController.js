const { default: mongoose, Types } = require('mongoose');
const Conversations = require('../models/conversationModel');
const Message = require('../models/messageModel');
const CatchAsync = require('../utils/catchAsync');

exports.getAllUserConversations = CatchAsync(async (req, res) => {
  const conversations = await Conversations.find({
    participants: req.user._id,
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
  const senderId = new Types.ObjectId(req.body.participants[0]);
  const recieverId = new Types.ObjectId(req.body.participants[1]);

  const sortedIds = [senderId, recieverId].sort();

  const conversationExist = await Conversations.find({
    participants: { $all: sortedIds },
  });

  if (conversationExist.length !== 0) {
    return;
  }

  const newConversation = await Conversations.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      newConversation,
    },
  });
});

exports.getMessageByConversationId = CatchAsync(async (req, res) => {
  const message = await Message.find({ conversation: req.params.id }).sort({
    createdAt: 1,
  });
  res.status(200).json({
    status: 'success',
    data: {
      message,
    },
  });
});
