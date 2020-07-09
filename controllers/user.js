const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../model/User');

exports.postRegisterUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const error = validationResult(req);

    if (!error.isEmpty()) {
      return res.status(400).json({ errors: error.array() });
    }
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res
        .status(400)
        .json({ errors: [{ msg: 'Email Already exists !' }] });
    }

    const salt = await bcrypt.genSalt(12);

    const hashPw = await bcrypt.hash(password, salt);

    const user = new User({
      name,
      email,
      password: hashPw,
    });

    await user.save();

    res.json(user);
  } catch (error) {
    console.log(error.messages);
    res.status(500).send('Server error');
  }
};

exports.postLoginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const userEmail = await User.findOne({ email });
    if (!userEmail) {
      return res.status(400).json({ errors: [{ msg: 'Email not Found !!' }] });
    }

    const userPassword = await bcrypt.compare(password, userEmail.password);
    if (!userPassword) {
      return res
        .status(400)
        .json({ errors: [{ msg: 'Password is incorrect !!' }] });
    }
    const payload = {
      user: {
        id: userEmail._id,
      },
    };

    jwt.sign(
      payload,
      'hg123214ie2190kad][=-_))9+#@',
      {
        expiresIn: '3h',
      },
      (err, token) => {
        if (err) {
          throw err;
        }
        res.json({ token });
      }
    );
  } catch (error) {
    console.log(error.messages);
    res.status(500).send('Server error');
  }
};
