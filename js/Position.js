define(function(require) {
	'use strict';

	// some helper functions for dealing with Positions and co-ordinates
	var Position = function(x, y) {
		};

	Position.prototype = {
		isPos: function(a) {
			return a.length && a.length ==2;
		},
		add: function(a, b) {
			return [a[0]+b[0], a[1]+b[1]];
		},
		subtract: function(a, b) {
			return [a[0]-b[0], a[1]-b[1]];
		}
	};


	return Position;
});