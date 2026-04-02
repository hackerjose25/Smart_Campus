const express = require("express");
const router = express.Router();
const Complaint = require("../models/Complaint");


// CREATE COMPLAINT
router.post("/", async (req, res) => {

    try {

        const complaint = new Complaint(req.body);

        await complaint.save();

        res.json({message:"Complaint submitted successfully"});

    } catch(err) {

        res.status(500).json({error:err.message});

    }

});


// GET ALL COMPLAINTS (ADMIN)
router.get("/", async (req,res)=>{

    const complaints = await Complaint.find();

    res.json(complaints);

});

// UPDATE STATUS
router.put("/:id", async (req, res) => {

    const complaint = await Complaint.findByIdAndUpdate(
        req.params.id,
        { status: req.body.status },
        { new: true }
    );

    res.json(complaint);
});


module.exports = router;