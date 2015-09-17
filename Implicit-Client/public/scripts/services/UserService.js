(function() {
  'use strict';

  angular.module('ImplicitClient')
    .factory('UserService', UserService);

  function UserService() {
    var userService = this;

    userService.getUsers = function(page, jumlah) {
      return 'http://localhost:3000/api/user?page=' + page + '&jumlah=' + jumlah;
    };
    userService.deleteUser = function(id) {
      return 'http://localhost:3000/api/user/' + id;
    };

    return userService;

  }

})();
