
var socketApp = angular.module('jongChat', ['ui.router']);


socketApp.config(function($stateProvider, $urlRouterProvider){

  $urlRouterProvider.otherwise('/');

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

  $stateProvider.state('about', {
    url: "/about",
    templateUrl: "./templates/about.html"
  })

  $stateProvider.state('privatecreate', {
    url: "/privatecreate",
    templateUrl: "./templates/privatecreate.html",
    controller: "privateController as vm"
  })


  $stateProvider.state('privatelogin', {
    url: "/privatelogin",
    templateUrl: "./templates/privatelogin.html",
    controller: "privateController as vm"
  })

  $stateProvider.state('privateroom', {
    url: "/privateroom",
    templateUrl: "./templates/privateroom.html",
    controller: "privateController as vm"
  })



  $stateProvider.state("otherwise", {
    url : '/'
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
  var privateRoomName = '';
  var isLogged = false;
  var isPrivateLogged = false;

  return {
    currentUsername: currentUsername,
    currentMessages: currentMessages,
    isLogged : isLogged
  }

})

socketApp.factory('makeChat', function($http){

  var makeData = function(name, password){
    return $http({
      method:'POST',
      url: '/api/user/privatelogin',
      data: {
        "name": name,
        "password": password,
        "chat": []
      }
    })
  }

  return makeData;

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
