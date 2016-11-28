
// Dependencies

var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');


var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

// Databases

var db = require('./server/db/index.js')
var User = require('./server/db/users.js');
var Chat = require('./server/db/chats.js');


app.use(express.static("./client"))
app.use(bodyParser.json())
var port = process.env.PORT || 8888;

app.get('/', function(req, res){
  res.sendFile(__dirname + "/client/index.html");
})


//initializes the chatrooms


Chat.findOne({name: "main"}, function(err, user){
  console.log("THE USER ", user)
  if(user === null) {
    Chat.create({
      "name": "main",
      "chat": []
    })
  } else {
    console.log("Main Exists!")
  }
})

// Express Routes

app.post('/api/user/signup', function(req, res) {
  console.log(req.body)
  var user = new User(req.body);
  user.save()
})

app.get('/api/user/getmainchat', function(req, res){
  console.log("Current Chat" + req.body);
  Chat.findOne({name: 'main'}, function(err, messages){
    res.send(messages)
  })
})


app.post('/api/user/login', function(req, res) {
  console.log(req.body)
  User.findOne(req.body, function(err, user){
    console.log("THE USER ", user)
    res.send(user);
  })
})

// Socket.io listeners and emitters

io.sockets.on('connection', function(socket){
  socket.removeAllListeners()
  socket.on('disconnect', function () {
    setTimeout(function () {
         //do something
    }, 10000);
  });
  socket.on('send-message', function(data){
    console.log("SOCKETDATA ",data)
    io.sockets.emit('get-message', data)
    Chat.findOneAndUpdate({name: 'main'}, {$push: { chat: data } }, {upsert:true}, function(err, message){
      console.log("AHHHHH!")
    })
  })
})

server.listen(port, function(){
  console.log("Conjuring Undead at ", + port)
})
