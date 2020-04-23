const jwt = require('jsonwebtoken');
const {secret} = require('../../config/config.js')

module.exports = async (req, res) => {
  const token = req.cookies.token || '';
  try {
    if (!token) {
      return null;
    }
    const decrypt = await jwt.verify(token, secret);
    req.user = {
      id: decrypt.id,
    };
    //console.log(req.user.id);
    return req.user;
  } catch (err) {
    return null;
  }
};