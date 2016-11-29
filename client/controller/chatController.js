angular.module('jongChat')
  .controller('chatController', function($scope, $state, $http, $location, socket, userInfo, getChatData){

    var vm = this;
    var thisDate = new Date;

    vm.messagePrompt =  userInfo.currentUsername + " (" + thisDate.toLocaleString() + ")" + ' : ';
    vm.msgs = [];
    vm.hangoutmsgs = [];
    vm.hrmsgs = [];
    vm.mksmsgs = [];
    vm.mksState = true;
    vm.hrState = true;
    vm.mainState = false;
    vm.hangoutState = true;

    vm.mainSwitch = function() {
      vm.mainState = false;
      vm.mksState = true;
      vm.hrState = true;
      vm.hangoutState = true;
    }

    vm.mksSwitch = function() {
      vm.mainState = true;
      vm.mksState = false;
      vm.hrState = true;
      vm.hangoutState = true;
    }

    vm.hrSwitch = function() {
      vm.mainState = true;
      vm.mksState = true;
      vm.hrState = false;
      vm.hangoutState = true;
    }

    vm.hangoutSwitch = function() {
      vm.mainState = true;
      vm.mksState = true;
      vm.hrState = true;
      vm.hangoutState = false;
    }

    if(userInfo.isLogged === false){
      $location.path('/login');
    }

    vm.logout = function(){
      userInfo.isLogged = false;
      userInfo.currentUsername = '';
      userInfo.currentMessages = '';

      $location.path('/login');
    }
    // gonna make a global init, followed by 4 other chat room init.

    vm.main = function() {
      $http.get('/api/user/getmainchat')
      .then(function(results){
        vm.msgs = results.data.chat;
      })
    }

    vm.mks = function() {
      $http.get('/api/user/getmks')
      .then(function(results){
        vm.mksmsgs = results.data.chat;
      })
    }

    vm.hr = function() {
      $http.get('/api/user/gethr')
      .then(function(results){
        vm.hrmsgs = results.data.chat;
      })
    }

    vm.hangout = function() {
      $http.get('/api/user/gethangout')
      .then(function(results){
        vm.hangoutmsgs = results.data.chat;
      })
    }

    vm.sendMessageMain = function() {
      socket.emit('send-message-main', vm.messagePrompt + vm.msg.text);
      vm.msg.text = '';
    };

    socket.on('get-message-main', function(message){
      userInfo.currentMessages = message;
      vm.msgs.push(message);
      $scope.$digest();
    });

    vm.sendMessageMKS = function() {
      socket.emit('send-message-mks', vm.messagePrompt + vm.mksmsg.text);
      vm.mksmsg.text = '';
    };

    socket.on('get-message-mks', function(message){
      userInfo.currentMessages = message;
      vm.mksmsgs.push(message);
      $scope.$digest();
    });

    vm.sendMessageHr = function() {
      socket.emit('send-message-hr', vm.messagePrompt + vm.hrmsg.text);
      vm.hrmsg.text = '';
    };

    socket.on('get-message-hr', function(message){
      userInfo.currentMessages = message;
      vm.hrmsgs.push(message);
      $scope.$digest();
    });

    vm.sendMessageHangout = function() {
      socket.emit('send-message-hangout', vm.messagePrompt + vm.hangoutmsg.text);
      vm.hangoutmsg.text = '';
    };

    socket.on('get-message-hangout', function(message){
      userInfo.currentMessages = message;
      vm.hangoutmsgs.push(message);
      $scope.$digest();
    });

  });
