const express = require("express");
const router = express.Router();
const stats = require("../model/stats");
const middle = require("../helper/apikey");

router.use(middle);

router.get("/stats", async (req, res) => {
  try {
    const data = await stats.find();
    res.status(200).json({ data });
  } catch (err) {
    res.status(500).json({ failure: "issue in fetching data" });
  }
});

router.get("/stats/:id", async (req, res) => {
  try {
    const existdata = await stats.findOne({ arduinoId: req.params.id });
    if (!existdata) {
      res.status(404).json({ error: "data not found" });
    }
    res.status(200).json({ existdata: existdata });
  } catch (err) {
    res.status(500).json({ error: err.mesaage });
  }
});

router.post("/stats", async (req, res) => {
  try {
    const { arduinoId } = req.body;
    const existdata = await stats.findOne({ arduinoId });
    if (existdata) {
      return res.status(409).json({ error: "data exist" });
    }
    const data = new stats(req.body);
    await data.save();
    res.status(201).json({ sucess: "data added" });
  } catch (err) {
    res.status(500).json({ failure: "issue in adding data" });
  }
});

router.patch("/stats/:id", async (req, res) => {
  try {
    const updateddata = await stats.findOneAndUpdate(
      { arduinoId: req.params.id },
      req.body,
      {
        new: true,
      }
    );
    if (!updateddata) {
      return res.status(409).json({
        message: "data not found",
      });
    }
    res.status(200).json({ message: "successfully updated", updateddata });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch("/resetall", async (req, res) => {
  try {
    const result = await stats.updateMany({}, { kills: 0, Players: [] });
    res
      .status(200)
      .json({ result: `reseted sucessfully : ${result.modifiedCount} items` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/stats", async (req, res) => {
  try {
    const result = await stats.deleteMany({});
    res
      .status(200)
      .json({ result: `deleted sucessfully : ${result.deletedCount} items` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
