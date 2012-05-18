/* This is the logic of the board and the placment of the blocks */
ca.BlockManager.prototype = {
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
	blockStates: {
		fresh: [], // just been created, Should not stay in this state long,
		turning: [], // being converted from garbage,
		falling: [], // what it says,
		rising: [], // Hidden beneath the fold and not yet ready for play.
		active: [], // ready to be used by the player,
		dying: [], // disappearing. Still takes up space,
		dead: [] // doesn't take up space and needs to be cleaned up
	},

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
		// Add empty rows.
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
					tempBlock.setPos(x, this.blocks[x].length);
					this.blocks[x].push(tempBlock);
				}
				continue;
			}
			var new_blocks = Math.randomInt(new_block_count -1, new_block_count +1);
			for(y=0; y<new_blocks; y++) {
					tempBlock = this.makeRandomBlock();
					tempBlock.setPos(x, this.blocks[x].length);
					this.blocks[x].push(tempBlock);
			}
		}
	},
	
	
	getBlock: function(x, y) {
		if (typeof x == 'object' && x.length == 2) {
			y = x[1];
			x = x[0];
		}
		return this.blocks[x][y];
	},

	/* Remove a given block's html from the board's DOM
	 * Returns success flag. */
	removeBlock : function(block_id){
		try {
			this.boardtag.remove("div#"+block_id);
		}
		catch (e) {
			return false;
		}
		return true;
	},
	
	add_row : function() {
		// Always adds to the bottom of the lists (unshift)
		// generate 6 randomly coloured blocks and add them to the bottom of each column.
		for (var i=0; i<this.columns; i++) {
			var the_block = this.makeRandomBlock();
			the_block.setPos(i, this.blocks[i].length);
			this.blocks[i].unshift(the_block);
		}
	},

	makeRandomBlock: function(){
		var random_num = Math.randomInt(this.probability_to_colour.length);
		var the_colour = this.probability_to_colour[random_num];

		var the_block = new ca.Block();
		the_block.init({colour : the_colour, block_manager: this, board: this.board});
		return the_block;
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

	isBlockFalling: function(block){
		/*get pos underneath
		 *if empty return row index where the block should fall to
		 *else if block underneath is falling
		 *	return that blocks row target +1
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
		return new this.iter(this);
	}
};

/* Iterates through all the visible positions.
 * calling next() can return null as well as a block. */
ca.BlockManager.prototype.iter = function(board){
	if (typeof board === 'undefined' ) {
		return new ca.BlockManager.prototype.iter(this);
	}
	
	this.board = board;

	// Start at -1 so that the first next() takes us to 0
	this.x = -1;
	this.y = board.underground_rows - 1;

	this.length = board.columns * board.visible_rows;
	this.index = -1;
};

ca.BlockManager.prototype.iter.prototype = {
	/* Returns the contents of the next board position or undefined. */
	next: function() {
		this.x = (this.x + 1) % this.board.columns;
		if (this.x == 0) { this.y++; }
		this.index ++;
		if (this.index >= this.length) {
			return undefined;
		}

		return this.board.getBlock(this.x, this.y);
	},
	
	hasNext: function() {
		return this.index < (this.length - 1);
	}
};

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

ca.Block.prototype = {
	id : 0,
	colour: '', /* can be 'grey', 'orange', '	yellow', 'green', 'blue', 'purple', 'black', 'white' */
	special: false,
	/* board array co-ords */
	arr_x:0,
	arr_y:0,
	/* css style position */
	dom_left:0,
	dom_top:0,
	$domobj: null,
	board: null,
	block_manager: null,
	STATES: {
		NULL: 0,		// Not part of the game yet.
		FRESH: 1,		// just been created, Should not stay in this state long,
		TURNING: 2,	// being converted from garbage,
		FALLING: 3,	// in free fall
		RISING: 4,		// Hidden beneath the fold and not yet ready for play.
		ACTIVE: 5,		// ready to be used by the player,
		DYING: 6,		// disappearing. Still takes up space,
		DEAD: 7		// doesn't take up space and can be cleaned up
	},
	
	state: null,

	/**
	 * Accepted parameters:
	 * colour - A named colour (required)
	 * special - boolean (default false)
	 * col - column index
	 * row - row index
	 */
	init: function(args){
		if (typeof(args) === 'object') {
			for (var key in args) {
				if (this[key] !== undefined) {
					this[key] = args[key];
				}
			}
		}
		this.id = ca.next_block_id++;
		this.state = 'new';
	},

	getCoords: function(){
		return [this.arr_x, this.arr_y];
	},
	
	setPos: function(x, y){
		this.arr_x = x;
		this.arr_y = y;
	},

	/* bottom_offset - number of pixels to add to the bottom row
	 * x - column number
	 * y - row number
	 */
	draw: function(arr_x, arr_y, bottom_offset) {
		//console.log("Painting block: ", this.id, " At ", this.arr_x, ", ", this.arr_y);
		var html = '<div id="block_' + this.id + '" class="block ' + this.colour + ' col_' + this.arr_x + ' row_'+this.arr_y+'">'+this.id+'</div>';
		this.$domobj = $(html);
		this.$domobj.data('ca_obj', this); // So we can get the ca object from the DOM tag
		return this.$domobj;
	},
	remove: function(){
		this.$domobj.remove();
		this.board = null;
		this.block_manager = null;
	},
	drop: function(toRow){
		// do drop
		// blockAbove.drop(toRow+1)
		this.state = falling;
		this.arr_y = toRow;

	}
};

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
ca.Position = {
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

