const Message = require('../models/messageModel');
const Conversations = require('../models/conversationModel');
const CatchAsync = require('../utils/catchAsync');
const socket = require('../utils/socketRoom');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const createRoom = require('../utils/socketRoom');

exports.getAllMessage = async (req, res) => {
  try {
    const messages = await Message.find();
    res.status(200).json({
      status: 'success',
      data: {
        messages,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      message: err,
    });
  }
};

exports.getMessageById = async (req, res) => {
  try {
    const messages = await Message.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: {
        messages,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      message: err,
    });
  }
};

exports.createMessage = async (req, res) => {
  try {
    // console.log();
    const messages = await Message.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        messages,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err,
    });
  }
};

exports.deleteMessage = async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      message: err,
    });
  }
};

exports.updateMessages = async (req, res) => {
  try {
    const messages = await Message.findByIdAndUpdate(req.params.id);
    res.status(200).json({
      status: 'success',
      data: {
        messages,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      message: err,
    });
  }
};

exports.checkIfConvoExists = async (req, res, next) => {
  try {
    const conversation = await Conversations.findById(req.body.conversation);
    if (!conversation) {
      await Conversations.create({
        participants: [req.body.senderId, req.body.recieverId],
        lastMessage: {
          text: req.body.content,
          senderId: req.body.senderId,
        },
      });
    }
    next();
  } catch (err) {
    console.log(err);
    return;
  }
};

exports.getMessageByConversationId = async (req, res) => {
  try {
    const message = await Message.find({ conversation: req.body.conversation });
    res.status(200).json({
      status: 'success',
      data: {
        message,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      message: err,
    });
  }
};

exports.sendMessage = CatchAsync(async (req, res, next) => {
  const user = await User.findById(req.body.userId);

  if (!user) {
    return next(new AppError('user does not exist', 404));
  }
  createRoom(user._id, req.body.conversationId);
  res.status(200).json({
    status: 'success',
    message: 'ack',
  });
});
