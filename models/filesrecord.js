const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Create Schema
const UploadFileSchema = new Schema({
  agentId: {
    type: String,
  },
  agentResponse: {
    type: String,
  },
  adminResponse: {
    type: String,
  },
  status: {
    type: String,
  },
  userFiles: {
    type: Array,
  },
   agentEmail: {
    type: String,
  },
   leadEmail: {
    type: String,
  },
   threadEmail: {
    type: String,
  },
   series: {
    type: String,
  },
   admin3Name: {
    type:String ,
  },
  
},
{ timestamps: true }
);
module.exports = User = mongoose.model("uploadFiles", UploadFileSchema);