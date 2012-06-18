
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
		b1.init();
		
		ok(b1.boardtag, "The board is there");
		ok(b1.container_tag, "The block container is there");
		b1.setBlockDims(40, 40);
		deepEqual(b1.getBlockDims(), {width:40, height: 40}, "Check setBlockDims and getBlockDims works");
		b1.resetAspectRatio();
		deepEqual(b1.getBlockDims(), {width:30, height:30}, "Check resetAspectRatio works. The height is fixed to 360px so all measurements should be based on this value.");
		
		
		
	}
}



window.testSuits = new TestBoard();
