(function() {
  'use strict';

  angular.module('ImplicitClient')
    .controller('UserController', UserController);
  UserController.$inject = ['UserFactory', '$window', '$crypto'];

  function UserController(UserFactory, $window, $crypto) {
    var user = this;

    user.dataUser = {};
    user.paging = {
      page: 1,
      jumlah: 5
    };

    function getUser() {
      UserFactory.getUsers($crypto.decrypt($window.sessionStorage.getItem('token')), user.paging.page, user.paging.jumlah).query({}, function(data) {
        user.dataUser = data.documents;

        user.paging.totalPages = data.totalPages;

      });
    }

    getUser();

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
