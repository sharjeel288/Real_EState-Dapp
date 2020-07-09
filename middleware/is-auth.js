const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.header('x-auth-token');

  if (!token) {
    return res.status(401).json({ msg: 'No token!,Autherization failed' });
  }

  try {
    const decodedToken = jwt.verify(token, 'hg123214ie2190kad][=-_))9+#@');
    req.userId = decodedToken.user.id;
    next();
  } catch (error) {
    res.status(401).json({ msg: 'token is invalid' });
  }
};
