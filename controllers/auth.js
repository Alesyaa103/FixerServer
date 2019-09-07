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
          user: {
            email: user.email,
          },
        };
      } else {
        ctx.body = {
          err,
        };
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
          err: 'Such person already exist',
        };
      } else {
        const newUser = new User({
          firstname,
          lastname,
          username,
          email,
          password,
        });
        await User.create(newUser);
        ctx.response.status = 200;
      }
    } catch (err) {
      ctx.response.status = 500;
      ctx.body = {
        err,
      };
    }
  },
  async checkEmail(ctx) {
    const {
      email,
    } = ctx.request.body;
    try {
      const Find = await User.find({
        email,
      });
      if (Find.length === 0) {
        ctx.body = {
          err: "Such person doesn't exist!",
        };
      } else {
        ctx.response.status = 200;
      }
    } catch (err) {
      ctx.body = {
        err,
      };
    }
  },
  async resetPass(ctx) {
    const {
      email,
      password,
    } = ctx.request.body;
    try {
      const Find = await User.find({
        email,
      });
      const user = Find[0];
      user.password = password;
      await user.save();
      ctx.response.status = 200;
    } catch (err) {
      ctx.body = {
        err,
      };
    }
  },
}  