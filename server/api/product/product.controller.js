/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/products              ->  index
 * POST    /api/products              ->  create
 * GET     /api/products/:id          ->  show
 * PUT     /api/products/:id          ->  update
 * DELETE  /api/products/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var Product = require('./product.model');
var path = require('path');
var Catalog = require('../catalog/catalog.model');

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

function responseWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function saveUpdates(updates) {
  return function(entity) {
    var updated = _.merge(entity, updates);
    return updated.saveAsync()
      .spread(function(updated) {
        return updated;
      });
  };
}

function removeEntity(res) {
  return function(entity) {
    if (entity) {
      return entity.removeAsync()
        .then(function() {
          res.status(204).end();
        });
    }
  };
}

function saveFile(res, file) {
	return function(entity) {
		var newPath = '/assets/uploads/' + path.basename(file.path);
		entity.imageUrl = newPath;
		return entity.saveAsync().spread(function(updated) {
			console.log(updated);
			return updated;
		});
	}
}

/**
 * Extract products in catalog
 * @param {Object} catalog Catalog retrieved in last promise
 * @return {Array} Product list
 */
function productsInCategory(catalog) {
	// Create array of catalog's ids
  var catalog_ids = [catalog._id].concat(catalog.children);
  return Product
    .find({'categories': { $in: catalog_ids } })
    .populate('categories')
    .exec();
}

// Gets a list of Products
exports.index = function(req, res) {
  Product.findAsync()
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// Gets a single Product from the DB
exports.show = function(req, res) {
  Product.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// Creates a new Product in the DB
exports.create = function(req, res) {
  Product.createAsync(req.body)
    .then(responseWithResult(res, 201))
    .catch(handleError(res));
};

// Updates an existing Product in the DB
exports.update = function(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Product.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// Deletes a Product from the DB
exports.destroy = function(req, res) {
  Product.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
};

// Uploads a new Product's image in the DB
exports.upload = function(req, res) {
	var file = req.files.file;
	if (!file) {
		return handleError(res)('File not provided');
	}

	Product.findByIdAsync(req.params.id)
		.then(handleEntityNotFound(res))
		.then(saveFile(res, file))
		.then(responseWithResult(res))
		.catch(handleError(res));
};

exports.catalog = function(req, res) {
  Catalog
		// find the category ID by the slug
    .findOne({ slug: req.params.slug }) 
    .execAsync()
		// find all the products that match category's ID of category's children
    .then(productsInCategory)           
    .then(responseWithResult(res))
    .catch(handleError(res));
};

exports.search = function(req, res) {
  Product
		// search in all fields which have text indexes
    .find({ $text: { $search: req.params.term }})
    .populate('categories')
    .execAsync()
    .then(responseWithResult(res))
    .catch(handleError(res));
};
