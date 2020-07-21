const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

app.get('/', (req, res, next) => {
  res.send('App is running.');
});

app.listen(3000, () => {
  console.log('App listening at port 3000...');
});