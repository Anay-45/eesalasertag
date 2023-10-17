const mongoose = require("mongoose");

const scores = new mongoose.Schema({
  arduinoId: { type: Number, index: true },
  count: { type: Number, default: 0 },
  hits: { type: Number, default: 0 },
  status: { type: Boolean, default: false },
});

module.exports = mongoose.model("PlayerData", scores, "scores");
