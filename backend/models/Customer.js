const mongoose = require('mongoose');

const MeasurementSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    value: {
      type: String,
      default: '',
      trim: true,
    },
  },
  { _id: false }
);

const CustomerSchema = new mongoose.Schema(
  {
    customerId: {
      type: String,
      unique: true,
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    // OPTIONAL
    email: {
      type: String,
      default: '',
      trim: true,
      lowercase: true,
    },

    address: {
      type: String,
      default: '',
      trim: true,
    },

    price: {
      type: Number,
      required: true,
    },

    /*
      New format:

      measurements: [
        {
          name: "Chest",
          value: "40"
        },
        {
          name: "कमर",
          value: "34"
        }
      ]

      Mixed is intentionally used so old customers
      containing the previous object format continue
      to work.
    */
    measurements: {
      type: mongoose.Schema.Types.Mixed,
      default: [],
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },

    updatedAt: {
      type: Date,
      default: Date.now,
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

module.exports = mongoose.model('Customer', CustomerSchema);