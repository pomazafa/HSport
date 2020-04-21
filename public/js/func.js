const jwt = require('jsonwebtoken');
const {secret} = require('../../config/config.js')

module.exports = async (req, res, next) => {
  const token = req.cookies.token || '';
  try {
    if (!token) {
      return res.status(401).json('You need to Login')
    }
    const decrypt = await jwt.verify(token, secret);
    req.user = {
      id: decrypt.id,
    };
    console.log(req.user.id);
    next();
  } catch (err) {
    return res.status(500).json(err.toString());
  }
};