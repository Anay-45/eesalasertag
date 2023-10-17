const express = require("express");

const data = require("../model/data");

const router = express.Router();
const middle = require("../helper/apikey");

router.use(middle);

router.patch("/setstatus/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const PlayerData = await data.findOne({ arduinoId: id });
    if (!PlayerData) {
      return res.status(409).json({ error: "data not found" });
    }
    PlayerData.status = !PlayerData.status;
    const newdata = await PlayerData.save();
    res.status(200).json({ message: "success", newdata });
  } catch (ex) {
    res.status(500).json({ failure: "api not working" });
  }
});

module.exports = router;
