import QUnit from 'steal-qunit';
import Board from 'js/Board';

function TestBoard() {
	this.run();
}

TestBoard.prototype = {

	run: function () {
		var self = this;
		QUnit.module('Crack Attack Board');
		for (var func in this) {
			if (func.match(/^test/)) {
				QUnit.test(func, self[func]);
			}
		}
	},

	setupBoard: function () {
		var board = new Board();
		board.initBlocks();
		return board;
	},
	teardown: function () {

	},

	testNew: function (assert) {
		var b1 = new Board();
		b1.init();

		assert.ok(b1.boardtag, "The board is there");
		assert.ok(b1.container_tag, "The block container is there");
		b1.setBlockDims(40, 40);
		assert.deepEqual(b1.getBlockDims(), {width: 40, height: 40}, "Check setBlockDims and getBlockDims works");
		b1.resetAspectRatio();
		assert.deepEqual(b1.getBlockDims(), {
			width: 30,
			height: 30
		}, "Check resetAspectRatio works. The height is fixed to 360px so all measurements should be based on this value.");


	}
};


window.testSuits = new TestBoard();
