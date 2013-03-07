/**
 * Defines the Message Model
 */
module.exports = function (app, config) {

  var db = app.get('db'),
      Schema = db.Schema,
      Oid = Schema.Types.Oid;

  var MessageSchema = new Schema({
    from: {
      type: Oid,
      ref: 'User'
    },
    to: {
      type: Oid, 
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
  })

  return db.model('Message', MessageSchema);

}