const mongoose = require('mongoose');

const ConversationSchema = mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true],
      },
    ],
    lastMessage: {
      text: String,

      timestamp: Date,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true],
    },
    unreadCount: {
      type: Map,
      of: Number,
      default: new Map(),
    },
  },
  {
    timestamps: true,
  }
);

const Conversation = mongoose.model('Conversation', ConversationSchema);

module.exports = Conversation;
