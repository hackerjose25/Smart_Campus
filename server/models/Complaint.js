const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema({
    title: String,
    category: String,
    description: String,
    location: String,
    studentEmail: String,
    status: {
        type: String,
        default: "Pending"
    }
});

module.exports = mongoose.model("Complaint", complaintSchema);