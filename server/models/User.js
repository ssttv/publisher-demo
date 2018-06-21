const mongoose = require('mongoose')

let UserSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    provider: String,
    token: String,
    provider_id: String,
    token: String,
    provider_pic: String,
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ]
  }
)
UserSchema.methods.addFollower = function (fs) {
  this.followers.push(fs)
}
module.exports = mongoose.model('User', UserSchema)
