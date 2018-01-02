'use strict';

angular.module('meanshopApp')
  .controller('MainCtrl', ['$scope', 'Products', function($scope, Products) {

    $scope.products = Products.query().slice(2);

  }]);
