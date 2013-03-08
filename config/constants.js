module.exports = {
  development: {
    db: {
      mongoUrl: "mongodb://localhost/annaDev",
      redisUrl: "http://localhost:6379"
    },
    twillio: {
      number: '+14084578863',
      key: 'AP1a71a9fa6b4fc96ef4e40a5d353cbc88',
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
      redisUrl: process.env.REDISTOGO_URL
    },
    twillio: {
      number: '+14084578863',
      key: 'AP1a71a9fa6b4fc96ef4e40a5d353cbc88',
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
    url: 'http://wzrd.nodejitsu.com'
  }
};