require("dotenv").config();
console.log("Starting server with API Key:", process.env.GEMINI_API_KEY ? "Present" : "Missing");


const express = require("express");
const cors = require("cors");
const path = require("path");

const connectDB = require("./config/db");

const authRoutes = require("./routes/auth");
const complaintRoutes = require("./routes/complaintRoutes");

const app = express();   // ← create app FIRST

// connect database
connectDB();

// middleware
app.use(cors());
app.use(express.json());

// Serve frontend static files
app.use(express.static(path.join(__dirname, "../public")));

// routes
app.use("/api/chatbot", require("./routes/chatbotRoutes"));
app.use("/api/auth", authRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/lab-bookings", require("./routes/labBookingRoutes"));
app.use("/api/leaves", require("./routes/leaveRoutes"));
app.use("/api/chatbot", require("./routes/chatbotRoutes"));

// start server
app.listen(process.env.PORT, () => {
console.log("Server running on port " + process.env.PORT);
});