const Koa = require('koa');
const KoaRouter = require('koa-router');
const logger = require('koa-logger');
const bodyParser = require('koa-bodyparser');
const cors = require('koa2-cors');
const passport = require('./libs/passport/index');
const serve = require('koa-static');
const koaSwagger = require('koa2-swagger-ui');

require('./libs/mongoose');

passport.initialize();

const app = new Koa();
const router = new KoaRouter();
app.use(cors({
  origin() {
    return '*';
  },
}));

app.use(serve('docs'))
app.use(logger());
app.use(bodyParser());

app.use(passport.initialize());

app.use(
  koaSwagger({
    routePrefix: '/docs',
    hideTopbar: true,
    swaggerOptions: {
      url: 'http://localhost:7070/docs.yml',
    },
  }),
);

const routes = require('./routes').routes();
router.use('/api', routes);
app.use(router.routes())
  .use(router.allowedMethods());

const PORT = process.env.PORT || 7070;
app.listen(PORT);
