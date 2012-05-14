
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
	}
	
}

window.TestBoardSuit = new TestBoard();
