const KoaRouter = require('koa-router');
const passport = require('koa-passport');

const {
  signIn, signUp, checkEmail, resetPass,
} = require('./controllers/auth');
const {
  returnSortedWorkers, deleteUser, updateUser, returnUser, updatePhoto,
} = require('./controllers/personal');

const router = new KoaRouter();

router.post('/sign-in', signIn);
router.post('/sign-up', signUp);
router.post('/check-email', checkEmail);
router.post('/reset-pass', resetPass);
router.get('/', passport.authenticate('jwt', { session: false }), returnUser);
router.get('/workers', passport.authenticate('jwt', { session: false }), returnSortedWorkers);
router.delete('/remove-user', passport.authenticate('jwt', { session: false }), deleteUser);
router.put('/update-user', passport.authenticate('jwt', { session: false }), updateUser);
router.put('/photo', passport.authenticate('jwt', { session: false }), updatePhoto);

module.exports = router;
