
const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  // debug logs (chaaho to baad me hata sakte ho)
  console.log('AUTH HEADERS:', req.headers);
  console.log('AUTH HEADER VALUE:', authHeader);

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
    req.user = decoded;
    next();
  } catch (err) {
    console.error('JWT verify error:', err);
    return res.status(401).json({ error: 'Invalid token' });
  }
}

module.exports = authMiddleware;
