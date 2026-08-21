const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: true,
    },

    status: {
      type: String,

      enum: [
        'cutting',
        'stitch',
        'ready',
        'received',
      ],

      default: 'cutting',
    },

    cuttingDate: {
      type: Date,
    },

    stitchDate: {
      type: Date,
    },

    readyDate: {
      type: Date,
    },

    receivedDate: {
      type: Date,
    },

    emailSent: {
      type: Boolean,
      default: false,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },

  {
    timestamps: true,
  }
);

module.exports =
  mongoose.model('Order', OrderSchema);


