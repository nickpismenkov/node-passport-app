const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/db');

router.get('/reg', (req, res) => {
  res.send('Registration Page');
});

router.post('/reg', (req, res) => {
  const { name, email, login, password } = req.body;

  const newUser = new User({ name, email, login, password });

  User.addUser(newUser, (err, user) => {
    if (err) res.json({ success: false, msg: 'User has not been added' });
    else res.json({ success: false, msg: 'User has been added' })
  });
});

router.post('/auth', (req, res) => {
  const { login, password } = req.body;
  
  User.getUserByLogin(login, (err, user) => {
    if (err) throw err;
    if (!user) return res.json({ success: false, msg: 'User is not found' });

    User.comparePass(password, user.password, (err, isMatch) => {
      if (err) throw err;
      if (isMatch) {
        const token = jwt.sign(user, config.secret, { expiresIn: 3600 * 24 * 14 });

        const { _id, name, login, email } = user;
        return res.json({success: true, token: `JWT ${token}`, user: {
          id: _id,
          name,
          login,
          email
        }});
      } else {
        return res.json({ success: false, msg: 'Wrong password' });
      }
    });
  });
});

router.get('/dashboard', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.send('User Page');
});

module.exports = router;