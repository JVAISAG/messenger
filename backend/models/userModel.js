const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const CatchAsync = require('../utils/catchAsync');

const UserSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'A firstname is required'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'A lastname is required'],
      trim: true,
    },
    userName: {
      type: String,
      required: [true, 'A username is required'],
      unique: true,
    },
    email: {
      type: String,
      required: [true, 'An email is required'],
    },
    passwordHash: {
      type: String,
      required: [true, 'A password is required'],
      select: false,
    },
    lastSeen: {
      type: Date,
      default: Date.now(),
    },
    profilePic: {
      type: String,
      default: '',
    },
    contacts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    passwordChangedAt: Date,
    role: {
      type: String,
      enum: ['admin', 'user'],
    },
    active: {
      type: Boolean,
      default: true,
    },
  },

  {
    timestamps: true,
  }
);

UserSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

UserSchema.methods.changedPasswordAfter = function (timestamp) {
  if (this.passwordChangedAt) {
    const passwordChangedTime = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return passwordChangedTime > timestamp;
  }
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
