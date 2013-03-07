module.exports = {
  development: {
    db: {
      mongoUrl: "mongodb://localhost/annaDev",
      redisUrl: "http://localhost:6379"
    },
    twillio: {
      number: '+14084578863',
      key: 'AC2dd686b98668c9c8a2893ccc52e61d74',
      secret: '37a46faa9fef4a03d9c1a1babe57b733'
    },
    auth: {
      username: 'anna',
      password: 'jenkins'
    },
    wizard: {
      name: 'Anna Jenkins',
      email: 'hi@anna.ai',
      welcomeMessage: 'Hey Girl! I\'m Anna, your personal assistant. Let me know if you need me to book any appointments or setup meetings.'
    },
    url: 'http://0.0.0.0:3333'
  },
  production: {
    db: {
      mongoUrl: process.env.MONGOHQ_URL,
      redisUrl: process.env.REDISCLOUD_URL
    },
    twillio: {
      number: '+14084578863',
      key: 'AC2dd686b98668c9c8a2893ccc52e61d74',
      secret: '37a46faa9fef4a03d9c1a1babe57b733'
    },
    auth: {
      username: 'anna',
      password: 'jenkins'
    },
    url: 'http://anna-chat.herokuapp.com'
  }
};