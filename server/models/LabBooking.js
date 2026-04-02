const mongoose = require("mongoose");

const labBookingSchema = new mongoose.Schema({

lab: String,

date: String,

timeSlot: String,

purpose: String,

studentEmail: String,

status:{
type:String,
default:"Pending"
}

});

module.exports = mongoose.model("LabBooking", labBookingSchema);