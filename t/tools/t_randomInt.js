'use strict';

import QUnit from 'steal-qunit';
import randomInt from 'js/tools/randomInt';

QUnit.module('randomInt');
QUnit.test('randomInt basics', function (assert) {
	assert.ok(randomInt, 'randomInt is defined');
	assert.equal(typeof randomInt, 'function', 'randomInt is a function');
	var myInt = randomInt(10);
	assert.equal(typeof myInt, 'number', 'randomInt returns a number when given 1 parameter');
	assert.ok(0 <= myInt && myInt <= 10, 'number ' + myInt + ' should be lower than the parameter (10)');

	var myInt2 = randomInt(10, 20);
	assert.ok(10 <= myInt2 && myInt2 <= 20, 'accepts a lower and upper bound (10<' + myInt2 + '<20)');

	var negativeInt = randomInt(-10);
	assert.ok(-10 <= negativeInt && negativeInt <= 0, 'accepts negative numbers');
	var negativeInt2 = randomInt(-20, -10);
	assert.ok(-20 <= negativeInt2 && negativeInt2 <= -10, 'accepts 2 negative numbers (-20 < ' + negativeInt2 + ' < -10)');

	var withInterval = randomInt(20, 40, 2);
	assert.equal(withInterval%2, 0, 'deals with an interval between the ranges');

	// Visual check
	// assert.ok(analyseUniformity(10), 'manual uniformity check');

});

function analyseUniformity(limit) {
	var analysis = [];
	for (var i=limit; i > 0; i--) {
		analysis.push(0);
	}

	for (var j=0; j<(limit*limit*limit); j++) {
		analysis[randomInt(limit)]++;
	}
	return confirm("IS THIS UNIFORM?\n" + JSON.stringify(analysis));
}