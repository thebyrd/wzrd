module.exports = function (app) {
  return {
    '/': {
      'get': 'users.index'
    },
    '/users': {
      'get': 'users.index',
      'post': 'users.create'
    },
    '/users/:email': {
      'get': 'users.show'
    },
    '/users/new': {
      'get': 'users.new'
    },
    '/sms': {
      'post': 'sms.receive'
    }
  };
};