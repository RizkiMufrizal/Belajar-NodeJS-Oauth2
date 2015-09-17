(function() {
  'use strict';

  angular.module('ImplicitClient')
    .factory('UserFactory', UserFactory);
  UserFactory.$inject = ['$resource', 'UserService'];

  function UserFactory($resource, UserService) {
    var userFactory = this;

    userFactory.getUsers = function(token, page, jumlah) {
      return $resource(UserService.getUsers(page, jumlah), {}, {
        query: {
          method: 'GET',
          isArray: false,
          headers: {
            'Authorization': 'Bearer ' + token
          }
        }
      });
    };

    userFactory.deleteUser = function(token, id) {
      return $resource(UserService.deleteUser(id), {}, {
        query: {
          method: 'DELETE',
          headers: {
            'Authorization': 'Bearer ' + token
          }
        }
      });
    }

    return userFactory;

  }

})();
