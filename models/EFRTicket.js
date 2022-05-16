const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Create Schema
const EFRTicketSchema = new Schema({
  email: {
    type: String,
    required: true
  },
   agent_email: {
    type: String
  },
  email_thread: {
    type: String,
    required: true
  },
  series: {
    type: String
  },
  
  priority_level: {
    type: String,
    enum : ['NORMAL','ELEVATED','URGENT'],
    required: true
  },
  email_thread_response: {
    type: String
  },
  agent:{type: Schema.Types.ObjectId, ref: 'users'},
  assignedAdmin:{type: Schema.Types.ObjectId, ref: 'users'}, // agent has assigned to admin
  admin:{type: Schema.Types.ObjectId, ref: 'users'}, // admin which has given response
  admin_level:{
    type: String,
    enum : ['ADMIN1','ADMIN2','ADMIN3'],
    required: true
  },
  status:{
    type: String,
    enum : ['OPEN','APPROVED','SKIPFOREVER','CLOSE'],
    required: true
  },
},
{ timestamps: true }
);
module.exports = EFRTicket = mongoose.model("efrticket", EFRTicketSchema);