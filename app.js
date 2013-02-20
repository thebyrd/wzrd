var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    twilio = require('twilio'),
    client = twilio('AC2dd686b98668c9c8a2893ccc52e61d74', '37a46faa9fef4a03d9c1a1babe57b733'),
    mongoose = require('mongoose');

app.configure(function(){
  io.configure(function () { 
    io.set("transports", ["xhr-polling"]); 
    io.set("polling duration", 10); 
  });
  app.set('port', process.env.PORT || 3001);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  mongoose.connect(process.env.MONGOHQ_URL || 'mongodb://localhost/annaChatDev');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.basicAuth('anna', 'jenkins'));
  app.use(require('less-middleware')({ src: __dirname + '/public' }));
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});


/**
 * Define the Message Model
 */
var Message = mongoose.model('Message', new mongoose.Schema({
  from: {
    type: mongoose.Schema.Types.Oid,
    ref: 'User'
  },
  to: {
    type: mongoose.Schema.Types.Oid, 
    ref: 'User'
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  body: {
    type: String,
    required: true
  }
}));

/**
 * Define the User Model
 */
var User = mongoose.model('User', new mongoose.Schema ({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  digits: {
    type: String,
    required: true
  }
}));


var anna = new User({
  name: 'Anna Jenkins',
  email: 'hello@anna.ai',
  digits: '+14085123133'
});
anna.save(function (err, anna) {
  if (err) throw err;
});

app.get('/secret/:email', function (req, res) {
  User.findOne({ email: req.params.email }, function (err, user) {
    if (err) throw err;
    if (user) {
      Message.find({ $or: [{from: user._id}, {to: user._id}] }).populate('from').exec(function (error, messages) {
        if (error) throw error;
        res.render('index', {
          title: 'Anna',
          user: user,
          messages: messages
        });
      })
    } else {
      res.send('user does not exist');
    }
  });
});


app.get('/', function (req, res) {
  res.render('users/new');
});


app.post('/users', function (req, res) {
  var u = new User({
    name: req.body.name,
    email: req.body.email,
    digits: '+'+req.body.digits
  });

  u.save(function (err, user) {
    if (err) throw err;
    else res.redirect('/thanks!?number='+user.digits);
  });
});

app.get('/users', function (req, res) {
  User.find({}, function (err, users) {
    res.json(users);
  });
});

app.get('/thanks!', function (req, res) {
  var number = req.query.number;
  client.sendSms({
    to: number,
    from: '+14085123133',
    body: 'Hey Girl! I\'m Anna, your personal assistant. Let me know if you need me to book any appointments or setup meetings.'
  }, function (err, other) {
    console.log(err);
    res.send('Thanks for signing up! Anna will be in touch with you soon.');
  });
});


/**
 * Handle incoming text from Twilio
 */
app.post('/sms', function (req, res) {

  User.findOne({ digits:req.body.From }, function (err, user) {
    if (err) throw err;

    var m = new Message({
      from: user._id,
      to: anna._id,
      body: req.body.Body
    });

    m.save(function (err, msg) {
      io.sockets.emit('newMessage', {
        user: user.name,
        number: user.digits,
        body: req.body.Body
      });
    });

  });

  res.end();
});

server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

io.sockets.on('connection', function (socket) {
  socket.on('sendMessage', function (data, callback) {

    User.findOne({ email: data.email }, function (err, user) {

      var m = new Message({
        from: anna._id,
        to: user._id,
        body: data.body
      });

      m.save(function (err, msg) {

        client.sendSms({
          to: user.digits,
          from: '+14085123133',
          body: data.body
        }, function (err, res) {
          if (err) throw err;
          else return callback(data);
        });

      })
    });

  });
});
