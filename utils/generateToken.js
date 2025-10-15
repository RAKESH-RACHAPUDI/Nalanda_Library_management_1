const jwt = require('jsonwebtoken');

const generateToken = (id, role) => {
  return jwt.sign(
    { userId: id, role }, // 
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

module.exports = generateToken;
