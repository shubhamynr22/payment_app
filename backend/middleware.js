const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddlware = (req, res, next) => {
  const authHeader = req.header.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer')) {
  }
};
