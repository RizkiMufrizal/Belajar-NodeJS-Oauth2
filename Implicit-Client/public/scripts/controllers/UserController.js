(function() {
  'use strict';

  angular.module('ImplicitClient')
    .controller('UserController', UserController);
  UserController.$inject = ['UserFactory', '$crypto', 'ipCookie', '$window'];

  function UserController(UserFactory, $crypto, ipCookie, $window) {
    var user = this;

    user.oauth2Url = 'http://localhost:3000/oauth/authorization?clientId=w9hJZ7FF&redirectUri=http://localhost:3001&responseType=token';

    user.dataUser = {};
    user.paging = {
      page: 1,
      jumlah: 5
    };

    function getUser() {
      UserFactory.getUsers($crypto.decrypt(ipCookie('token')), user.paging.page, user.paging.jumlah).query({}, function(data) {
        user.dataUser = data.documents;

        user.paging.totalPages = data.totalPages;

      }, function(error) {
        if (error.status === 401) {
          console.log('token expired');
          ipCookie.remove('token');
          $window.location.href = user.oauth2Url;
        }
      });
    }

    getUser();

    user.deleteUser = function(id) {
      console.log(id);
      UserFactory.deleteUser($crypto.decrypt(ipCookie('token')), id).query({}).$promise.then(function(data) {
        alert(data);
        getUser();
      });
    }

    //paging
    user.nextPage = function() {
      if (user.paging.page < user.paging.totalPages) {
        user.paging.page++;
        getUser();
      }
    };

    user.previousPage = function() {
      if (user.paging.page > 1) {
        user.paging.page--;
        getUser();
      }
    };
    //end paging

  }

})();
