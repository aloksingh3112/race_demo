const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
  racers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'RacerModel' }]
});

module.exports = mongoose.model('AdminModel', AdminSchema);
