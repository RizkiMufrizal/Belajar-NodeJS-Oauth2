(function() {
  'use strict';

  angular.module('ImplicitClient')
    .factory('UserFactory', UserFactory);
  UserFactory.$inject = ['$resource', 'UserService'];

  function UserFactory($resource, UserService) {
    var userFactory = this;

    userFactory.getUsers = function(token) {
      return $resource(UserService.getUsers, {}, {
        query: {
          method: 'GET',
          isArray: true,
          headers: {
            'Authorization': 'Bearer ' + token
          }
        }
      });
    };

    return userFactory;

  }

})();
