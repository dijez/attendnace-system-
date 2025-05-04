const jwt = require('jsonwebtoken');
// Middleware to verify JWT token
function verifyToken(req, res, next) {
    try {
      const authHeader = req.headers['authorization'];
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Token missing or invalid format' });
      }
  
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      console.log("Decoded token:", decoded);

      // req.student = decoded; // Attach student info to the request
      req.studentId = decoded.studentId;
      next();
    } catch (error) {
      console.error('Error verifying token:', error.message);
      res.status(401).json({ message: 'Invalid Token' });
    }
  }
  
 module.exports = verifyToken;
  
  