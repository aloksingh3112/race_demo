const mongoose = require('mongoose');

const racerSchema = new mongoose.Schema({
  name: { type: String },
  totalWins: { type: Number, default: 0 },
  oponent: [{ type: mongoose.Schema.Types.ObjectId, ref: 'RacerModel' }],
  totalMatch: { type: Number, default: 0 }
});

module.exports = mongoose.model('RacerModel', racerSchema);
