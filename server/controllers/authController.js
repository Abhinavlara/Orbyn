const User = require('../models/User');
const generateToken = require('../services/generateToken');

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'user',
    });

    if (user) {
      const token = generateToken(user._id);
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
      });
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token,
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      const token = generateToken(user._id);
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
      });
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
        token,
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Public
const logoutUser = (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0)
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password').populate('wishlist');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.profileImage = req.body.profileImage || user.profileImage;
      if (req.body.password) {
        user.password = req.body.password;
      }
      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        profileImage: updatedUser.profileImage,
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle wishlist property
// @route   PUT /api/auth/wishlist/:propertyId
// @access  Private
const toggleWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const propertyId = req.params.propertyId;
    const index = user.wishlist.indexOf(propertyId);
    if (index > -1) {
      user.wishlist.splice(index, 1);
    } else {
      user.wishlist.push(propertyId);
    }
    await user.save();
    res.json({ wishlist: user.wishlist });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const OTP = require('../models/OTP');

// @desc    Send OTP to phone/email
// @route   POST /api/auth/send-otp
const sendOTP = async (req, res) => {
  try {
    const { identifier } = req.body; // email or phone
    let generatedOTP;

    // DEV MODE: Hardcoded OTP
    if (process.env.NODE_ENV === 'development') {
      generatedOTP = "123456";
      console.log(`\n🔥 [DEV MODE] OTP for ${identifier}: ${generatedOTP}\n`);
    } else {
      generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
    }

    // Upsert OTP
    await OTP.findOneAndUpdate(
      { identifier },
      { 
        otp: generatedOTP, 
        expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 mins
      },
      { upsert: true, new: true }
    );

    // Production SMS Sending (MSG91)
    if (process.env.NODE_ENV === 'production' && !identifier.includes('@')) {
      const formattedPhone = identifier.startsWith('+') ? identifier.slice(1) : identifier;
      const finalPhone = formattedPhone.startsWith('91') ? formattedPhone : `91${formattedPhone}`;
      
      try {
        const axios = require('axios');
        await axios.post('https://control.msg91.com/api/v5/otp', {
          template_id: process.env.MSG91_TEMPLATE_ID,
          mobile: finalPhone,
          otp: generatedOTP
        }, {
          headers: { 
            "authkey": process.env.MSG91_AUTH_KEY,
            "Content-Type": "application/json" 
          }
        });
        console.log(`[MSG91] OTP sent successfully to ${finalPhone}`);
      } catch (smsError) {
        console.error('[MSG91] Error sending SMS:', smsError.response?.data || smsError.message);
        // Fallback for production if SMS fails: Still allow dev to see it in logs if configured
      }
    }

    res.json({ 
      success: true, 
      message: process.env.NODE_ENV === 'development' 
        ? `DEV MODE: OTP sent to ${identifier} (Check Console)` 
        : `OTP sent to ${identifier}`,
      otp: process.env.NODE_ENV === 'development' ? generatedOTP : undefined // Visible only in dev
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify OTP and login
// @route   POST /api/auth/verify-otp
const verifyOTP = async (req, res) => {
  try {
    const { identifier, otp, name, email } = req.body;

    const otpDoc = await OTP.findOne({ identifier, otp });

    if (!otpDoc) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // OTP valid, find or create user
    let user = await User.findOne({ $or: [{ phone: identifier }, { email: identifier }] });

    if (!user) {
      // Create new user if name and email provided (for phone signup)
      if (identifier.includes('@')) {
         user = await User.create({ email: identifier, name: name || 'User', isEmailVerified: true });
      } else {
         user = await User.create({ phone: identifier, name: name || 'Guest', email: email, isPhoneVerified: true });
      }
    }

    const token = generateToken(user._id);
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000
    });

    // Delete OTP after successful verification
    await OTP.deleteOne({ _id: otpDoc._id });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Test OTP endpoint
// @route   GET /api/auth/test-otp
const testOTP = async (req, res) => {
  if (process.env.NODE_ENV !== 'development') {
    return res.status(403).json({ message: 'Forbidden' });
  }
  const { phone } = req.query;
  res.json({ success: true, otp: "123456", phone });
};

module.exports = { registerUser, loginUser, logoutUser, getUserProfile, updateUserProfile, toggleWishlist, sendOTP, verifyOTP, testOTP };

