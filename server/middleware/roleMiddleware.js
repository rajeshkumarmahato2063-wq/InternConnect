/**
 * Reusable Role Protection Middleware
 * @param  {...string} roles - Allowed roles (e.g. 'student', 'company', 'admin')
 */
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required before accessing this route.',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role (${req.user.role}) is not authorized to access this resource. Required: [${roles.join(', ')}]`,
      });
    }

    next();
  };
};
