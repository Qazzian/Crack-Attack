/**
 * Created by ian-wallis on 13/10/2016.
 */

'use strict';

import QUnit from 'steal-qunit';
import Enum from 'js/tools/Enum';

QUnit.module('Enum');

QUnit.test('Enum basics', function (assert) {
	assert.expect(7);
	assert.ok(Enum, 'Enum constructor defined');
	assert.equal(typeof Enum, 'function', 'Enum constructor is a function');

	var myEnum = new Enum([
		'Zero', 'One', 'Two'
	]);
	console.info('Enum: ', myEnum);
	assert.equal(myEnum[0], 'Zero', 'should create array indexes which point to the names');
	assert.equal(myEnum['Zero'], 0, 'should create key names which point to the array index');
	assert.equal(myEnum.length, 3, 'Should create a length attribute so we can iterate over the enum');
	var enum2 = new Enum(myEnum);
	assert.ok(enum2, 'Can create an enum from another enum or another array like object');
	assert.deepEqual(enum2, myEnum, 'The clone should be an actual clone');
});