'use strict';

angular
  .module('satis.home', [
    'ngResource',
    'ngRoute',
    'ui.router'
  ])
  .config(['$stateProvider', function($stateProvider) {

      var home = {
          name: 'app.home',
          url: '/',
          views: {
            '@': {
              templateUrl: 'views/home.html',
              controller: 'HomeController'
            }
          }
      };

      $stateProvider.state(home);

  }])
  .controller('HomeController', ['$scope', '$resource', function ($scope, $resource) {
    console.log('home');
    $scope.hideSave = true;
    $scope.alerts = [];


    var Repos = $resource('/api/repo');
    var Repo = $resource('/api/repo/:id', null, {
        'update': { method:'PUT' }
    });

    $scope.repos = Repos.query(function() {
      $scope.hideSave = $scope.repos.length === 0;
    });


    $scope.addRepo = function() {
      var newRepo = new Repo();
      newRepo.type = $scope.addType;
      newRepo.url = $scope.addUrl;
      if (newRepo.type === '' || newRepo.url === '' || newRepo.type === undefined || newRepo.url === undefined) {
        $scope.alerts.push({type: 'warning', value:'All fields must be filled out to add a repository'});
        return;
      }

      Repos.save(newRepo, function() {
        $scope.addType = '';
        $scope.addUrl = '';
        $scope.repos = Repos.query(function() {
          $scope.hideSave = $scope.repos.length === 0;
        });
      }, function(error) {
        if (error.status === 409) {
          $scope.alerts.push({type: 'danger', value:'A Repository with that Url Already Exists'});
        }
      });
    };

    $scope.deleteRepo = function(id) {
      if (confirm("Are you sure you want to delete this repo?")) {
        Repo.delete({id: id}, function() {
          $scope.repos = Repos.query(function() {
            $scope.hideSave = $scope.repos.length === 0;
          });
        });
      }
    };

    $scope.saveRepo = function(id, type, url) {
      var saveRepo = new Repo();
      saveRepo.type = type;
      saveRepo.url = url;
      if (saveRepo.type === '' || saveRepo.url === '' || saveRepo.type === undefined || saveRepo.url === undefined) {
        $scope.alerts.push({type: 'warning', value:'All fields must be filled out to save a repository'});
        return;
      }

      Repo.update({id: id}, saveRepo, function() {
        $scope.repos = Repos.query(function() {
          $scope.hideSave = $scope.repos.length === 0;
        });
      });
    };

  }])
  .directive('myAlert', ['$timeout', function($timeout){
    return {
      restrict: 'E',
      replace: true,
      scope: {
        ngModel: '='
      },
      template: '<div class="alert alert-{{ngModel.type}}" role="alert">{{ngModel.value}}</div>',
      link: function(scope, element){
        $timeout(function(){
          element.remove();
        }, 5000);
      }
    };
  }]);

