const mongoose = require("mongoose");

const stats = new mongoose.Schema({
  arduinoId: { type: Number, index: true },
  kills: { type: Number, default: 0 },
  Players: { type: Array, default: [] },
});

module.exports = mongoose.model("stats", stats);
