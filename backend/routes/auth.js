const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

/*
=========================================================
SIGN UP
=========================================================
*/
router.post('/signup', async (req, res) => {
  try {
    const {
      email,
      password,
      role,
      profile,
      shopDetails,
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    let user = await User.findOne({
      email: email.trim().toLowerCase(),
    });

    if (user) {
      return res.status(400).json({
        success: false,
        message: 'User already exists',
      });
    }

    user = new User({
      email: email.trim().toLowerCase(),
      password,
      role: role || 'tailor',

      profile: profile || {},

      shopDetails: shopDetails || {},
    });

    await user.save();

    const payload = {
      user: {
        id: user.id,
        role: user.role,
      },
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      {
        expiresIn: '7d',
      }
    );

    res.status(201).json({
      success: true,
      token,

      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        profile: user.profile,
        shopDetails: user.shopDetails,
      },
    });

  } catch (err) {
    console.error('Signup error:', err);

    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});


/*
=========================================================
SIGN IN
=========================================================
*/
router.post('/signin', async (req, res) => {
  try {
    const {
      email,
      password,
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    const payload = {
      user: {
        id: user.id,
        role: user.role,
      },
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      {
        expiresIn: '7d',
      }
    );

    res.json({
      success: true,
      token,

      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        profile: user.profile,
        shopDetails: user.shopDetails,
      },
    });

  } catch (err) {
    console.error('Signin error:', err);

    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});


/*
=========================================================
CHANGE PASSWORD
=========================================================
*/
router.put('/change-password', auth, async (req, res) => {
  try {
    const {
      currentPassword,
      newPassword,
    } = req.body;

    // ---------------------------------------------
    // Validate input
    // ---------------------------------------------
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required',
      });
    }

    // ---------------------------------------------
    // Password length
    // ---------------------------------------------
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters',
      });
    }

    // ---------------------------------------------
    // Get logged-in user
    // ---------------------------------------------
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // ---------------------------------------------
    // Verify current password
    // ---------------------------------------------
    const isCurrentPasswordCorrect =
      await user.comparePassword(currentPassword);

    if (!isCurrentPasswordCorrect) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }

    // ---------------------------------------------
    // Prevent same password
    // ---------------------------------------------
    const isSamePassword =
      await user.comparePassword(newPassword);

    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        message: 'New password must be different from current password',
      });
    }

    // ---------------------------------------------
    // Update password
    // ---------------------------------------------
    user.password = newPassword;

    // User.js pre-save middleware will hash it
    await user.save();

    console.log(
      `Password changed successfully for user: ${user.email}`
    );

    res.json({
      success: true,
      message: 'Password changed successfully',
    });

  } catch (err) {
    console.error('Change password error:', err);

    res.status(500).json({
      success: false,
      message: 'Server error while changing password',
    });
  }
});


module.exports = router;