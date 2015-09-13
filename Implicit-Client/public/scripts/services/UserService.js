(function() {
  'use strict';

  angular.module('ImplicitClient')
    .factory('UserService', UserService);

  function UserService() {
    var userService = this;

    userService.getUsers = 'http://localhost:3000/api/user';

    return userService;

  }

})();
