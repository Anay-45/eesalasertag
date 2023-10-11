const express = require("express");
const router = express.Router();
const PlayerData = require("../model/data");
const middle = require("../helper/apikey");

router.use(middle);
router.post("/adddata", async (req, res) => {
  try {
    const { arduinoId } = req.body;
    const existdata = await PlayerData.findOne({ arduinoId });

    if (existdata) {
      return res
        .status(409)
        .json({ error: "arduino already assigned to someone" });
    }
    const data = new PlayerData(req.body);
    await data.save();
    res.status(201).json({ sucess: "data added" });
  } catch (ex) {
    res.status(500).json({ failure: "issue in adding data" });
    console.log(err);
  }
});
router.get("/getdata", async (req, res) => {
  try {
    const data = await PlayerData.find();
    res.status(200).json({ data });
  } catch (ex) {
    res.status(500).json({ err: ex.message });
  }
});
router.get("/getdata/:id", async (req, res) => {
  try {
    const arduinoId = req.params.id;
    const existdata = await PlayerData.findOne({ arduinoId });
    if (!existdata) {
      return res.status(409).json({ error: "data not found" });
    }
    res.status(200).json({ existdata });
  } catch (ex) {
    res.status(500).json({ error: ex.message });
  }
});

router.patch("/update/:id", async (req, res) => {
  try {
    const updateddata = await PlayerData.findOneAndUpdate(
      { arduinoId: req.params.id },
      req.body,
      { new: true }
    );
    if (!updateddata) {
      return res.status(409).json({
        message: "data not found",
      });
    }
    res.status(200).json({ message: "successfully updated", updateddata });
  } catch (ex) {
    res.status(500).json({ error: ex.message });
  }
});

router.delete("/deletealldata", async (req, res) => {
  try {
    const result = await PlayerData.deleteMany({});
    res
      .status(200)
      .json({ result: `deleted sucessfully : ${result.deletedCount} items` });
  } catch (ex) {
    res.status(500).json({ error: ex.message });
  }
});

router.patch("/resetall", async (req, res) => {
  try {
    const result = await PlayerData.updateMany(
      {},
      {
        status: false,
        count: 0,
        hits: 0,
        killedby: [],
      }
    );
    res
      .status(200)
      .json({ result: `reseted sucessfully : ${result.modifiedCount} items` });
  } catch (ex) {
    res.status(500).json({ error: ex.message });
  }
});

module.exports = router;
