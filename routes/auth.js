const KoaRouter = require('koa-router');
const passport = require('koa-passport');

const {
  signIn, signUp, reset1, reset2, returnWorkers, deleteUser, updateUser, user, userPhoto
} = require('../controllers');

const router = new KoaRouter();

router.post('signIn', signIn);
router.post('signUp', signUp);
router.post('reset1', reset1);
router.post('reset2', reset2);
router.post('user', passport.authenticate('jwt', { session: false }), user);
router.get('returnWorkers', passport.authenticate('jwt', { session: false }), returnWorkers);
router.delete('deleteUser', passport.authenticate('jwt', { session: false }), deleteUser);
router.put('updateUser', passport.authenticate('jwt', { session: false }), updateUser);
router.put('photo', passport.authenticate('jwt', { session: false }), userPhoto)

module.exports = router;
