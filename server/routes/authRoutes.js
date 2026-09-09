import express from 'express';
import { check, validationResult } from 'express-validator';
import {
  registerStudent,
  registerCompany,
  login,
  getCurrentUser,
  logout,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Helper middleware to validate express-validator results
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg,
      errors: errors.array(),
    });
  }
  next();
};

/**
 * @route   POST /api/auth/student/register
 * @desc    Student Candidate Registration
 * @access  Public
 */
router.post(
  '/student/register',
  [
    check('fullName', 'Full name is required').notEmpty(),
    check('email', 'Please provide a valid email address').isEmail(),
    check('phone', 'Phone number must be exactly 10 digits').matches(/^[0-9]{10}$/),
    check('password', 'Password must be at least 8 characters long').isLength({ min: 8 }),
    check('college', 'College or university name is required').notEmpty(),
    check('degree', 'Degree and major field is required').notEmpty(),
    check('graduationYear', 'Valid graduation year is required').isNumeric(),
  ],
  validate,
  registerStudent
);

/**
 * @route   POST /api/auth/company/register
 * @desc    Employer / Company Registration
 * @access  Public
 */
router.post(
  '/company/register',
  [
    check('companyName', 'Company name is required').notEmpty(),
    check('email', 'Please provide a valid official corporate email').isEmail(),
    check('website', 'Please enter a valid website URL (e.g. https://company.com)').isURL(),
    check('industry', 'Industry sector is required').notEmpty(),
    check('location', 'Headquarters location is required').notEmpty(),
    check('hrContact', 'HR contact name is required').notEmpty(),
    check('password', 'Password must be at least 8 characters long').isLength({ min: 8 }),
  ],
  validate,
  registerCompany
);

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate Student or Company & Return JWT Token
 * @access  Public
 */
router.post(
  '/login',
  [
    check('email', 'Valid email address is required').isEmail(),
    check('password', 'Password is required').notEmpty(),
  ],
  validate,
  login
);

/**
 * @route   GET /api/auth/me
 * @desc    Get Current Authenticated User Profile
 * @access  Private (Protected by JWT)
 */
router.get('/me', protect, getCurrentUser);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout User & Clear Session Cookie
 * @access  Private
 */
router.post('/logout', protect, logout);

export default router;
