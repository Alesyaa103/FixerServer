const mongoose = require('mongoose');
const config = require('config');
const crypto = require('crypto');

const User = mongoose.Schema;
const UserSchema = new User({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    validate: {
      validator: function checkEmail(value) {
        const re = /^(\S+)@([a-z0-9-]+)(\.)([a-z]{2,4})(\.?)([a-z]{0,4})+$/;
        return re.test(value);
      },
      err: props => `${props.value} is not a valid email.`,
    },
  },
  photo: {
    type: String,
    default: config.get('defaultUserPhoto'),
  },
  title: {
    type: String,
  },
  mobile: {
    code: {
      type: Number,
    },
    number: {
      type: Number,
    },
  },
  location: {
    country: {
      type: String,
    },
    city: {
      type: String,
    },
  },
  company: {
    type: String,
  },
  stack: {
    type: String,
  },
  price: {
    type: Number,
  },
  rating: {
    type: Number,
  },
  isAdmin: false,
  token: String,
  passwordHash: String,
  salt: String,
}, {
  timestamps: true,
});
UserSchema.virtual('password')
  .set(function (password) {
    if (!password) {
      this.invalidate('password', 'Password can\'t be empty!');
    }

    if (password !== undefined) {
      if (password.length < 6) {
        this.invalidate('password', 'Password can\'t be less than 6 symbols!');
      }
    }

    this._plainPassword = password;

    if (password) {
      this.salt = crypto.randomBytes(config.get('crypto').hash.length).toString('base64');
      this.passwordHash = crypto.pbkdf2Sync(
        password,
        this.salt,
        config.get('crypto').hash.iterations,
        config.get('crypto').hash.length,
        'sha512',
      ).toString('base64');
    } else {
      this.salt = undefined;
      this.passwordHash = undefined;
    }
  })

  .get(function () {
    return this._plainPassword;
  });

UserSchema.methods.checkPassword = function (password) {
  if (!password) return false;
  if (!this.passwordHash) return false;
  return crypto.pbkdf2Sync(
    password,
    this.salt,
    config.get('crypto').hash.iterations,
    config.get('crypto').hash.length,
    'sha512',
  ).toString('base64') === this.passwordHash;
};

module.exports = mongoose.model('User', UserSchema);
