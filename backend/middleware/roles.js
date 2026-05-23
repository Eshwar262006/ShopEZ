const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') return next();
  res.status(403).json({ message: 'Access denied: Admins only' });
};

const seller = (req, res, next) => {
  if (req.user && (req.user.role === 'seller' || req.user.role === 'admin')) return next();
  res.status(403).json({ message: 'Access denied: Sellers only' });
};

module.exports = { admin, seller };
