# WZRD
WZRD is an out of the box solution for performing a [WOOT](http://en.wikipedia.org/wiki/Wizard_of_Oz_experiment) over SMS.
![McGavin Israel's WZRD Cover](http://24.media.tumblr.com/tumblr_m0663bGLZz1qlbfz4o1_r2_500.jpg)
## Setup
Go into `/config/constants.js` and add your twilio, mongo, & redis credentials. Also swap out default messages.

Then deploy to heroku with `heroku apps:create` and `git push heroku master`. It is also compatible with nodejitsu with `jitsu deploy`.
