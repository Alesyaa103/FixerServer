require('dotenv').config();
const Koa = require('koa');
const KoaRouter = require('koa-router');
const logger = require('koa-logger');
const bodyParser = require('koa-bodyparser');
const cors = require('koa2-cors');
const passport = require('./libs/passport/index');
require('./libs/mongoose');

passport.initialize();

const app = new Koa();
const router = new KoaRouter();
app.use(cors({
  origin() {
    return '*';
  },
}));

app.use(async (ctx, next) => {
  try {
    console.log('Request', ctx.request);
    await next();
  } catch (err) {
    console.log('Global error: ', err);
    ctx.status = 500;
    ctx.body = {
      error: true,
    };
  }
});
app.use(logger());
app.use(bodyParser());

app.use(passport.initialize());

const routes = require('./routes').routes();

router.use('/api/', routes);
app.use(router.routes())
  .use(router.allowedMethods());


const PORT = process.env.PORT || 7070;
app.listen(PORT, (error) => {
  if (error) console.log('error');
  else console.log(`server on port ${PORT}`);
});