/**
 * Define the User Model
 */
module.exports = function (app, config) {

  var db = app.get('db'),
      Schema = db.Schema,
      Oid = Schema.Types.Oid;

  var UserSchema = new Schema ({
    name: {
      type: String,
      required: true,
      unique: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    digits: {
      type: String,
      required: true,
      unique: true
    }
  });

  return db.model('User', UserSchema);

}