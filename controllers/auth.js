const User = require('../model/User');

exports.get = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ msg: 'user not found' });
  }
};
