const config = require('./server/config');
const express = require('express');
const app = express();
var http = require('http').Server(app);
require('./server/io').init({ http });

const bodyParser = require('body-parser');
const path = require('path');
app.use(express.static(path.join(__dirname, 'build')));
app.use(bodyParser.json());

// Route everything through react
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build/index.html'));
});

const port = process.env.PORT || config.port;

http.listen(port, function() {
  console.log('listening on *:', port);
});
