"use strict";

angular.module('app', ['ngRoute', 'snake'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/game', {
                templateUrl: 'game/snake.html',
                controller: 'SnakeController'
            })
            .otherwise({redirectTo: '/game'});
    }]);