
// Dependencies

var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

// Setup

var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

// Databases

var db = require('./server/db/index.js')
var User = require('./server/db/users.js');
var Chat = require('./server/db/chats.js');
var Privateroom = require('./server/db/private.js');



app.use(express.static("./client"))
app.use(bodyParser.json())
var port = process.env.PORT || 8888;

app.get('/', function(req, res){
  res.sendFile(__dirname + "/client/index.html");
})



//initializes the chatrooms


Chat.findOne({name: "main"}, function(err, user){
  if(user === null) {
    Chat.create({
      "name": "main",
      "chat": []
    })
  } else {
    console.log("Main Exists!")
  }
});

Chat.findOne({name: "MKS049"}, function(err, user){
  if(user === null) {
    Chat.create({
      "name": "MKS049",
      "chat": []
    })
  } else {
    console.log("MKS Exists!")
  }
});

Chat.findOne({name: "The Hangout"}, function(err, user){
  if(user === null) {
    Chat.create({
      "name": "The Hangout",
      "chat": []
    })
  } else {
    console.log("The Hangout Exists!")
  }
});

Chat.findOne({name: "HackReactor"}, function(err, user){
  if(user === null) {
    Chat.create({
      "name": "HackReactor",
      "chat": []
    })
  } else {
    console.log("HackReactor Exists!")
  }
});


// Express Routes

// -------------For global chatrooms-------------------

app.get('/api/user/getmainchat', function(req, res){
  Chat.findOne({name: 'main'}, function(err, messages){
    res.send(messages)
  })
})

app.get('/api/user/getmks', function(req, res){
  Chat.findOne({name: "MKS049"}, function(err, messages){
    res.send(messages)
  })
})

app.get('/api/user/gethr', function(req, res){
  Chat.findOne({name: 'HackReactor'}, function(err, messages){
    res.send(messages)
  })
})

app.get('/api/user/gethangout', function(req, res){
  Chat.findOne({name: 'The Hangout'}, function(err, messages){
    res.send(messages)
  })
})


// ----------Signup and Login----------------

var users = {};

app.post('/api/user/signup', function(req, res) {
  User.findOne({username: req.body.username}, function(err, data){
    if(data === null) {
      console.log("new User", req.body);
      var user = new User(req.body);
      user.save();
    } else {
      console.log("User exists");
    }
  })
})

app.post('/api/user/login', function(req, res) {
  User.findOne(req.body, function(err, user){
    res.send(user);
  })
})

//----------Private Rooms -------------------

app.post('/api/user/private', function(req, res){
  Privateroom.findOne({name: req.body.name}, function(err, data){
    var created = true;
    if(data === null) {
      console.log('created private room', req.body);
      var privateRoom = new Privateroom(req.body);
      privateRoom.save();
    } else {
      console.log("ROOM EXISTS");
      created = false;
    }
    res.send(created);
  })
})

app.post('/api/user/postprivate', function(req, res){
  Privateroom.findOne({name: req.body.privateRoomName}, function(err, messages){
    res.send(messages);
  })
})

app.post('/api/user/privatelogin', function(req, res) {
  Privateroom.findOne(req.body, function(err, user){
    res.send(user);
  })
})

// -----------Socket.io listeners and emitters------------------

io.sockets.on('connection', function(socket){

  socket.on('send-message-main', function(data){
    io.sockets.emit('get-message-main', data)
    Chat.findOneAndUpdate({name: 'main'}, {$push: { chat: data } }, {upsert:true}, function(err, message){
    })
  })

  socket.on('send-message-mks', function(data){
    io.sockets.emit('get-message-mks', data)
    Chat.findOneAndUpdate({name: 'MKS049'}, {$push: { chat: data } }, {upsert:true}, function(err, message){
    })
  })

  socket.on('send-message-hr', function(data){
    io.sockets.emit('get-message-hr', data)
    Chat.findOneAndUpdate({name: 'HackReactor'}, {$push: { chat: data } }, {upsert:true}, function(err, message){
    })
  })

  socket.on('send-message-hangout', function(data){
    io.sockets.emit('get-message-hangout', data)
    Chat.findOneAndUpdate({name: 'The Hangout'}, {$push: { chat: data } }, {upsert:true}, function(err, message){
    })
  })

  socket.on('send-message-private', function(data){
    io.sockets.emit('get-message-private', data);
    Privateroom.findOneAndUpdate({name: data.roomName}, {$push: { chat: data.msg } }, {upsert:true}, function(err, message){
    })
  })

})

server.listen(port, function(){
  console.log("Conjuring Undead at ", + port)
})
