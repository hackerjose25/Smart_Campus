const express = require("express");
const router = express.Router();
const Leave = require("../models/Leave");


// CREATE LEAVE REQUEST
router.post("/", async (req,res)=>{

try{

const leave = new Leave(req.body);

await leave.save();

res.json({message:"Leave request submitted successfully"});

}catch(err){

res.status(500).json({error:err.message});

}

});


// GET ALL LEAVE REQUESTS (ADMIN)
router.get("/", async (req,res)=>{

const leaves = await Leave.find();

res.json(leaves);

});

// UPDATE STATUS
router.put("/:id", async (req, res) => {
    try {
        const leave = await Leave.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        );
        res.json(leave);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;