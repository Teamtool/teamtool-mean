'use strict';

angular.module('teamtoolApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'btford.socket-io',
  'ui.router',
  'ui.bootstrap',
  'validation.match',
  'ngAnimate',
  'angular-loading-bar'
])
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
    $urlRouterProvider
      .otherwise('/');

    $locationProvider.html5Mode(true);
    $httpProvider.interceptors.push('authInterceptor');
  })

  .service('TimerService', function($interval) {
    var promise;
    var timer = {seconds : 0, isRunning : false, progressBarActive : null, color : null, text : null};

    this.start = function (successSeconds, warningSeconds, maxSeconds) {
      timer.progressBarActive = true;
      timer.isRunning = true;
      promise = $interval(function () {
        timer.seconds++;
        if (timer.seconds <= successSeconds) {
          timer.color = 'success';

        } else if (timer.seconds > successSeconds && timer.seconds < warningSeconds) {
          timer.color = 'warning';
          timer.text = 'less than a minute';

        } else if (timer.seconds < maxSeconds) {
          timer.color = 'danger';
          timer.text = Math.floor(maxSeconds - timer.seconds) + ' seconds left';

        } else {
          timer.progressBarActive = false;
          timer.isRunning = false;
          timer.color = 'danger';
          timer.text = 'Time is up!';
          $interval.cancel(promise);
        }
      }, 1000);
    };

    this.reset = function() {
      timer.seconds = 0;
      timer.progressBarActive = false;
      timer.isRunning = false;
      timer.color = null;
      timer.text = null;
      $interval.cancel(promise);
    };

    this.getTimer = function() {
      return timer;
    };

    this.setTimerSeconds = function(seconds) {
      timer.seconds = seconds;
    };
  })

  .factory('authInterceptor', function ($rootScope, $q, $cookies, $location) {
    return {
      // Add authorization token to headers
      request: function (config) {
        config.headers = config.headers || {};
        if ($cookies.get('token')) {
          config.headers.Authorization = 'Bearer ' + $cookies.get('token');
        }
        return config;
      },

      // Intercept 401s and redirect you to login
      responseError: function(response) {
        if(response.status === 401) {
          $location.path('/login');
          // remove any stale tokens
          $cookies.remove('token');
          return $q.reject(response);
        }
        else {
          return $q.reject(response);
        }
      }
    };
  })

  .run(function ($rootScope, $location, Auth) {
    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$stateChangeStart', function (event, next) {
      Auth.isLoggedInAsync(function(loggedIn) {
        if (next.authenticate && !loggedIn) {
          $rootScope.originalUrl = next.url;
          $location.path('/login');
        }
      });
    });
  });
