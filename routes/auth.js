const KoaRouter = require('koa-router');
const passport = require('koa-passport');

const {
  signIn, signUp, getPersonal, reset1, reset2, addUser, returnWorkers, deleteUser, updateUser,
} = require('../controllers');

const router = new KoaRouter();

router.post('signIn', signIn);
router.post('signUp', signUp);
router.get('personal', passport.authenticate('jwt', { session: false }), getPersonal);
router.post('reset1', reset1);
router.post('reset2', reset2);
router.post('addUser', addUser);
router.get('returnWorkers', returnWorkers);
router.delete('deleteUser', deleteUser);
router.post('updateUser', updateUser);

module.exports = router;
