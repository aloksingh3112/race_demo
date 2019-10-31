const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const AdminModel = require('../schema/admin');
const racerModel = require('../schema/racer');

router.get('/winner', async (req, res) => {
  try {
    var racerData = await racerModel.find();
    racerData.sort((a, b) => {
      return b.totalWins - a.totalWins;
    });
    console.log(racerData);
    return res.json({
      data: racerData
    });
  } catch (error) {
    return res.status(200).json({
      message: 'something went wrong',
      err: error
    });
  }
});
module.exports = router;
