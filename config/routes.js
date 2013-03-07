module.exports = function (app) {
  return {
    '/': {
      'get': 'users.index'
    },
    '/users': {
      'get': 'users.index',
      'post': 'users.create'
    },
    '/users/new': {
      'get': 'users.new'
    },
    '/users/:email': {
      'get': 'users.show'
    },
    '/sms': {
      'post': 'sms.receive'
    }
  };
};