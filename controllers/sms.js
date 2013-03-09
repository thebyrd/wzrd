module.exports = function (app, config) {
  var m = app.get('models'),
      User = m.user,
      Message = m.message,
      wizard = {},
      io = app.get('io')



  // Make sure Wizard Exists

  User.findOne({ name: config.wizard.name }, function (err, w) {
    if (err) throw err;

    if (w && w != {}) {
      wizard = w;
    } else {
      var w = new User({
        name: config.wizard.name,
        email: config.wizard.email,
        digits: config.twilio.number
      });
      w.save(function (err) {
        if (err) throw err;
        wizard = w;
      })
    }
  });




  io.sockets.on('connection', function (socket) {
    socket.on('sendMessage', function (data, callback) {

      User.findOne({ email: data.email }, function (err, user) {

        var m = new Message({
          from: wizard._id,
          to: user._id,
          body: data.body
        });

        m.save(function (err, msg) {

          app.get('twilio').sendSms({
            to: user.digits,
            from: config.twilio.number,
            body: data.body
          }, function (err, res) {
            if (err) {
              console.log(JSON.stringify(err));
              throw err;
            } else return callback(data);
          });

        })
      });

    });
  });



  var SmsController = {
    /**
     * Receive Message from Twillio
     */
    receive: function (req, res) {
      User.findOne({ digits:req.body.From }, function (err, user) {
        if (err) throw err;
        if (user) {
          var m = new Message({
            from: user._id,
            to: wizard._id,
            body: req.body.Body
          });

          m.save(function (err, msg) {
            io.sockets.emit('newMessage', {
              user: user.name,
              number: user.digits,
              body: req.body.Body
            });
          });
        } else {
          app.get('twilio').sendSms({
            to: rea.body.From,
            from: config.twilio.number,
            body: 'Hey, It\'s Anna, I\'m a little busy right now trying to handle Kim Pham\'s shit. I\'ll text you later. xoxo'
          })
        }

      });

      res.end();
    }

  };



  return SmsController
}