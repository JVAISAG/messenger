const mongoose = require('mongoose');

const MessageSchema = mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, 'Content is required'],
      trim: true,
    },
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation',
      required: [true, 'A conversation is is required'],
    },
    status: {
      delivered: {
        type: Boolean,
        default: false,
      },
      read: {
        type: Boolean,
        default: false,
      },
    },
    type: {
      type: String,
      enum: ['text', 'image', 'video', 'file', 'audio'],
      default: 'text',
    },
    attatchments: [
      {
        url: String,
        name: String,
        size: Number,
        mimeType: String,
        location: String,
      },
    ],
  },
  { timestamps: true }
);

const Message = mongoose.model('Message', MessageSchema);

module.exports = Message;
