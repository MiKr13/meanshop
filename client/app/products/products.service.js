'use strict';

angular.module('meanshopApp')
  .factory('Products', [function () {

    var last_id = 5;

    // server-less storage in memory db
    // private array
    var example_products = [
      {_id: 1, title: 'Product 1', price: 123.45, quantity: 10, description: 'Lorem ipsum dolor sit amet'},
      {_id: 2, title: 'Product 2', price: 123.45, quantity: 10, description: 'Lorem ipsum dolor sit amet'},
      {_id: 3, title: 'Product 3', price: 123.45, quantity: 10, description: 'Lorem ipsum dolor sit amet'},
      {_id: 4, title: 'Product 4', price: 123.45, quantity: 10, description: 'Lorem ipsum dolor sit amet'},
      {_id: 5, title: 'Product 5', price: 123.45, quantity: 10, description: 'Lorem ipsum dolor sit amet'}
    ];

    // Public API here
    return {
      /**
       * GET a list of products
       * @return {array} Array of products (obj)
       */
      query: function() {
        return example_products;
      },
      /**
       * GET a single product
       * @param  {object} param {id: $stateParams.id}
       * @return {object} result.product -> Single product object
       */
      get: function(param) {
        var result = {};
        angular.forEach(example_products, function (product) {
          if(product._id == param.id) {
            return result = product;
          }
        });
        return result;
      },
      /**
       * DELETE a single user
       * @param {object} product $scope.product
       */
      delete: function(product){
        angular.forEach(example_products, function (item, index) {
          if(item._id == product._id){
            console.log(item, index);
            example_products.splice(index, 1);
            return;
          }
        });
      },
      /**
       * CREATE a new single product
       * @param {object} product $scope.product
       */
      create: function(product) {
        product._id = ++last_id;
        example_products.push(product);
      },
      /**
       * UPDATE a single product
       * @param  {object} product $scope.product
       * @return {bool}   true  if update is succesful
       *                  false if item is not found in db
       */
      update: function(product) {
        var item = this.get(product);

        if (!item) return false;

        item.title = product.title;
        item.price = product.price;
        item.quantity = product.quantity;
        item.description = product.description;

        return true;
      }

    }; // end return

  }]);
