const express = require("express");
const router = express.Router();
const LabBooking = require("../models/LabBooking");


// CREATE BOOKING
router.post("/", async (req,res)=>{

try{

const booking = new LabBooking(req.body);

await booking.save();

res.json({message:"Lab booked successfully"});

}catch(err){

res.status(500).json({error:err.message});

}

});


// GET ALL BOOKINGS (ADMIN)
router.get("/", async (req,res)=>{

const bookings = await LabBooking.find();

res.json(bookings);

});

// UPDATE STATUS
router.put("/:id", async (req, res) => {
    try {
        const booking = await LabBooking.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        );
        res.json(booking);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;