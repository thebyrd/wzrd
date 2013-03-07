//       _                                           _   
//      / \                                         (_)  
//     / _ \     _ .--.   _ .--.   ,--.      ,--.   __   
//    / ___ \   [ `.-. | [ `.-. | `'_\ :    `'_\ : [  |  
//  _/ /   \ \_  | | | |  | | | | // | |, _ // | |, | |  
// |____| |____|[___||__][___||__]\'-;__/(_)\'-;__/[___] 

var express = require('express'),
    http = require('http'),
    mongoose = require('mongoose'),
    RedisStore = require('connect-redis')(express),
    fs = require("fs"),
    app = express(),
    url = require('url'),
    config = require('./config/constants')[app.get('env')],
    socket = require('socket.io'),
    server = http.createServer(app),
    io = socket.listen(server),
    twilio = require('twilio'),
    twilioClient = twilio(config.twillio.key, config.twillio.secret);
    

app.configure(function () {
  app.set('port', process.env.PORT || 3333);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'dust');
  mongoose.connect(config.db.mongoUrl);
  app.set('db', mongoose);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.set('twilio', twilioClient);
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser("wizardofoz"));

  
  var redisUrl = url.parse(config.db.redisUrl);
  var client = require('redis').createClient();
  
  if (redisUrl.auth) client.auth(redisUrl.auth.split(":")[1]);
 
  app.use(express.session({
    secret: "redisismyonetruelove",
    store: new RedisStore({
      host: redisUrl.host,
      port: redisUrl.port,
      client: client
    })
  }));

  app.use(app.router);
  app.use(express.basicAuth(config.auth.username, config.auth.password));
  app.use(express.compress());
  app.use(express.static(__dirname + '/public'));
  app.set('io', io);

});

app.configure('development', function(){
  app.use(express.errorHandler());
});

var models = {}, controllers = {};

// Load Models.
fs.readdirSync('./models').forEach(function (file) {
  models[file.slice(0, -3)] = require('./models/' + file)(app, config);
});

// Set models to app before passing app to controllers.
app.set('models', models);

// Load Controllers.
fs.readdirSync('./controllers').forEach(function (file) {
  controllers[file.slice(0, -3)] = require('./controllers/' + file)(app, config);
});

// Load Routes.
var routes = require('./config/routes')(app);

for (var route in routes) {
  for (var method in routes[route]) {
    var m = routes[route][method].split('.');

    // If a route has a filter...
    if (routes[route][method].indexOf('!') !== -1) {
      var b = routes[route][method].split('!');
      m[0] = m[0].split('!')[1];
      app[method](route, controllers[m[0]][b[0]], controllers[m[0]][m[1]]);
    // Otherwise...
    } else {
      app[method](route, controllers[m[0]][m[1]]);
    }
  }
}

server.listen(app.get('port'), function(){
  console.log('The Wizard of Oz is serving requests on port ' + app.get('port'));
});
