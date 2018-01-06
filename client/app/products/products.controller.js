'use strict';

angular.module('meanshopApp')
  .controller('ProductsCtrl', ['$scope', 'Products', function($scope, Products) {

    /**
     * GET a list of products
     */
    $scope.products = Products.query();

  }])

  .controller('ProductViewCtrl', ['$scope', '$state', '$stateParams', 'Products', 
    function ($scope, $state, $stateParams, Products) {

    // target current product
    $scope.product = Products.get({id: $stateParams.id});
    console.log($scope.product);

    /**
     * DELETE a single product
     */ 
    $scope.deleteProduct = function(){
      Products.delete({id: $scope.product._id}, function(response) {
        $state.go('products');
      }, function(errorResponse) {
        $scope.errors = errorResponse.data.message;
      } );
    }
  }])

  .controller('ProductNewCtrl', ['$scope', '$state', 'Products', 
    function ($scope, $state, Products) {

    // create a new instance
    $scope.product = {}; 

    /**
     * CREATE a new product
     */
    $scope.addProduct = function(){
      Products.save($scope.product, function(response) {
        $state.go('products');
      }, function(errorResponse) {
        $scope.errors = errorResponse.data.message;
      }); // modeled in the view-form
    }
  }])

  .controller('ProductEditCtrl', ['$scope', '$state', '$stateParams', 'Products', 
    function ($scope, $state, $stateParams, Products) {

    // target current product
    $scope.product = Products.get({id: $stateParams.id});

    /**
     * UPDATE a single product
     */
    $scope.editProduct = function(){
      Products.update({id: $scope.product._id}, $scope.product, function(response) {
        $state.go('viewProduct', {id: response._id});
      }, function(errorResponse) {
        $scope.errors = errorResponse.data.message;
      });
    }
  }]);
