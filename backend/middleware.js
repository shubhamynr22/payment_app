const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer')) {
    return res.status(403).json({
      message: 'Invalid headers'
    });
  }
  const jwtToken = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(jwtToken, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    console.log(`Error in jwt : ${err}`);
    return res.status(403).json({ message: 'Invalid user' });
  }
};

module.exports = { authMiddleware };
