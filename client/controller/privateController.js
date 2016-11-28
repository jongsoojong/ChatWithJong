angular.module('jongChat')
  .controller('privateController', function($scope, $state, $http, $location, socket, userInfo, getChatData){

    var vm = this;

    if(userInfo.isLogged === false){
      $location.path('/login');
    }

  })
