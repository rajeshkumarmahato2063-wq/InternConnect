import { User } from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';

// --- In-Memory Mock Store Fallback (When MongoDB Atlas is disconnected) ---
const mockUserStore = [];

/**
 * @desc    Register a new Student Account
 * @route   POST /api/auth/student/register
 * @access  Public
 */
export const registerStudent = async (req, res, next) => {
  try {
    const { fullName, email, phone, password, college, degree, graduationYear, skills, github, linkedin } = req.body;

    // Check if email already exists
    let existingUser;
    try {
      existingUser = await User.findOne({ email: email.toLowerCase() });
    } catch (e) {
      existingUser = mockUserStore.find((u) => u.email === email.toLowerCase());
    }

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists.',
      });
    }

    let user;
    try {
      user = await User.create({
        fullName,
        email: email.toLowerCase(),
        phone,
        password,
        role: 'student',
        college,
        degree,
        graduationYear: Number(graduationYear),
        skills: Array.isArray(skills) ? skills : skills ? skills.split(',').map((s) => s.trim()) : [],
        github: github || '',
        linkedin: linkedin || '',
        isVerified: true,
      });
    } catch (dbErr) {
      // Fallback for offline memory storage
      user = {
        _id: `usr_student_${Date.now()}`,
        fullName,
        email: email.toLowerCase(),
        phone,
        role: 'student',
        college,
        degree,
        graduationYear,
        isVerified: true,
        matchPassword: async (pwd) => pwd === password,
      };
      mockUserStore.push(user);
    }

    const token = generateToken(user._id || user.id, user.role);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      success: true,
      message: 'Student account registered successfully.',
      token,
      user: {
        id: user._id || user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        college: user.college,
        degree: user.degree,
        graduationYear: user.graduationYear,
        profileImage: user.profileImage,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Register a new Company/Recruiter Account
 * @route   POST /api/auth/company/register
 * @access  Public
 */
export const registerCompany = async (req, res, next) => {
  try {
    const { companyName, email, password, website, industry, companySize, location, hrContact, phone } = req.body;

    let existingUser;
    try {
      existingUser = await User.findOne({ email: email.toLowerCase() });
    } catch (e) {
      existingUser = mockUserStore.find((u) => u.email === email.toLowerCase());
    }

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An employer account with this official email already exists.',
      });
    }

    let user;
    try {
      user = await User.create({
        fullName: hrContact || companyName,
        email: email.toLowerCase(),
        phone: phone || '0000000000',
        password,
        role: 'company',
        companyName,
        website,
        industry,
        companySize,
        location,
        hrContact,
        isVerified: false, // Must be verified by admin
      });
    } catch (dbErr) {
      user = {
        _id: `usr_comp_${Date.now()}`,
        fullName: hrContact || companyName,
        email: email.toLowerCase(),
        role: 'company',
        companyName,
        website,
        industry,
        isVerified: false,
        matchPassword: async (pwd) => pwd === password,
      };
      mockUserStore.push(user);
    }

    const token = generateToken(user._id || user.id, user.role);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      success: true,
      message: 'Employer organization registered successfully. Account pending admin verification.',
      token,
      user: {
        id: user._id || user.id,
        companyName: user.companyName,
        email: user.email,
        role: user.role,
        website: user.website,
        industry: user.industry,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Authenticate User (Student or Company) & Return JWT
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    let user;
    try {
      user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    } catch (e) {
      user = mockUserStore.find((u) => u.email === email.toLowerCase());
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password credentials.',
      });
    }

    // Verify Password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password credentials.',
      });
    }

    const token = generateToken(user._id || user.id, user.role);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: 'Login successful.',
      token,
      user: {
        id: user._id || user.id,
        fullName: user.fullName,
        companyName: user.companyName,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get Current Authenticated User Profile
 * @route   GET /api/auth/me
 * @access  Private (Protected)
 */
export const getCurrentUser = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Logout User & Clear Session Cookie
 * @route   POST /api/auth/logout
 * @access  Private
 */
export const logout = async (req, res, next) => {
  try {
    res.cookie('token', '', {
      httpOnly: true,
      expires: new Date(0),
    });

    res.status(200).json({
      success: true,
      message: 'Logged out successfully.',
    });
  } catch (error) {
    next(error);
  }
};
