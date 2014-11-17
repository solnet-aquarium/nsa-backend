'use-strict'

/**
*
*
*/

var mongoose = require('mongoose')
var Schema = mongoose.Schema

var UserSchema = new Schema({
  name: {
    first: { type: String, default: '' },
    last: { type: String, default: '' }
    },
  token: { type: String, default: '' }

})

UserSchema.virtual('name.full').get(function() {
  return this.name.first + ' ' + this.name.last
})

UserSchema.path('name.first').validate(function(first) {
  if (this.skipValidation()) { return true; }
  return first.length
}, 'First name cannot be blank')
