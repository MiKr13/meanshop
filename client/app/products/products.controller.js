'use strict';

angular.module('meanshopApp')
  .controller('ProductsCtrl', ['$scope', 'Products', function($scope, Products) {

    /**
     * GET a list of products
     */
    $scope.products = Products.query();

		$scope.$on('search:term', function(event, data) {
			if (data.length) {
				$scope.products = Products.search({id: data});
        $scope.query = data;
			} else {
				$scope.products = Products.query();
        $scope.query = '';
			}
		});

  }])

	.controller('ProductCatalogCtrl', ['$scope', '$stateParams', 'Products', function($scope, $stateParams, Products) {
		$scope.products = Products.catalog({id: $stateParams.slug});
    $scope.query = $stateParams.slug;
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
        $scope.errors = errorResponse;
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
        $scope.errors = errorResponse;
      }); // modeled in the view-form
    }
  }])

  .controller('ProductEditCtrl', ['$scope', '$state', '$stateParams', 'Products', 
		'Upload', '$timeout',
    function ($scope, $state, $stateParams, Products, Upload, $timeout) {

    // target current product
    $scope.product = Products.get({id: $stateParams.id});

    /**
     * UPDATE a single product
     */
    $scope.editProduct = function(){
      Products.update({id: $scope.product._id}, $scope.product, function(response) {
				$state.go('viewProduct', {id: response._id});
			}, function(errorResponse) {
				$scope.errors = errorResponse;
      });
    };

		/**
		 * UPLOAD image action
		 */
		$scope.upload = uploadHander($scope, Upload, $timeout);

  }])

	/**
	 * Request path to request a braintree client token
	 */
  .constant('clientTokenPath', '/api/braintree/client_token')

	.controller('ProductCheckoutCtrl', ['$scope', '$http', '$state', 'ngCart', 
		function($scope, $http, $state, ngCart) {

		$scope.errors = '';

		$scope.paymentOptions = {
			/**
			 * Callback if card/paypal information gets authorization from bt servers
			 * @param {Object} payload Object used to execute the payment in NodeJS side	
			 *
			 * payload is conformed by: nonce, details [], cardType, and type properties
			*/
			onPaymentMethodReceived: function(payload) {

				/**
				 * Serialize the shoopping cart and add/merge it to payload object
				 * ngCart includes: items [], shipping, subTotal, tax, taxRate, total, and totalCost properties
				 */				
				angular.merge(payload, ngCart.toObject());
				payload.total = payload.totalCost;
				console.error(payload);

				/**
				 * Create/send an order to the server	
 				*/
				$http.post('/api/order', payload)
				// if backend was able to collect the payment
					.then(function success () {
						ngCart.empty(true);
						$state.go('products');
					}, function error (res) {
						$scope.errors = res;
					});
			}
		};

	}]);

var uploadHander = function ($scope, Upload, $timeout) {
	/**
	 * Upload image file
	 * @param {object} file Image file selected or dragged from view : $file
	 */
	return function(file) {
		if (file && !file.$error) {

			// make file avaiable in to the view for preview
			$scope.file = file;

			// Promise: to return the uploaded file
			file.upload = Upload.upload({
				url: '/api/products/' + $scope.product._id + '/upload', // POST request
				file: file
			});

			file.upload.then(function (response) {
				$timeout(function () {
					file.result = response.data;
				});
			}, function (response) {
				if (response.status > 0){
					console.log(response.status + ': ' + response.data);
					$scope.errors = response.status + ': ' + response.data;
				}
			});

			file.upload.progress(function (evt) {
				file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
			});
		}
	};
};

