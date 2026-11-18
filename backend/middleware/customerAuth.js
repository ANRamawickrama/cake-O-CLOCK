const jwt = require('jsonwebtoken');
const Customer = require('../models/Customer');

const readToken = (req) => {
  const authHeader = req.headers.authorization || '';
  const [, token] = authHeader.split(' ');
  return token || null;
};

/**
 * Resolves the signed-in customer from the bearer token.
 * Returns null when the token is missing, expired or belongs to another role.
 */
const resolveCustomer = async (req) => {
  const token = readToken(req);
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'customer') return null;
    return await Customer.findById(decoded.id);
  } catch (err) {
    return null;
  }
};

// Guard for routes that require a customer session.
const customerAuth = async (req, res, next) => {
  const customer = await resolveCustomer(req);

  if (!customer) {
    return res.status(401).json({ message: 'Please sign in to continue' });
  }

  req.customer = customer;
  next();
};

// Guard for public routes that behave differently for signed-in customers.
const optionalCustomerAuth = async (req, res, next) => {
  req.customer = await resolveCustomer(req);
  next();
};

module.exports = { customerAuth, optionalCustomerAuth };
