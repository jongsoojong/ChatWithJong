var mongoose = require('mongoose');

mongoose.connect('mongodb://jongsoo:jongsoo@ds017070.mlab.com:17070/jongtest')
var db = mongoose.connection;

db.once('open', function(){
  console.log("Power Overwhelming");
})

module.exports = db
