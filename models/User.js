const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Create Schema
const UserSchema = new Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  user_type: {
    type: String,
    enum : ['AGENT','ADMIN1','ADMIN2','ADMIN3'],
    default: 'AGENT',
    required: true
  },
  userFiles: {
    type: Array,
  },
  adminid:{ type: Schema.Types.ObjectId ,default:null},
  efrticket: [{ type: Schema.Types.ObjectId, ref: 'efrticket' }],
},
{ timestamps: true }
);
module.exports = User = mongoose.model("users", UserSchema);