// Possible states for the block.

ca.BLOCK_STATES = ['NULL', 'SWITCHING', 'FALLING', 'RISING', 'ACTIVE', 'DEAD'];

/* This is the logic of the board and the placment of the blocks */
ca.BlockManager = Backbone.Model.extend({
	blocks : [],
	
	colour_probababilities: {grey: 1, orange:4, 	yellow:4, green:4, blue:4, purple:4},
	total_colour_probablity: 0,
	probability_to_colour: [],
		
	columns : 6, //blocks
	visible_rows : 12, // only the visible blocks.
	underground_rows : 3, // Number of rows to hide below the fold
	overground_rows: 12, // Number of rows hidden above the fold
	total_rows : null,
	
	has_resized: false,

	init: function(){
		this.total_rows = this.underground_rows + this.visible_rows + this.overground_rows
		// Calculate colour probabilities in advance
		for (var i in this.colour_probababilities) {
			this.total_probablity += this.colour_probababilities[i];
			for (var j=0; j<this.colour_probababilities[i]; j++) {
				this.probability_to_colour.push(i);
			}
		}
		this.probability_to_colour.shuffle();
		this.initBlocks();
		this.setup_random_start();
		ca.UIEventController.bind('switchBlocks', this.switchBlocks, this);
		return true;
	},
	
	initBlocks: function(){
		this.blocks = [];
		for (var x=0; x<this.columns; x++) {
			this.blocks[x] = [];
		}
	},

	setup_random_start : function(){
		// Set up 3 hidden rows and one complete visible row
		var start_full_rows = this.underground_rows + 1;
		var x, y;
		// Add full rows.
		for (x = 0; x < start_full_rows; x++) {
			this.add_row();
		}
		// pick a random column. this will be empty from row 1 up.
		var empty_col = Math.randomInt(this.columns -1);
		var new_block_count = this.visible_rows / 2;
		var tempBlock;
		// for each of the other columns fill to row 6-8
		for (x=0; x<this.columns; x++) {
			if (x == empty_col) {
				if (Math.random() > 0.80) { // Sometimes add an extra block to the empty col
					tempBlock = this.makeRandomBlock();
					tempBlock.setState('ACTIVE');
					this.blocks[x].push(tempBlock);
				}
			}
			else {
				var new_blocks = Math.randomInt(new_block_count -1, new_block_count +1);
				for(y=0; y<new_blocks; y++) {
						tempBlock = this.makeRandomBlock();
						this.blocks[x].push(tempBlock);
				}
			}
			// Fill the rest of the column with placeholder blocks
			while (this.blocks[x].length < this.total_rows) {
				this.blocks[x].push(this.makePlaceHolder());
			}
		}
	},
	
	
	getBlock: function(x, y) {
		var pos;
		
		if (_.isArray(x) && x.length == 2) {
			pos = x;
		}
		else {
			pos = [x, y]
		}
		return this.blocks[pos[0]][pos[1]];
	},

	add_row : function() {
		// Always adds to the bottom of the lists (unshift)
		// generate 6 randomly coloured blocks and add them to the bottom of each column.
		for (var i=0; i<this.columns; i++) {
			var the_block = this.makeRandomBlock();
			the_block.setState('RISING');
			this.blocks[i].unshift(the_block);
		}
	},

	makeRandomBlock: function(){
		var random_num = Math.randomInt(this.probability_to_colour.length);
		var the_colour = this.probability_to_colour[random_num];

		var the_block = new ca.Block();
		the_block.init({colour : the_colour});
		return the_block;
	},
	
	// Placeholders needed while animations end etc.
	makePlaceHolder: function(){
		var the_block = new ca.Block();
		the_block.init({colour : 'blank'});
	},

	/**
	 * Swaps the block positions.
	 **/
	switchBlocks: function(eventData) {
		var blocks = this.blocks,
		
			pos1 = eventData[0],
			pos2 = eventData[1],
			
			b1 = this.getBlock(eventData[0]),
			b2 = this.getBlock(eventData[1]);

		if (b2){
			blocks[pos1[0]][pos1[1]] = b2;
			b2.arr_x = pos1[0];
			b2.arr_y = pos1[1];
		}
		else {
			blocks[pos1[0]][pos1[1]] = this.makePlaceHolder();
		}
		if (b1) {
			blocks[pos2[0]][pos2[1]] = b1;
			b1.arr_x = pos2[0];
			b1.arr_y = pos2[1];
		}
		else {
			blocks[pos2[0]][pos2[1]] = this.makePlaceHolder();
		}
		
		this.trigger('switchBlocks', [pos1, pos2]);
	},

	/* The block has just been moved.
	 * See what state it is in now */
	checkBlockState: function(block){
		if (this.isBlockFalling(block)){
			var toRow = 3;
			block.drop(toRow);
		}
		/*isFalling? start Falling event.
		 * isInAGroup? start destruction event with group.
		 */
	},

	// recursive function
	checkForGroups: function(startBlock){
		var startPos = [startBlock.arr_x, startBlock.arr_y];
		var group = [];
		/* for each block around the start block
		 *	if colors match add this to group 
		 *	keep checking with the new block
		 */
		return group;
	},

	/**
	 * Called when the next row becomes playable
	 */
	rowUp: function(){

	},

	getIter: function(){
		return this.iter();
	},
	
	toString: function(){
		var str = "";
		_.each(this.blocks, function(i){
			_.each(i, function(j){
				str += (j ? j.id : '_') + ', ';
			})
			str += '\n';
		})
		return str;
	}
});

