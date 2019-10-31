const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const AdminModel = require('../schema/admin');
const racerModel = require('../schema/racer');

router.post('/addRacer', async (req, res) => {
  try {
    const racerA = await racerModel.findOne({ name: req.body.name });

    var racerB = await racerModel.findOne({ name: req.body.oponent });

    if (racerA && racerB) {
      if (req.body.winner == 0) {
        racerA.totalWins = racerA.totalWins + 1;
      } else {
        racerB.totalWins = racerB.totalWins + 1;
      }
      racerA.totalMatch = racerA.totalMatch + 1;
      racerB.totalMatch = racerB.totalMatch + 1;
      const racerAResult = await racerA.save();
      const racerBResult = await racerB.save();
      return res.status(200).json({
        message: 'races added sucessfully'
      });
    } else if (racerA && !racerB) {
      const racerB = new racerModel({
        name: req.body.oponent,
        totalMatch: 1,
        totalWins: req.body.winner
      });

      if (req.body.winner == 0) {
        racerA.totalWins = racerA.totalWins + 1;
      }
      racerA.oponent.push(racerB);
      racerB.oponent.push(racerA);
      racerA.totalMatch = racerA.totalMatch + 1;
      const racerAResult = await racerA.save();
      const racerBResult = await racerB.save();
      var admin = await AdminModel.findOne({});
      admin.racers.push(racerBResult);
      const result = await admin.save();
      return res.status(200).json({
        message: 'Race added Successfully',
        result: result
      });
    } else if (!racerA && racerB) {
      console.log('ggsipu');
      var data;
      if (req.body.winner == 0) {
        data = 1;
      } else {
        data = 0;
      }
      console.log('ggsipu1');

      const racerA = new racerModel({
        name: req.body.name,
        totalMatch: 1,
        totalWins: data
      });
      console.log('ggsipu3');
      racerA.oponent.push(racerB);
      racerB.oponent.push(racerA);
      console.log('ggsipu4');
      if (req.body.winner == 1) {
        racerB.totalWins = racerB.totalWins + 1;
      }
      racerB.totalMatch = racerB.totalMatch + 1;
      const racerAResult = await racerA.save();
      const racerBResult = await racerB.save();
      console.log('ipu', racerAResult, racerBResult);
      var admin = await AdminModel.findOne({});
      admin.racers.push(racerAResult);
      const result = await admin.save();
      return res.status(200).json({
        message: 'Race added Successfully',
        result: result
      });
    } else if (!racerA && !racerB) {
      var win = 0;
      var loose = 0;
      if (req.body.winner == 1) {
        win = 1;
      } else {
        loose = 1;
      }

      const racerA = new racerModel({
        name: req.body.name,
        totalMatch: 1,
        totalWins: win
      });
      const racerB = new racerModel({
        name: req.body.oponent,
        totalMatch: 1,
        totalWins: loose
      });
      racerA.oponent.push(racerB);
      racerB.oponent.push(racerA);
      const racerAResult = await racerA.save();
      const racerBResult = await racerB.save();

      var admin = await AdminModel.findOne({});
      if (!admin) {
        const admin = new AdminModel({ racers: [racerAResult, racerBResult] });
        const result = await admin.save();
        return res.status(200).json({
          message: 'Race added Successfully',
          result: result
        });
      } else {
        admin.racers.push(racerAResult);
        admin.racers.push(racerBResult);
        const result = await admin.save();
        return res.status(200).json({
          message: 'Race added Successfully',
          result: result
        });
      }
    }
  } catch (error) {
    return res.status(200).json({
      message: 'something went wrong',
      err: error
    });
  }
});

router.get('/listRacer', async (req, res) => {
  try {
    const adminData = await AdminModel.findOne({}).populate({
      path: 'racers',
      populate: {
        path: 'oponent',
        model: 'RacerModel'
      }
    });

    if (adminData.racers.length > 0) {
      return res.status(200).json({
        message: 'list data',
        data: adminData,
        status_code: 200
      });
    } else {
      return res.status(200).json({
        message: 'No Data found',

        status_code: 404
      });
    }
  } catch (error) {
    return res.status(200).json({
      message: 'something went wrong',
      err: error
    });
  }
});

router.post('/deleteRacer', async (req, res) => {
  try {
    const adminData = await racerModel.findByIdAndRemove(req.body.id);

    return res.status(200).json({
      message: 'Racer Deletes Successfully',
      status_code: 200
    });
  } catch (error) {
    return res.status(200).json({
      message: 'something went wrong',
      err: error,
      status_code: 400
    });
  }
});
module.exports = router;
