const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");
const { body, validationResult } = require("express-validator");

// SIGN UP ROUTE
router.post(
  "/register",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").notEmpty().withMessage("Email is required").isEmail().withMessage("Invalid email"),
    body("password").notEmpty().withMessage("Password is required"),
    body("confirmPassword")
      .notEmpty()
      .withMessage("Confirm Password Is Required")
      .custom((value, { req }) => value === req.body.password)
      .withMessage("Passwords Do Not Match"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
        });
      }
      const { name, email, password } = req.body;
      // Check If User Already Exists
      const existingUser = await User.findOne({
        email,
      });
      if (existingUser) {
        return res.status(400).json({
          message: "User Already Exists",
        });
      }
      // Password Hashing
      const hashedPassword = await bcrypt.hash(password, 10);
      // Creating New User
      const newUser = new User({
        name,
        email,
        password: hashedPassword,
      });
      // Saving User Info In Database
      await newUser.save();
      return res.status(201).json({
        message: "User Registered Successfully",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Server Error",
      });
    }
  }
);

// Login Route
router.post(
  "/login",
  [
    body("email").notEmpty().withMessage("Email Is Required!!!").isEmail().withMessage("Invalid email"),
    body("password").notEmpty().withMessage("Password Is Required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
        });
      }
      const { email, password } = req.body;
      // Check If User Exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({
          message: "Invalid Email",
        });
      }
      // Comparing Passwords
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({
          message: "Invalid Password",
        });
      }
      // Token Generation
      return res.status(200).json({
        message: "Logged In Successfully",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Server Error",
      });
    }
  }
);
// Logout Route
router.post("/logout", (req, res) => {
    // Destroy the session
    req.session.destroy((error) => {
      if (error) {
        console.error(error);
        return res.status(500).json({
          message: "Server Error",
        });
      }
      // Clear the session cookie
      res.clearCookie("connect.sid");
  
      return res.status(200).json({
        message: "Logged Out Successfully",
      });
    });
  });
  

 module.exports = router;
