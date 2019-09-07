const passport = require('koa-passport');
const config = require('config');
const jwt = require('jwt-simple'); // аутентификация по JWT для hhtp
const User = require('../models/User');
const uploadS3 = require('../utils/uploadS3');

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
  async returnWorkers(ctx) {
    try {
      const workers = await User.find();
      //const workers = payload.sort(dynamicSortMultiple.apply(null, User.rating));
      ctx.body = {
        workers,
      };
      ctx.response.status = 200;
    } catch (err) {
        console.log(err);
    }
  },
  async updateUser(ctx) {
    const data = ctx.request.body;
    try {
      const user = await User.findByIdAndUpdate(data._id);
      ctx.response.status = 200;
      ctx.body = {
        user: {
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          username: user.username,
          title: user.title,
          location: {
            country: user.location.country,
            city: user.location.city,
          },
          company: user.company,
          stack: user.stack,
          price: user.price,
          rating: user.rating,
          mobile: {
            code: user.mobile.code,
            number: user.mobile.number,
          },
        },
      };
    } catch (err) {
      ctx.body = {
        err,
      }
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
  async user(ctx) {
    const data = ctx.request.body;
    try {
      const user = await User.findOne({ email: data.email });
      ctx.body = {
        user: {
          firstname: user.firstname,
          photo: user.photo,
          lastname: user.lastname,
          email: user.email,
          username: user.username,
          title: user.title,
          location: {
            country: user.location.country,
            city: user.location.city,
          },
          company: user.company,
          stack: user.stack,
          price: user.price,
          rating: user.rating,
          mobile: {
            code: user.mobile.code,
            number: user.mobile.number,
          },
        },
      };
      ctx.response.status = 200;
    } catch (err) {
      ctx.body = {
        err,
      };
    }
  },
  async userPhoto(ctx) {
    
    console.log(ctx.request.files);
    // const photo = await uploadS3(config.get('aws').userPhoto, ctx.request.files.photo)
    // console.log(photo);
    ctx.response.status = 200;
    ctx.body = {
      sraka: ctx.request.files,
    }
  }
};
