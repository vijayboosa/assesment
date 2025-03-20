// middlewares/authMiddleware.js
import jwt from 'jsonwebtoken';
import config from '../config/config.js';

const verifyJWT = (req, res, next) => {
  // Retrieve the token from cookies
  const token = req.cookies.token;
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided.' });
  }

  jwt.verify(token, config.jwtSecret, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Failed to authenticate token.' });
    }
    req.userId = decoded.id;
    req.userRole = decoded.role; 
    next();
  });
};

export default verifyJWT;
