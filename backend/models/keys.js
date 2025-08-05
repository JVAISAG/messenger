const mongoose = require('mongoose');

const KeySchema = mongoose.Schema({
  myPublicKey: {
    type: String,
    required: [true, 'Required a private key'],
  },
  privateKey: {
    encryptedPrivateKey: {
      type: String,
      required: [true, 'Required a public key'],
    },
    nonce: {
      type: String,
      required: [true, 'A nonce is required'],
    },
  },
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
});

KeySchema.pre(/^find/, function (next) {
  this.select();
  next();
});

const Key = mongoose.model('key', KeySchema);

module.exports = Key;
