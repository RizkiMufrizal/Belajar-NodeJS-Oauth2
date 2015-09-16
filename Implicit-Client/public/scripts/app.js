(function() {
  'use strict';
  angular
    .module('ImplicitClient', [
      'ngRoute',
      'ngResource',
      'mdo-angular-cryptography',
      'ui.router',
      'ipCookie'
    ])
    .config(['$cryptoProvider', '$stateProvider', '$urlRouterProvider', '$locationProvider', function($cryptoProvider, $stateProvider, $urlRouterProvider, $locationProvider) {

      $cryptoProvider.setCryptographyKey('administrator');

      $stateProvider
        .state('Home', {
          url: '/',
          templateUrl: '/pages/user',
          controller: 'UserController',
          controllerAs: 'user'
        });

    }]);
})();
