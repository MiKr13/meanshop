'use strict';

angular.module('meanshopApp')
  .factory('Products', ['$resource', function($resource) {

    return $resource('api/products/:id/:controller', null,
      {
        'update': {
          method: 'PUT'
        },
        'catalog': {
          method: 'GET',
          isArray: true,
          params: {
            controller: 'catalog'
          }
        },
        'search': {
          method: 'GET',
          isArray: true,
          params: {
            controller: 'search'
          }
        }
      });

  }]);
