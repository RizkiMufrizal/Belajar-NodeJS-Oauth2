(function() {
  'use strict';

  angular.module('ImplicitClient')
    .controller('UserController', UserController);
  UserController.$inject = ['UserFactory', '$window', '$crypto'];

  function UserController(UserFactory, $window, $crypto) {
    var user = this;

    user.dataUser = {};

    function getUser() {
      UserFactory.getUsers($crypto.decrypt($window.sessionStorage.getItem('token'))).query({}, function(data) {
        user.dataUser = data;
      });
    }

    getUser();

  }

})();
