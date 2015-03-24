// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

angular.module('log', ['ionic', 'log.controllers', 'log.services', 'log.filters', 'ngCordova'])

.run(function($ionicPopup, $ionicPlatform, DB) {
  $ionicPlatform.ready(function() {
    console.log("$ionicPlatform.ready");
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
    // DB.init();
    // shows confirm popup if user press backbutton in android
    $ionicPlatform.registerBackButtonAction(function(e){

      var confirmPopup = $ionicPopup.confirm({
        title: 'Exit Confirm',
        template: 'Are you sure you want to Exit?'
      });
      confirmPopup.then(function(res) {
        if(res) {
          navigator.app.exitApp();
        } else {
          // console.log('You are not sure');
        }
      });
    }, 100);
    
  });
  
})

.config(function($stateProvider, $urlRouterProvider){
      

      // $state/route for different page
      $stateProvider
          /*menu*/
          .state('app', {

            abstract: true,
            url:"/app",
            templateUrl: "app/layout/menu-layout.html",
            
          })

          .state('app.home', {
            
            url: "/home",
            views: {
              'mainContent': {
                templateUrl: "app/home/home.html",
                controller: 'HomeCtrl'
              }
            },
            resolve: {
              dbReady: function(DB){
                console.log("dbReady");
                return DB.init().then(function(){
                  console.log("db is Ready");
                });
              }
            }
          })

          /*game*/
          .state('app.games', {
            // cache: false,
            url: "/games",
            views: {
              'mainContent': {
                templateUrl: "app/game/game.html",
                controller: 'GameListCtrl'
              }
            },
            
          })

          .state('app.game-detail', {
            url: "/game/:gameId",
            views: {
              'mainContent': {
                templateUrl: "app/game/game-detail.html",
                controller: 'GameListCtrl'
              }
            },
            
          })

          .state('app.game-edit', {
            url: "/game/edit/:gameId",
            views: {
              'mainContent': {
                templateUrl: "app/game/game-edit.html",
                controller: 'GameListCtrl'
              }
            },
            
          })
          /*scanner*/
          .state('app.scanner', {
            url: "/scanner",
            views: {
              'mainContent': {
                templateUrl: "app/barcodeScanner/barcodeScanner.html",
                controller: 'ScannerCtrl'
              }
            },
            
          })

          /*setting*/
          .state('app.setting', {
            url: "/setting",
            views: {
              'mainContent': {
                templateUrl: "app/setting/setting.html"
              }
            }
          });
          // if none of the above states are matched, use this as the fallback
      $urlRouterProvider.otherwise('/app/home');
    });
