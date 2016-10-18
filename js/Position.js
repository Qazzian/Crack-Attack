define(function (require) {
	'use strict';

	// some helper functions for dealing with Positions and co-ordinates
	var Position = {
		add: function (a, b) {
			return [a[0] + b[0], a[1] + b[1]];
		},
	};

	return Position;
});