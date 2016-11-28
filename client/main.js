
var socketApp = angular.module('jongChat', ['ui.router']);


socketApp.config(function($stateProvider){

  $stateProvider.state('signUp', {
    url: "/signup",
    templateUrl: "./templates/signup.html" ,
    controller: "signUpController as vm"
  })

  $stateProvider.state('chatRoom', {
    url: "/main",
    templateUrl: "./templates/chatroom.html" ,
    controller: "chatController as vm"
  })

  $stateProvider.state('login', {
    url: "/login",
    templateUrl: "./templates/login.html" ,
    controller: "loginController as vm"
  })

  $stateProvider.state('intro', {
    url: "/",
    templateUrl: "./templates/intro.html" ,
  })



})


//FACTORIES (Hellions, Siege Tanks, and Thors! Oh My!)

socketApp.factory('socket', function($location){
  var socket = io.connect($location.absUrl());
  return socket;
})

socketApp.factory('userInfo', function($http){

  var currentUsername = '';
  var currentMessages = '';
  var isLogged = false;

  return {
    currentUsername: currentUsername,
    currentMessages: currentMessages,
    isLogged : isLogged
  }

})

socketApp.factory('makeChat', function($http){

  var makeData = function(chatName){
    return $http({
      method:'POST',
      url: '/api/newChat',
      data: {
        "name": name,
        "chat": []
      }
    })
  }

})

socketApp.factory('updateChat', function($http){

  var getData = function(chatName){
    return $http({
      method:'POST',
      url: '/api/newChat',
      data: {
        "name": name,
        "chat": []
      }
    })
  }

})


socketApp.factory('getChatData', function($http){

  var getData = function(data){
    return $http.post('/api/user/getchat', data)
    .then(function(results){
      return results;
    })
  }

  return {
    getData: getData
  }

})
