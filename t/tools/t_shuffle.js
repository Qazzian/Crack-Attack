import QUnit from 'steal-qunit';
import {default as shuffleArray} from 'js/tools/shuffle';

'use strict';

QUnit.module('shuffle');

QUnit.test('shuffle array', function(assert) {
    assert.expect(3);
    assert.ok(shuffleArray, 'shuffleArray is defined');

    var arr1 = [1,2,3,4,5,6,7,8,9];
    var arr1Shuffled = shuffleArray(arr1);
    console.log(arr1, arr1Shuffled);
    assert.notEqual(arr1, arr1Shuffled, 'shuffling works');
    assert.equal(arr1.length, 9, 'original array has not been modified');
});