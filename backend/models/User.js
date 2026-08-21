const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },

  password: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    enum: ['tailor', 'customer'],
    default: 'tailor',
  },

  profile: {

    name: {
      type: String,
      default: '',
    },

    phone: {
      type: String,
      default: '',
    },

    address: {
      type: String,
      default: '',
    },

    profileImage: {
      type: String,
      default: '',
    },

  },

  shopDetails: {

    shopName: {
      type: String,
      default: '',
    },

    shopNumber: {
      type: String,
      default: '',
    },

    gstNumber: {
      type: String,
      default: '',
    },

    upiId: {
      type: String,
      default: '',
      trim: true,
    },

  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

});

// ======================================================
// PASSWORD HASH
// ======================================================

UserSchema.pre(
  'save',
  async function (next) {

    if (!this.isModified('password')) {
      return next();
    }

    this.password =
      await bcrypt.hash(
        this.password,
        10
      );

    next();
  }
);

// ======================================================
// PASSWORD CHECK
// ======================================================

UserSchema.methods.comparePassword =
  async function (password) {

    return bcrypt.compare(
      password,
      this.password
    );
  };

module.exports =
  mongoose.model(
    'User',
    UserSchema
  );


