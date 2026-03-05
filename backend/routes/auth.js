import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const router = express.Router();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// User Signup
router.post('/signup', async (req, res) => {
  try {
    const { 
        name, email, password, photoUrl, role,
        businessName, ownerName, businessRegNo, phone, address, foodType, operatingHours,
        govRegCertUrl, fssaiCertUrl, gstCertUrl, addressProofUrl, idProofUrl,
        orgName, contactPerson, pickupAddress, recipientType, estimatedPeople, ngoRegCertUrl, authLetterUrl,
        lat, lng
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email.' });
    }

    if (role === 'admin') {
      return res.status(403).json({ message: 'Admin registration is not allowed publicly.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Create user
    const newUser = new User({
        name,
        email,
        password: hashedPassword,
        photoUrl,
        role: role || 'donor', // default role if not provided
        status: (role === 'admin') ? 'approved' : 'unverified',
        otp,
        otpExpires,
        businessName, ownerName, businessRegNo, phone, address, foodType, operatingHours,
        govRegCertUrl, fssaiCertUrl, gstCertUrl, addressProofUrl, idProofUrl,
        orgName, contactPerson, pickupAddress, recipientType, estimatedPeople, ngoRegCertUrl, authLetterUrl,
        ...(lat && lng ? { location: { type: 'Point', coordinates: [lng, lat] } } : {})
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'ShareBite - Verification OTP',
        text: `Hello ${name || businessName || orgName},\n\nYour ShareBite verification OTP is: ${otp}. It will expire in 10 minutes.\n\nThank you,\nThe ShareBite Team`
    };

    // Keep it async to prevent registration if the mail transport fails
    if (newUser.role !== 'admin') {
      transporter.sendMail(mailOptions, async (error, info) => {
        if (error) {
          console.log('Email sending failed:', error);
          // We shouldn't save the unverified user if the email system is broken, as they can never verify
          return res.status(500).json({ message: 'Failed to send OTP verification email. Please check your email configuration or try again later.' });
        } else {
          console.log('OTP Verification email sent: ' + info.response);
          
          await newUser.save();

          return res.status(202).json({
              message: 'OTP sent to email. Pending Verification.',
              requireOtp: true // Inform frontend to show OTP field
          });
        }
      });
    } else {
      await newUser.save();
      return res.status(202).json({
          message: 'Admin registered successfully.',
          requireOtp: false
      });
    }

  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).json({ message: 'Internal server error during signup.' });
  }
});

// User Verify OTP
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (user.status !== 'unverified') {
        return res.status(400).json({ message: 'User is already verified or pending admin review.' });
    }

    if (user.otp !== otp) {
        // Delete the user from the database if OTP is wrong as requested
        await User.findOneAndDelete({ email });
        return res.status(400).json({ message: 'Incorrect OTP. Registration deleted. Please sign up again.' });
    }

    if (new Date() > user.otpExpires) {
        await User.findOneAndDelete({ email });
        return res.status(400).json({ message: 'OTP Expired. Registration deleted. Please sign up again.' });
    }

    // OTP correct! Upgrade status
    user.status = 'pending';
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    // Send a welcome email indicating pending status
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'ShareBite - Registration Pending Approval',
        text: `Hello ${user.name || user.businessName || user.orgName},\n\nYour verification is successful. Your ShareBite account is currently under review by our administration team. We will notify you once your account has been approved.\n\nThank you,\nThe ShareBite Team`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log("Failed to send pending approval email: " + error.message);
            return res.status(500).json({ message: 'Internal server error while sending email.' });
        } else {
            console.log("Pending approval email sent: " + info.response);
            res.status(200).json({ message: 'Email verified successfully! Pending Admin Approval.' });
        }
    });

  } catch (error) {
    console.error('Verify OTP Error:', error);
    res.status(500).json({ message: 'Internal server error during verification.' });
  }
});

// User Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    // Check account status
    if (user.role !== 'admin') {
        if (user.status === 'pending') {
            return res.status(403).json({ message: 'Account pending admin verification.' });
        }
        if (user.status === 'rejected') {
            return res.status(403).json({ message: 'Account registration has been rejected.' });
        }
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role, name: user.name, photoUrl: user.photoUrl },
      process.env.JWT_SECRET || 'fallback_secret_key',
      { expiresIn: '1d' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        photoUrl: user.photoUrl,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Internal server error during login.' });
  }
});

export default router;
