(function() {
  'use strict';

  angular
    .module('testo', ['ui.router', 'ui.bootstrap','datatables','ngResource'])
    .config(config);

  function config($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainController',
        controllerAs: 'main'
      });

    $urlRouterProvider.otherwise('/');
  }

})();
