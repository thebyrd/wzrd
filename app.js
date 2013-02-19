var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var twilio = require('twilio');
var client = require('twilio')('ACb6a7631dfbba4712b32319a03aa270d7', '6a710ad22d178a7670405f07f71cc632');

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(require('less-middleware')({ src: __dirname + '/public' }));
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

var routes = require('./routes');
app.get('/', routes.index);
app.post('/sms', function (req, res) {
  console.log(req);
  io.sockets.emit('newMessage', {
    user: 'user',
    number: 'test',
    body: 'test'
  });

  res.end();
});

server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

io.sockets.on('connection', function (socket) {
  socket.on('sendMessage', function (data, callback) {
    client.sendSms({
      to: '+17814924545',
      from: '+16466062561',
      body: data.body
    }, function (err, res) {
      if (!err)
        return callback(data);
    });
  });
});
