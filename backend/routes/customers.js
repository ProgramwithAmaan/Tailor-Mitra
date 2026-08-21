const express = require('express');
const auth = require('../middleware/auth');
const Customer = require('../models/Customer');
const Order = require('../models/Order');

const router = express.Router();

/* =========================================================
   CUSTOMER ID GENERATOR
========================================================= */

function generateCustomerId() {
  const date = new Date();

  const year = date.getFullYear().toString().slice(-2);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, '0');

  return `CUST${year}${month}${day}${random}`;
}

/* =========================================================
   NORMALIZE MEASUREMENTS
========================================================= */

function normalizeMeasurements(measurements) {
  if (!measurements) {
    return [];
  }

  /*
    New format:
    [
      { name: "Chest", value: "40" }
    ]
  */

  if (Array.isArray(measurements)) {
    return measurements
      .filter((item) => item && item.name)
      .map((item) => ({
        name: String(item.name).trim(),
        value: item.value !== undefined ? String(item.value).trim() : '',
      }));
  }

  /*
    Backward compatibility for old data:

    {
      chest: "40",
      waist: "34"
    }
  */

  if (typeof measurements === 'object') {
    return Object.entries(measurements)
      .filter(([key, value]) => value !== undefined && value !== '')
      .map(([key, value]) => ({
        name: key.charAt(0).toUpperCase() + key.slice(1),
        value: String(value),
      }));
  }

  return [];
}

/* =========================================================
   ADD CUSTOMER
========================================================= */

router.post('/', auth, async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      address,
      measurements,
      price,
    } = req.body;

    // Email intentionally NOT required
    if (!name || !phone || price === undefined || price === '') {
      return res.status(400).json({
        success: false,
        message: 'Name, phone, and price are required',
      });
    }

    const customerId = generateCustomerId();

    const normalizedMeasurements =
      normalizeMeasurements(measurements);

    const customer = new Customer({
      customerId,

      name: String(name).trim(),

      phone: String(phone).trim(),

      email: email
        ? String(email).trim().toLowerCase()
        : '',

      address: address
        ? String(address).trim()
        : '',

      measurements: normalizedMeasurements,

      price: Number(price),

      userId: req.user.id,
    });

    await customer.save();

    /*
      Automatically create order for customer
    */

    const order = new Order({
      customerId: customer._id,

      userId: req.user.id,

      status: 'cutting',
    });

    await order.save();

    res.status(201).json({
      success: true,

      customer,

      order,

      message: 'Customer added successfully',
    });
  } catch (err) {
    console.error('Error adding customer:', err);

    res.status(500).json({
      success: false,
      message: 'Server error: ' + err.message,
    });
  }
});

/* =========================================================
   GET ALL CUSTOMERS
========================================================= */

router.get('/', auth, async (req, res) => {
  try {
    const customers = await Customer.find({
      userId: req.user.id,
    }).sort({
      createdAt: -1,
    });

    res.json(customers);
  } catch (err) {
    console.error('Get customers error:', err);

    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

/* =========================================================
   SEARCH CUSTOMERS
========================================================= */

router.get('/search', auth, async (req, res) => {
  try {
    const q = String(req.query.q || '').trim();

    if (!q) {
      const customers = await Customer.find({
        userId: req.user.id,
      }).sort({
        createdAt: -1,
      });

      return res.json(customers);
    }

    const customers = await Customer.find({
      userId: req.user.id,

      $or: [
        {
          name: {
            $regex: q,
            $options: 'i',
          },
        },

        {
          phone: {
            $regex: q,
            $options: 'i',
          },
        },

        {
          customerId: {
            $regex: q,
            $options: 'i',
          },
        },

        {
          email: {
            $regex: q,
            $options: 'i',
          },
        },
      ],
    }).sort({
      createdAt: -1,
    });

    res.json(customers);
  } catch (err) {
    console.error('Search error:', err);

    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

/* =========================================================
   GET SINGLE CUSTOMER
========================================================= */

router.get('/:id', auth, async (req, res) => {
  try {
    const customer = await Customer.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found',
      });
    }

    res.json(customer);
  } catch (err) {
    console.error('Get customer error:', err);

    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

/* =========================================================
   UPDATE CUSTOMER
========================================================= */

router.put('/:id', auth, async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      address,
      measurements,
      price,
    } = req.body;

    const customer = await Customer.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found',
      });
    }

    /*
      Update only the fields provided
    */

    if (name !== undefined) {
      customer.name = String(name).trim();
    }

    if (phone !== undefined) {
      customer.phone = String(phone).trim();
    }

    /*
      Email can be empty
    */

    if (email !== undefined) {
      customer.email = email
        ? String(email).trim().toLowerCase()
        : '';
    }

    if (address !== undefined) {
      customer.address = String(address).trim();
    }

    if (price !== undefined && price !== '') {
      customer.price = Number(price);
    }

    if (measurements !== undefined) {
      customer.measurements =
        normalizeMeasurements(measurements);
    }

    await customer.save();

    /*
      Also update the associated order amount if your
      Order model later contains totalAmount.
    */

    await Order.updateMany(
      {
        customerId: customer._id,
        userId: req.user.id,
      },
      {
        $set: {
          totalAmount: customer.price,
        },
      }
    );

    res.json({
      success: true,
      customer,
      message: 'Customer updated successfully',
    });
  } catch (err) {
    console.error('Update customer error:', err);

    res.status(500).json({
      success: false,
      message: 'Server error: ' + err.message,
    });
  }
});

/* =========================================================
   DELETE CUSTOMER
========================================================= */

router.delete('/:id', auth, async (req, res) => {
  try {
    const customer = await Customer.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found',
      });
    }

    /*
      Delete related orders too
    */

    await Order.deleteMany({
      customerId: customer._id,
      userId: req.user.id,
    });

    await Customer.deleteOne({
      _id: customer._id,
    });

    res.json({
      success: true,
      message: 'Customer deleted successfully',
    });
  } catch (err) {
    console.error('Delete customer error:', err);

    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

module.exports = router;