const mongoose = require('mongoose');
const Conversation = require('./conversationModel');

const MessageSchema = mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, 'Content is required'],
      trim: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Sender is required'],
    },
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation',
      required: [true, 'A conversation is required'],
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

// Auto-populate conversation on any find
MessageSchema.pre(/^find/, function (next) {
  this.populate('conversation');
  next();
});

MessageSchema.pre('save', async function (next) {
  console.log('this is pre middleware');
  const conversation = await Conversation.findByIdAndUpdate(this.conversation, {
    lastMessage: this.content,
  });

  console.log(conversation);
  next();
});

const Message = mongoose.model('Message', MessageSchema);

module.exports = Message;
