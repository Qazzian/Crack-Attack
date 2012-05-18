
function TestBoard(){
	this.run();
}

TestBoard.prototype = {

	run: function(){
		var self = this;
		module('Crack Attack Block Manager');
		for (var func in this) {
			if (func.match(/^test/)) {
				test(func, this, self[func]);
			}
		}
	},
	
	testNew: function(){
		var m1 = new ca.BlockManager();
		ok(m1);
		ok(m1.init());
	},
	

	testIter: function() {
		var board = new ca.BlockManager();
		board.init();

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

window.TestBoardSuit = new TestBoard();
