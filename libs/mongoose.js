const config = require('config');
const mongoose = require('mongoose'); // стандартная прослойка для работы с MongoDB

mongoose.Promise = Promise; // Просим Mongoose использовать стандартные Промисы
mongoose.set('debug', true); // Просим Mongoose писать все запросы к базе в консоль
 mongoose.connect( config.get('databaseUrl'),
 { useNewUrlParser: true, useFindAndModify:  false, useCreateIndex: true },
(err) => { if (err) throw new Error('Connected with db is faild'); console.log('connected'); });

module.exports = mongoose;