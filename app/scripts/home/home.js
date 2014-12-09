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
    // var GenerateJob = $resource('http://localhost/api/generate-web-job');
    // GenerateJob.save()

    var Repos = $resource('/api/repo');
    var Repo = $resource('/api/repo/:id', null, {
        'update': { method:'PUT' }
    });

    $scope.hideSave = true
    $scope.repos = Repos.query(function() {
      $scope.hideSave = $scope.repos.length == 0;
    });


    $scope.addRepo = function() {
      var newRepo = new Repo()
      newRepo.type = $scope.addType;
      newRepo.url = $scope.addUrl;

      Repos.save(newRepo, function() {
        $scope.addType = "";
        $scope.addUrl = "";
        $scope.repos = Repos.query(function() {
          $scope.hideSave = $scope.repos.length == 0;
        });
      });
    };

    $scope.deleteRepo = function(id) {
      Repo.delete({id: id}, function() {
        $scope.repos = Repos.query(function() {
          $scope.hideSave = $scope.repos.length == 0;
        });
      });
    };

    $scope.saveRepo = function(id, type, url) {
      var saveRepo = new Repo()
      saveRepo.type = type;
      saveRepo.url = url;
      Repo.update({id: id}, saveRepo, function() {
        $scope.repos = Repos.query(function() {
          $scope.hideSave = $scope.repos.length == 0;
        });
      });
    };


    // $scope.repos = [
    //   {id: 0, type: "vcs", url: "http://foo.com"},
    //   {id: 1, type: "vcs", url: "http://bar.com"},
    //   {id: 2, type: "vcs", url: "http://baz.com"},
    // ];
  }]);
