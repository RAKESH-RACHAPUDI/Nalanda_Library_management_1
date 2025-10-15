const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const getUserFromToken = async (token) => {
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    return user;
  } catch (err) {
    return null;
  }
};

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    req.user = await getUserFromToken(token);
  }
  next();
};

module.exports = { getUserFromToken, authMiddleware };
