
function TestBoard(){
	this.run();
}

TestBoard.prototype = {

	run: function(){
		var self = this;
		module('Crack Attack Board');
		for (var func in this) {
			if (func.match(/^test/)) {
				test(func, this, self[func]);
			}
		}
	},

	setupBoard: function(){
		var board = new ca.Board();
		board.initBlocks();
		return board;
	},
	teardown: function(){
		
	},
	
	testNew: function(){
		var b1 = new ca.Board();
		QUnit.has(b1, {columns:6, total_rows:27});
		b1.initBlocks();
		equal(b1.blocks.length, 6, "There should be 6 columns by default");
		ok(b1.setup_random_start(), "Fill the board with random blocks");
	},
	

	testIter: function() {
		var board = this.setupBoard();
//		board.init();

		var iter = board.getIter();
		ok(iter.length, 'Iter must report its length');
		
		var posCount = 0;
		ok(iter.hasNext(), 'Must have a hasNext at the beginning');
		while (iter.hasNext()) {
			iter.next();
			posCount++;
		}
		equal(posCount, iter.length, 'Calls to next must match length of iter');
		
		// Test that it works with blocks in the board
		board.setup_random_start();
		var iter2 = board.getIter();
		

	}
}



window.testSuits = new TestBoard();
