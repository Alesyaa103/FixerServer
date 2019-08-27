const mongoose = require('mongoose');
const config = require('config');
const crypto = require('crypto');
// const beautifyUnique = require('mongoose-beautiful-unique-validation');

const User = mongoose.Schema;
const UserSchema = new User({
  firstname: String,
  lastname: String,
  username: {
    type: String,
    // unique: 'Two users cannot share the same username ({VALUE})',
    required: 'add username',
  },
  email: {
    type: String,
    // unique: 'Two users cannot share the same email ({VALUE})',
    required: 'add e-mail',
    validate: {
      validator: function checkEmail(value) {
        const re = /^(\S+)@([a-z0-9-]+)(\.)([a-z]{2,4})(\.?)([a-z]{0,4})+$/;
        return re.test(value);
      },
      message: props => `${props.value} is not a valid email.`,
    },
  },
  photo: {
    type: String,
    default: config.get('defaultUserPhoto'),
  },
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
