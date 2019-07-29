const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();

const User = require('../models/user');

router.post('/signup', async (req, res, next) => {
  try {
    const hashPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      email: req.body.email,
      password: hashPassword
    })
    const result = await user.save();
    res.status(201).json({
      message: "User created",
      result
    })
  } catch (error) {
    res.status(500).json({
      message: "Error",
      error
    })
  }
})

router.post('/login', async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json({
        message: "Unauthozired"
      })
    }
    const passwordMatched = await bcrypt.compare(req.body.password, user.password);
    if (!passwordMatched) {
      return res.status(401).json({
        message: "Unauthozired"
      })
    }
    // Log user in
    const token = jwt.sign(
      { email: user.emai, userId: user._id },
      "secret_for_token",
      { expiresIn: "1h" }
    );
    res.status(201).json({
      message: "User logged in",
      token
    })
  } catch (error) {
    res.status(401).json({
      message: "Unauthozired"
    })
  }
})

module.exports = router;