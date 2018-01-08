/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var User    = require('../api/user/user.model');
var Product = require('../api/product/product.model');

User.find({}).removeAsync()
  .then(function() {
    User.createAsync({
      provider: 'local',
      name: 'Test User',
      email: 'test@test.com',
      password: 'test'
    }, {
      provider: 'local',
      role: 'admin',
      name: 'Admin',
      email: 'admin@admin.com',
      password: 'admin'
    })
    .then(function() {
      console.log('finished populating users');
    });
  });

Product.find({}).removeAsync()
  .then(function() {
    Product.createAsync({
      title: 'Camiseta gris banderas',
      imageUrl: '/assets/uploads/1.jpg',
      price: 35000,
      stock: 250,
      description: '100% ALGODON ESTAMPACION'
    }, {
      title: 'Camiseta azul texto',
      imageUrl: '/assets/uploads/2.jpg',
      price: 35000,
      stock: 100,
      description: '100% ALGODON ESTAMPACION'
    }, {
      title: 'Camiseta marfil flores',
      imageUrl: '/assets/uploads/3.jpg',
      price: 30000,
      stock: 50,
      description: '100% ALGODON ESTAMPACION'
    }, {
      title: 'Camiseta blanco texto',
      imageUrl: '/assets/uploads/4.jpg',
      price: 31000,
      stock: 250,
      description: '100% ALGODON ESTAMPACION'
    }, {
      title: 'Camiseta blanco flores',
      imageUrl: '/assets/uploads/5.jpg',
      price: 29000,
      stock: 100,
      description: '100% ALGODON ESTAMPACION'
    }, {
      title: 'Camiseta azul flores',
      imageUrl: '/assets/uploads/6.jpg',
      price: 38000,
      stock: 50,
      description: '100% ALGODON ESTAMPACION'
    }, {
      title: 'Camiseta gris numeros',
      imageUrl: '/assets/uploads/7.jpg',
      price: 33000,
      stock: 250,
      description: '100% ALGODON ESTAMPACION'
    }, {
      title: 'Camiseta azul bloques',
      imageUrl: '/assets/uploads/8.jpg',
      price: 35000,
      stock: 100,
      description: '100% ALGODON ESTAMPACION'
    }, {
      title: 'Camiseta amarillo texto',
      imageUrl: '/assets/uploads/9.jpg',
      price: 40000,
      stock: 50,
      description: '100% ALGODON ESTAMPACION'
    })
  .then(function() {
    console.log('finished populating products');
  });
});
