'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var Schema = mongoose.Schema;

var ProductSchema = new Schema({
  title: {
		type: String,
		required: true,
		trim: true
	},
  price: {
		type: Number,
		required: [ true, 'price is required' ],
		min: 0
	},
  description: String,
	stock: {
		type: Number,
		default: 1
	},
	imageBin: {
		data: Buffer,
		contentType: String
	},
	imageUrl: {
		type: String
	}
});

module.exports = mongoose.model('Product', ProductSchema);
