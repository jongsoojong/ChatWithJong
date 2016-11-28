angular.module('jongChat')
  .controller('chatController', function($scope, $state, $http, $location, socket, userInfo, getChatData){
    var vm = this;
    vm.msgs = [];
    var thisDate = new Date;
    vm.messagePrompt =  userInfo.currentUsername + " (" + thisDate.toLocaleString() + ")" + ' : '

    if(userInfo.isLogged === false){
      $location.path('/');
    }
    // gonna make a global init, followed by 4 other chat room init.
    vm.init = function() {
      $http.get('/api/user/getmainchat')
      .then(function(results){
        vm.msgs = results.data.chat
      })
    }

    vm.sendMessage = function() {
      socket.emit('send-message', vm.messagePrompt + vm.msg.text);
      vm.msg.text = '';
    };

    socket.on('get-message', function(message){
      userInfo.currentMessages = message;
      vm.msgs.push(message);
      $scope.$digest();
      // $http.post('/api/user/mainchat', userInfo)
      // .success(function(res){
      //   console.log("updated!")
      // }).error(function(err){
      //   console.log("ERROR", err);
      // })
    });

  });
