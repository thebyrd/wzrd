# WZRD
WZRD is an out of the box solution for performing a [WOOT](http://en.wikipedia.org/wiki/Wizard_of_Oz_experiment) over SMS.

## Setup
Go into `/config/constants.js` and add your twillio, mongo, & redis credentials. Also swap out default messages.

Then deploy to heroku with `heroku apps:create` and `git push heroku master`.

## TODO
1. Create a seeds file that will create anna if she does not exist
2. Put Socket.io in the controllers
3. Put everything in the configs file