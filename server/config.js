
const config = require('../configs/default');
const local = require('../configs/local');
Object.keys(local).forEach(function (key) {
  config[key] = myObj[key];
});
module.exports = config;