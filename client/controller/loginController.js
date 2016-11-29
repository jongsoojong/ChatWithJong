angular.module('jongChat')
  .controller('loginController', function($scope, $state, $http, $location, userInfo, socket){
    var vm = this;

    if(userInfo.isLogged === true){
      $location.path('/main');
    }

    vm.login = function() {
      $http.post('/api/user/login', vm.userlogin)
      .success(function(res){
        console.log(res)
        if(res === '') {
          alert("Sorry that account/password is incorrect!");
          $location.path("/login")
        } else {
          alert("Logged in!")
          $location.path("/main");
          socket.emit("new-user", vm.userlogin.username)
          userInfo.currentUsername = vm.userlogin.username;
          userInfo.isLogged = true;

          console.log(userInfo)
        }
      }).error(function(err){
        console.log(err);
      })

    }
  })
