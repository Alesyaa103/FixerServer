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
          user,
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
  async reset1(ctx) {
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
  async reset2(ctx) {
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
  async getPersonal(ctx) {
    ctx.body = 'Secret content';
  },
  async addUser(ctx) {
    const {
      firstname,
      lastname,
      email,
      username,
      password,
      title,
      mobile,
      location,
      company,
      stack,
      price,
      rating,
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
          email,
          username,
          password,
          title,
          mobile,
          location,
          company,
          stack,
          price,
          rating,
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
  async returnWorkers(ctx) {
    const workers = await User.find();
    try {
      ctx.body = {
        workers,
      };
      ctx.response.status = 200;
    } catch (err) {
      ctx.body = {
        err,
      };
    }
  },
  async updateUser(ctx) {
    console.log(ctx.request.body)
    const user = ctx.request.body;
    try {
      console.log(user);
      let userUpdate = await User.findById(user._id);
      userUpdate = user;
      await userUpdate.save();
      ctx.response.status = 200;
      ctx.body = {
        user
      }
    } catch (err) {
      console.log(err);
    }
  },
  

};
