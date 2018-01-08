'use strict';

angular.module('meanshopApp')
  .factory('Products', ['$resource', function($resource) {

    return $resource('api/products/:id', null,
      {
        'update': {
          method: 'PUT'
        }
      });

  }]);
