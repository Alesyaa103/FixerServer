const KoaRouter = require('koa-router');
const passport = require('koa-passport');

const {
  signIn, signUp, reset1, reset2, returnWorkers, deleteUser, updateUser, returnUser,
} = require('../controllers');

const router = new KoaRouter();

router.post('signIn', signIn);
router.post('signUp', signUp);
router.post('reset1', reset1);
router.post('reset2', reset2);
router.get('returnUser', returnUser)
router.get('returnWorkers', returnWorkers);
router.delete('deleteUser', deleteUser);
router.put('updateUser', updateUser);

module.exports = router;
