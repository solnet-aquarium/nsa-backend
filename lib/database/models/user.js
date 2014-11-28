(function() {
  'use-strict';

  /**
  *
  *
  */

  var mongoose = require('mongoose')
  var hat = require('hat')
  var Schema = mongoose.Schema

  var rack = hat.rack()

  var UserSchema = new Schema({
    name: {
      first: { type: String, default: '' },
      last: { type: String, default: '' }
      },
    token: { type: String, default: '', index: true }

  })

  UserSchema.virtual('name.full').get(function() {
    return this.name.first + ' ' + this.name.last
  })

  UserSchema.path('name.first').validate(function(first) {
    return first.length
  }, 'First name cannot be blank')

  UserSchema.methods = {

    /**
    * retreive new token
    *
    * @return {string}
    */
    createToken: function() {
      return rack()
    }

  }

  UserSchema.statics = {

    /**
     * Load
     *
     * @param {Object} options
     * @param {Function} cb
     * @api private
     */

    load: function(options, cb) {
      options.select = options.select || 'name.first name.last token';
      this.findOne(options.criteria)
        .select(options.select)
        .exec(cb);
    }
  }

  mongoose.model('User', UserSchema);

})();
