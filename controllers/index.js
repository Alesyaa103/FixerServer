const passport = require('koa-passport');
const config = require('config');
const jwt = require('jwt-simple'); // аутентификация по JWT для hhtp
const User = require('../models/User');

module.exports = {
  async signIn(ctx, next) {
    await passport.authenticate('local', (err, user) => {
      if (user) {
        const payload = {
          id: user._id,
        };
        ctx.body = {
          token: jwt.encode(payload, config.get('jwtSecret')),
        };
      } else {
        console.log(err);
      }
    })(ctx, next);
  },
  async signUp(ctx) {
    const {
      firstname,
      lastname,
      email,
      username,
      password,
    } = ctx.request.body;
    try {
      const Find = await User.find({
        email,
      });
      if (Find.length !== 0) {
        ctx.body = {
          msg: 'same person already exist',
        };
      } else {
        const newUser = new User({
          firstname,
          lastname,
          username,
          email,
          password,
        });
        const res = await User.create(newUser);
        ctx.response.status = 200;
      }
    } catch (err) {
      throw err;
    }
  },
  async reset1(ctx, next) {
    const {
      email,
    } = ctx.request.body;
    try {
      const Find = await User.find({
        email,
      });
      if (Find.length === 0) {
        console.log('there is no such person');
      } else {
        ctx.response.status = 200;
      }
    } catch (err) {
      throw err;
    }
  },
  async reset2(ctx, next) {
    const {
      email,
      password,
    } = ctx.request.body;
    try {
      const Find = await User.find({
        email,
      });
      console.log(Find);
      user = Find[0];
      user.password = password;
      await user.save();
      ctx.response.status = 200;
    } catch (err) {
      throw err;
    }
  },
  async getPersonal(ctx) {
    ctx.body = 'Secret content';
  },

};
