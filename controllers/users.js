module.exports = function (app, config) {
  var m = app.get('models'),
      User = m.user,
      Message = m.message


  var UsersController = {
    /**
     * Lists all of the users.
     */
    index: function (req, res) {
      User.find({}, function (err, users) {
        if (err) {
          res.send('500 Error: ' + err);
        } else {
          res.render('users/index', {
            users: users
          });
        }
      });
    }

  /**
   * Creates a new user.
   */
  , create: function (req, res) {
      var u = new User({
        name: req.body.name,
        email: req.body.email,
        digits: '+'+req.body.digits
      });

      u.save(function (err, user) {
        if (err) {
          throw err;
        } else {
          app.get('twilio').sendSms({
            to: user.digits,
            from: config.twilio.number,
            body: config.wizard.welcomeMessage
          }, function (err, other) {
            console.log(err);
            res.redirect('/users/' + user.email);
          });
        }
      });
    }

  /**
   * Shows the chat between Anna & a specific user.
   */
  , show: function (req, res) {
      User.findOne({ email: req.params.email }, function (err, user) {
        if (err) throw err;
        if (user) {
          Message.find({ $or: [{from: user._id}, {to: user._id}] }).populate('from').exec(function (error, messages) {
            if (error) throw error;
            res.render('users/show', {
              title: 'Wizard vs ' + user.name,
              user: user,
              messages: messages
            });
          })
        } else {
          res.send('user does not exist');
        }
      });
    }

    /**
     * Renders form for creating a new user.
     */
  , new: function (req, res) {
      res.render('users/new', { title: 'New User' });
    }

  };

  return UsersController
}