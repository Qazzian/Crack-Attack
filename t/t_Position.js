import QUnit from 'steal-qunit';

import Position from 'js/Position';

'use strict';


QUnit.module('Position');

QUnit.test('Position basics', function (assert) {
	assert.ok(Position, 'Position is defined');

	assert.ok(Position.add, 'Has add function');
	var added = Position.add([2,4], [1,3]);
	assert.deepEqual(added, [3, 7], 'Added the coords correctly');

});