/* Iterates through all the visible positions.
 * calling next() can return null as well as a block. 
 * 
 * @param board - The 2d array of block objects */
ca.BlockManager.prototype.iter = function(board, length){
	if (typeof board === 'undefined' ) {
		return new ca.BlockManager.prototype.iter(this.blocks, this.blocks.length * this.total_rows);
	}
	
	this.board = board;

	// Start at -1 so that the first next() takes us to 0
	this.x = -1;
	this.y = -1;

	this.length = length;
	this.index = -1;
};

ca.BlockManager.prototype.iter.prototype = {
	
	/* @return the contents of the next board position. 
	 * Bare in mind that the location can be empty so this might return null. */
	next: function() {
		this.x = (this.x + 1) % this.board.length;
		if (this.x == 0) { this.y++; }
		this.index ++;
		if (this.index >= this.length) {
			return undefined;
		}

		return this.board[this.x][this.y];
	},
	
	/* @return true if there are more blocks to return, false otherwise. */
	hasNext: function() {
		return this.index < (this.length - 1);
	},
	
	/* @returns array [x, y] of the co-ordinates of the most recently returned block 
	 *  or null if next() has not been called yet or called too many times. */
	currentPos: function(){
		if (this.index >= 0 && this.index < this.length) {
			return [this.x, this.y]
		}
		return null
	}
};

/* Iterates around the chosen block. 
 * The length of this iterator can change depending on the block to iterate around. 
 * e.g. if the target is on the edge. */
ca.BlockManager.prototype.iterRoundBlock = function(board, block) {
	this.board = board;
	this.targetPos = block.getCoords();
	this.index = -1;
};

ca.BlockManager.prototype.iterRoundBlock.prototype = {
	positions: [[0,1], [1,0], [0,-1], [-1,0]],
	length: 4,

	next: function(){
		this.index++;
		var newPos = ca.Position.add(this.targetPos, this.positions[this.index]);

		if (!this.board.isPosVisible(newPos)) {
			return this.hasNext() ? this.next() : null;
		}

		var block = this.board.getBlock(newPos[0], newPos[1]);
		return block.state == ca.Block.STATES.ACTIVE ? block : null;
	},

	hasNext: function(){
		return this.index < this.positions.length;
	}

}

ca.Garbage.prototype = {
	id : 0,
	image : 0,
	special : 0,
	width : 0,
	height : 0,
	x : 0,
	y : 0,

	draw : function() {

	}

};

// some helper functions for dealing with Positions and co-ordinates
ca.Position = function(x, y) {
}
ca.Position.prototype = {
	isPos: function(a) {
		return a.length && a.length ==2;
	},
	add: function(a, b) {
		return [a[0]+b[0], a[1]+b[1]];
	},
	subtract: function(a, b) {
		return [a[0]-b[0], a[1]-b[1]];
	}
}

