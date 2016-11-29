angular.module('jongChat')
  .controller('privateController', function($scope, $state, $http, $location, socket, userInfo){

    var vm = this;

    vm.privatemessages = [];

    if(userInfo.isLogged === false){
      $location.path('/login');
    }


    vm.privateInit = function() {
      $http.get('/api/user/getprivate', userInfo)
      .then(function(results){
      console.log(results)
      vm.privatemessages = results.chat
      })
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

      $location.path('/main')
    }


    vm.sendPrivateMessage = function() {
      console.log(vm.privatemessage.text)
      userInfo.currentMessages = vm.privatemessage.text
      console.log("THIS IS USERINFO", userInfo);
      vm.privatemessage.text = ''
      $http.post('/api/user/postprivate', userInfo)
      .success(function(res){
      }).error(function(err){
        console.log(err);
      })
      vm.privateInit();
      //$route.reload()
    };



    vm.createPrivateRoom = function() {
      if(vm.newRoom.name.length <= 6 || vm.newRoom.password.length <= 6) {
        alert("Chatroom and/or password is too short!");
      } else {
        alert("Room Created!");
        console.log(vm.newRoom);
        $location.path("/privatelogin");
        $http.post('/api/user/private', vm.newRoom)
        .success(function(res){
        }).error(function(err){
          console.log(err);
        })
      }
    };

    vm.loginPrivateRoom = function() {
        $http.post('/api/user/privatelogin', vm.roomInfo)
        .success(function(res){
          console.log(res)
          if(res === '') {
            alert("Sorry, that chatroom doesn't exist, or the password is wrong");
            $location.path("/privatelogin")
          } else {
            alert("WELCOME!")
            userInfo.isPrivateLogged = true;
            userInfo.privateRoomName = vm.roomInfo.name;
            console.log(vm.roomInfo.name)
            console.log(userInfo)
            socket.emit('private-message-update', vm.roomInfo.name)
            $location.path("/privateroom");
          }
        }).error(function(err){
          console.log(err);
        })
    };

  })
