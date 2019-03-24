const restify = require('restify');
const mongoose = require('mongoose');
const rjwt = require('restify-jwt-community');
const config = require('./config');
const customers = require('./routes/customers');
const users = require('./routes/users');
const sessions = require('./routes/sessions');

const server = restify.createServer();

// Middleware
server.use(restify.plugins.bodyParser());

// Protect Routes
server.use(rjwt({ secret: config.JWT_SECRET }).unless({ path: ['/login', '/users'] }));

server.listen(config.PORT, () => {
  mongoose.set('useFindAndModify', false);
  mongoose.connect(
    config.MONGODB_URI,
    { useNewUrlParser: true }
  );
});

const db = mongoose.connection;

db.on('error', console.log);

db.once('open', () => {
  server.post('/users', users.create);
  server.get('/users/:id', users.show);
  server.post('/login', sessions.create);

  console.log(`Server started on port ${config.PORT}`);
});
