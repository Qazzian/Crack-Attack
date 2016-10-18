import QUnit from 'steal-qunit';

import {default as BlockManager} from 'js/BlockManager';


function TestBoard() {
	this.run(QUnit);
}

TestBoard.prototype = {

	run: function (QUnit) {
		var self = this;
		QUnit.module('Crack Attack Block Manager');
		for (var func in this) {
			if (func.match(/^test/)) {
				QUnit.test(func, self[func]);
			}
		}
	},

	testNew: function (assert) {
		assert.ok(BlockManager, 'BlockManager defined');
		assert.equal(typeof BlockManager, 'function', 'BlockManager is a constructor');
		var m1 = new BlockManager();
		assert.ok(m1, 'Can create an instance');
		assert.ok(m1.init(), 'Can initialise instance');
	},


	testIter: function (assert) {
		var bm = new BlockManager();
		bm.init();

		var iter = bm.getIter();
		console.log(iter);
		assert.ok(iter, "Block Manager can create an iter object")
		assert.ok(iter.length, 'Iter must report its length');

		var posCount = 0;
		assert.ok(iter.hasNext(), 'Must have a hasNext at the beginning');
		while (iter.hasNext()) {
			iter.next();
			posCount++;
		}
		assert.equal(posCount, iter.length, 'Calls to next must match length of iter');

		// Test that it works with blocks in the board
		bm.setup_random_start();
		var iter2 = bm.getIter();


	}

};

window.TestBoardSuit = new TestBoard();
