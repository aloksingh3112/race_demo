const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const app = express();
const mongoose = require('mongoose');

const adminRoute = require('./routes/admin');
const racerRoute = require('./routes/racer');

//connection
mongoose
  .connect('mongodb://localhost:27017/race1', { useNewUrlParser: true })
  .then(res => console.log('connection established'))
  .catch(err => console.log('error'));

// bodyparser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept,Auth'
  );
  res.setHeader('Access-Control-Allow-Methods', 'POST,PUT, GET, PATCH, DELETE, OPTIONS');
  next();
});

app.use('/admin', adminRoute);
app.use('/racer', racerRoute);

// Server
const port = process.env.port || '3000';
app.set('port', port);

const server = http.createServer(app);
server.listen(port, () => {
  console.log('connected to server' + port);
});
