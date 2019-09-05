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
  // async addUser(ctx) {
  //   const {
  //     firstname,
  //     lastname,
  //     email,
  //     username,
  //     password,
  //     title,
  //     mobile,
  //     location,
  //     company,
  //     stack,
  //     price,
  //     rating,
  //   } = ctx.request.body;
  //   try {
  //     const Find = await User.find({
  //       email,
  //     });
  //     if (Find.length !== 0) {
  //       ctx.body = {
  //         err: 'Such person already exist',
  //       };
  //     } else {
  //       const newUser = new User({
  //         firstname,
  //         lastname,
  //         email,
  //         username,
  //         password,
  //         title,
  //         mobile,
  //         location,
  //         company,
  //         stack,
  //         price,
  //         rating,
  //       });
  //       await User.create(newUser);
  //       ctx.response.status = 200;
  //     }
  //   } catch (err) {
  //     ctx.response.status = 500;
  //     ctx.body = {
  //       err,
  //     };
  //   }
  // },
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
    const data = ctx.request.body;
    try {
      const userUpdate = await User.findById(data._id);
      userUpdate.firstname = data.firstname;
      userUpdate.lastname = data.lastname;
      userUpdate.email = data.email;
      userUpdate.username = data.username;
      userUpdate.title = data.title;
      userUpdate.location.country = data.location.country;
      userUpdate.location.city = data.location.city;
      userUpdate.company = data.company;
      userUpdate.stack = data.stack;
      userUpdate.price = data.price;
      userUpdate.rating = data.rating;
      userUpdate.mobile.code = data.mobile.code;
      userUpdate.mobile.number = data.mobile.number;
      await userUpdate.save();
      ctx.response.status = 200;
      ctx.body = {
        userUpdate,
      }
    } catch (err) {
      console.log(err);
    }
  },
  async deleteUser(ctx) {
    const {
      user,
    } = ctx.request.body;
    try {
      await User.findByIdAndDelete(user._id);
      ctx.response.status = 200;
    } catch (err) {
      ctx.body = {
        err,
      };
    }
  },

};
