import jwt from 'jsonwebtoken';

/**
 * Generate 7-Day Expiration JWT Token
 * @param {string} userId - Mongo User _id
 * @param {string} role - User Role ('student', 'company', 'admin')
 * @returns {string} Signed JWT Token
 */
export const generateToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET || 'internconnect_ai_super_secure_jwt_secret_key_2026',
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    }
  );
};
