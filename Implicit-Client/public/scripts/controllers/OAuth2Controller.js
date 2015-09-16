(function() {
  'use strict';

  angular.module('ImplicitClient')
    .controller('Oauth2Controller', Oauth2Controller);

  Oauth2Controller.$inject = ['$location', '$window', '$crypto', 'ipCookie'];

  function Oauth2Controller($location, $window, $crypto, ipCookie) {
    var oauth2 = this;

    oauth2.oauth2Url = 'http://localhost:3000/oauth/authorization?clientId=w9hJZ7FF&redirectUri=http://localhost:3001&responseType=token';

    function loginUser() {
      //redirect ke page login authorization
      $window.location.href = oauth2.oauth2Url;
      console.log('page login');
    }

    function getToken() {
      oauth2.hashToken = $location.hash('#');

      console.log(oauth2.hashToken.$$path);

      //cek apa di url terdapat token
      if (!oauth2.hashToken.$$path.split('&')[0].replace('/', '')) {
        console.log('cek token');

        //jika tidak ada token di session storage dan di url lakukan redirect ke page login authorization server
        loginUser();
        return;
      }

      oauth2.pathUrl = oauth2.hashToken.$$path.split('&')[0].replace('/', '');
      console.log(oauth2.pathUrl);

      if (oauth2.pathUrl.split('=')[0] === 'access_token') {
        console.log(oauth2.pathUrl.split('=')[1]);

        ipCookie('token', $crypto.encrypt(oauth2.pathUrl.split('=')[1]), {
          expires: new Date(new Date().getTime() + (3600 * 1000))
        });

        $window.location.href = 'http://localhost:3001/#/';
      }

    }

    function checkLogin() {

      //cek token di session storage dulu
      if (ipCookie('token')) {
        console.log('token ada');

        //redirect ke home page
        $window.location.href = 'http://localhost:3001/#/';

        return;
      }

      //jika token di session storage masih kosong, cek url apakah terdapat access token
      getToken();

    }

    //ketika statrup aplikasi lakukan pengecekan token user
    checkLogin();

  }

})();
