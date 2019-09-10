const config = require('config');
const User = require('../models/User');
const uploadS3 = require('../utils/uploadS3');

module.exports = {
  async returnSortedWorkers(ctx) {
    const { param } = ctx.query;
    if (param !== 'by price' || param !== 'by rating') {
      ctx.response.status = 404;
      ctx.body = {
        error: 'Only price and rating params are available',
      };
    }
    const rating = await User.find().sort({ rating: -1 });
    console.log(rating);
    try {
      if (param === 'by price') {
        const price = await User.find().sort({ price: 1 });
        ctx.response.status = 200;
        ctx.body = {
          workers: price,
        };
      }
      if (param === 'by rating') {
        const rating = await User.find().sort({ rating: -1 });
        ctx.response.status = 200;
        ctx.body = {
          workers: rating,
        };
      }
    } catch (err) {
      ctx.body = {
        err,
      };
      console.log(err);
    }
  },
  async updateUser(ctx) {
    const data = ctx.request.body;
    try {
      const user = await User.findByIdAndUpdate(ctx.state.user._id, data);
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
          isAdmin: user.isAdmin,
        },
      };
      ctx.response.status = 200;
    } catch (err) {
      ctx.response.status = 500;
      ctx.body = {
        err,
      };
    }
  },
  async deleteUser(ctx) {
    try {
      const data = ctx.request.body;
      const Find = await User.findOne({email: data.email});
      await User.findByIdAndDelete(Find._id);
      ctx.response.status = 200;
    } catch (err) {
      ctx.response.status = 500;
      ctx.body = {
        err,
      };
    }
  },
  async returnUser(ctx) {
    try {
      const user = await User.findById(ctx.state.user._id);
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
          isAdmin: user.isAdmin,
        },
      };
      ctx.response.status = 200;
    } catch (err) {
      ctx.response.status = 500;
      ctx.body = {
        err: 'server error',
      };
    }
  },
  async updatePhoto(ctx) {
    try {
      const photo = await uploadS3(config.get('aws').userPhoto, ctx.request.files.photo);
      await User.findByIdAndUpdate(ctx.state.user._id, { photo });
      ctx.response.status = 200;
      ctx.body = {
        photo,
      };
    } catch (err) {
      ctx.body = {
        err,
      };
    }
  },
};
