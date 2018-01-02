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
      Products.delete($scope.product);
      $state.go('products');
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
      Products.create($scope.product); // modeled in the view-form
      $state.go('products');
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
      Products.update($scope.product);
      $state.go('products');
    }
  }]);
