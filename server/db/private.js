var mongoose = require('mongoose');

var PrivateSchema = new mongoose.Schema({
  name: String,
  password: String,
  chat: Array
})

module.exports = mongoose.model('Privateroom', PrivateSchema);
