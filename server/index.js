import dotenv from 'dotenv';
import bluebird from 'bluebird';

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

// dotenv must be placed above an app logic that is not a 'require'
// Brings all vars from 'env' file into node environment vars
dotenv.config();

const app = express();
app.use(express.static('build'));
require('./middleware')(app);
require('./routes')(app);

mongoose.Promise = bluebird;
mongoose.connect(
  process.env.MONGO_URI,
  {
    useNewUrlParser: true,
  },
);

app.get('*', (req, res) => {
  res.sendFile(path.resolve(`${__dirname}/../build/index.html`));
});

app.listen(process.env.PORT, () => {
  console.log('app listening on', process.env.PORT); // eslint-disable-line
});
