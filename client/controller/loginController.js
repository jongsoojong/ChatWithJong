angular.module('jongChat')
  .controller('loginController', function($scope, $state, $http, $location, userInfo){
    var vm = this;

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
          userInfo.currentUsername = vm.userlogin.username;
          console.log(userInfo)
          userInfo.isLogged = true;
        }
      }).error(function(err){
        console.log(err);
      })

    }
  })
