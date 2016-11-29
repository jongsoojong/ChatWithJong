angular.module('jongChat')
.controller('privateController', function($scope, $state, $http, $location, socket, userInfo){

  var vm = this;
  var thisDate = new Date;

  vm.messagePrompt =  userInfo.currentUsername + " (" + thisDate.toLocaleString() + ")" + ' : '
  vm.privatemessages = [];

  if(userInfo.isLogged === false){
    $location.path('/login');
  }

  vm.privateInit = function() {
    $http.post('/api/user/postprivate', userInfo)
    .success(function(res){
      if(res.chat !== undefined) {
        vm.privatemessages = res.chat;
      }
    });
  }

  vm.logout = function(){
    userInfo.isLogged = false;
    userInfo.currentUsername = '';
    userInfo.currentMessages = '';

    $location.path('/login');
  }

  vm.privateLogout = function(){
    userInfo.isPrivateLogged = false;
    userInfo.privateRoomName = '';
    userInfo.currentMessages = '';
  }

  vm.sendPrivateMessage = function() {
    var chat = {
      'roomName': userInfo.privateRoomName,
      'msg': vm.messagePrompt + vm.privatemessage.text
    }
    socket.emit('send-message-private', chat);
    vm.privatemessage.text = '';
  };

  socket.on('get-message-private', function(data){
    if(data.roomName === userInfo.privateRoomName) {
      userInfo.currentMessages = data.msg;
      vm.privatemessages.push(data.msg);
      $scope.$digest();
    }
  })

  vm.createPrivateRoom = function() {
    if(vm.newRoom.name.length <= 6 || vm.newRoom.password.length <= 6) {
      alert("Chatroom and/or password is too short!");
    } else {
      alert("Room Created!");
      console.log(vm.newRoom);
      $http.post('/api/user/private', vm.newRoom)
      .success(function(res){
        vm.loginPrivateRoom(vm.newRoom);
      }).error(function(err){
        console.log(err);
      })
    }
  };

  vm.loginPrivateRoom = function(roomInfo) {
    if(roomInfo === undefined) {
      roomInfo = vm.roomInfo;
    }
    $http.post('/api/user/privatelogin', roomInfo)
    .success(function(res){
      console.log(res)
      if(res === '') {
        alert("Sorry, that chatroom doesn't exist, or the password is wrong");
        $location.path("/privatelogin")
      } else {
        alert("WELCOME!")
        userInfo.isPrivateLogged = true;
        userInfo.privateRoomName = roomInfo.name;
        console.log(roomInfo.name)
        console.log(userInfo)
        socket.emit('private-message-update', roomInfo.name)
        $location.path("/privateroom");
      }
    }).error(function(err){
      console.log(err);
    })
  };

})
