'use strict';

/**
 * Create an enum object
 * @example
 *     var colourEnum = new Enum(['red', 'orange', 'yellow', 'green', 'blue', 'violet']);
 *     var LineColour = colourEnum['green'];
 *     console.log('LineColour is ' + colourEnum[LineColour]); // 'LineColour is green'
 *
 * @param names {array} - An array of strings. They will be enumerated in the order given
 */
export default function Enum(names) {
	var self = this;
	try {
		if (!isArray(names)) {
			throw "Enum instantiation error: Parameter must be an Array.";
		}

		var length = 0;

		forEach(names, function (name, index) {
			self[name] = index;
			self[index] = name;
			length++;
		});
		self.length = length;

	}
	catch (error) {
		console.log('Enum error: ', error, error.stack);
	}
};

var isArray = function (obj) {
		return typeof obj.length === 'number';
	};

var forEach = function (obj, callback) {
	"use strict";
	var i, length;
	if (isArray(obj)) {
		for (i = 0, length = obj.length; i < length; i++) {
			callback(obj[i], i, obj);
		}
	}
	return obj;
};