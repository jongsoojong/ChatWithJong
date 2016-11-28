angular.module('jongChat')
  .controller('signUpController', function($scope, $state, $http, $location, userInfo){
    var vm = this;

    if(userInfo.isLogged === true){
      $location.path('/main');
    }

    vm.createUser = function() {
      if(vm.newUser.username.length <= 6 || vm.newUser.password.length <= 6) {
        alert("Username or password is too short! ", $location);
      } else {
        alert("Account Created!");
        console.log(vm.newUser);
        $location.path("/login");
        $http.post('/api/user/signup', vm.newUser)
        .success(function(res){
        }).error(function(err){
          console.log(err);
        })
      }
    }

  })
