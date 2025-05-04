const jwt = require('jsonwebtoken');
// Middleware to verify JWT token
function verifyToken(req, res, next) {
  try {
      const authHeader = req.headers['authorization'];
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
          return res.status(401).json({ message: 'Token missing or invalid format' });
      }

      const token = authHeader.split(' ')[1];
      console.log('Token received:', token);  // Log the token to verify it's being received

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("✅ Decoded Token:", decoded);

      req.lecturerId = decoded.lecturerId; // ✅ IMPORTANT
      next();
  } catch (error) {
      console.error('Error verifying token:', error.message);
      res.status(401).json({ message: 'Invalid Token' });
  }
}

  module.exports = verifyToken;
