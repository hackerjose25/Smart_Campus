const mongoose = require("mongoose");

const leaveSchema = new mongoose.Schema({

leaveType: String,

fromDate: String,

toDate: String,

reason: String,

studentEmail: String,

status:{
type:String,
default:"Pending"
}

});

module.exports = mongoose.model("Leave", leaveSchema);