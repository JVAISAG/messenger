const mongoose = require('mongoose');
const Conversation = require('./conversationModel');

const MessageSchema = mongoose.Schema(
  {
    content: {
      encryptedMessage: {
        type: String,
        required: [true, 'message is required'],
        trim: true,
      },
      nonce: {
        type: String,
        required: [true, 'nonce is required'],
        trim: true,
      },
    },
    // nonce: {
    //   type: String,
    //   required: true,
    // },
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
    forSender: {
      type: Boolean,
      default: false,
    },
    recieverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'reciever id is required'],
    },
  },
  { timestamps: true }
);

// Auto-populate conversation on any find
MessageSchema.pre(/^find/, function (next) {
  this.populate('conversation');
  next();
});

MessageSchema.pre('save', async function (next) {
  const conversation = await Conversation.findByIdAndUpdate(this.conversation, {
    lastMessage: this.content,
  });
  next();
});

const Message = mongoose.model('Message', MessageSchema);

module.exports = Message;
