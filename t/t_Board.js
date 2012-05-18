
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
		ok(b1.init());
	},
}



window.testSuits = new TestBoard();
