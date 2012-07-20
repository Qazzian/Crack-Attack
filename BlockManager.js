/*global ca, Backbone, _ */

// Possible states for the block.
ca.BLOCK_STATES = ['NULL', 'SWITCHING', 'FALLING', 'RISING', 'ACTIVE', 'DEAD'];

/* This is the logic of the board and the placment of the blocks */
ca.BlockManager = Backbone.Model.extend({
	blocks : [],
	
	colour_probabilities: {grey: 1, orange:5, yellow:5, green:5, blue:5, purple:5},
	total_colour_probablity: 0,
	total_probability: null,
	probability_to_colour: [],
		
	columns : 6, //blocks
	visible_rows : 12, // only the visible blocks.
	underground_rows : 3, // Number of rows to hide below the fold
	overground_rows: 12, // Number of rows hidden above the fold
	total_rows : null,
	
	has_resized: false,

	init: function(){
		var i, j, tArr = [];
		
		this.total_rows = this.underground_rows + this.visible_rows + this.overground_rows;
		console.log('probability_to_colour', _.isArray(this.probability_to_colour));
		// Calculate colour probabilities in advance
		for (i in this.colour_probabilities) { 
			
			if (this.colour_probabilities.hasOwnProperty(i)) {
				this.total_probability += this.colour_probabilities[i];
				console.log("calculating color " + i, typeof i, this.colour_probabilities[i], this.total_probability);
				for (j=0; j<this.colour_probabilities[i]; j++) {
					this.probability_to_colour.push(i);
					tArr.push(i);
				}
			}
		}
		this.probability_to_colour = tArr;
		this.probability_to_colour.shuffle();
		console.log('probability_to_colour: ', this.probability_to_colour);
		this.initBlocks();
		this.setup_random_start();
		ca.UIEventController.bind('switchBlocks', this.switchBlocks, this);
		this.bind('animationEnd', this.checkBlockState, this);
		
		return true;
	},
	
	initBlocks: function(){
		var x;
		this.blocks = [];
		for (x=0; x<this.columns; x++) {
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
			pos = [x, y];
		}
		return this.blocks[pos[0]][pos[1]];
	},

	add_row : function() {
		var the_block, i;
		// Always adds to the bottom of the lists (unshift)
		// generate 6 randomly coloured blocks and add them to the bottom of each column.
		for (i=0; i<this.columns; i++) {
			the_block = this.makeRandomBlock();
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
		return the_block;
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
	
	/**
	 * Cause the block at the given position to fall as far as it can.
	 * Alternativly, fall to the given end Position if you already know what it is
	 * @param {Array[2]} pos The Position of the block to start falling
	 * @param {Array[2]} endPos @optional The position the block should fall to (not implimented).
	 * @return {booliean} A flag to indicate if the animation started {true} or not {false}.
	 */
	dropBlock: function(pos){
		var block = this.getBlock(pos),
			col = this.blocks[pos[0]],
			currRow = pos[1], 
			currBlock, endRow, endPos;
		
		// Find the first none blank block
		try {
			do {
				currRow--;
				currBlock = this.getBlock([pos[0], currRow]);
				console.log("Check Block:", pos[0], currRow, currBlock);
			} while (currBlock.isBlank());
		}
		catch (e) {
			console.log("DropBlock Error", e, pos, currRow, currBlock);
			return false;
		}
			
		endRow = currRow + 1;
		
		if (endRow === pos[1]) {
			return false;
		}
		
		// TODO move the block to the new position
		col.splice(pos[1], 1);
		col.splice(endRow, 0, block);
		
		// TODO trigger the animation
		endPos = [pos[0], endRow];
		this.trigger('dropBlock', {start: pos, end: endPos, block: block});
			
		
	},

	/* The block has just been moved.
	 * See what state it is in now and call the related functons/events
	 * @param {Array[2]} endPos The final position of the block. */
	checkBlockState: function(endPos){
		var block = this.getBlock(endPos);
		// Used if endPos block is blank
		var i, blockAbove; 
		// Used if endPos block is not blank
		var blockBelow, group; 
		
		if (block.isBlank()) {
			//blocks above?
			console.log("Block is blank, Check for blocks above");
			i = 1; 
			blockAbove = this.getBlock(endPos[0], endPos[1]+i);
			while (blockAbove && !blockAbove.isBlank()) {
				this.dropBlock([endPos[0], endPos[1]+i]);
				i++;
				blockAbove = this.getBlock(endPos[0], endPos[1]+i);
			}
		}
		else {
			//falling
			blockBelow = this.getBlock(endPos[0], endPos[1] -1);
			console.log("Check block below: ", endPos, blockBelow);
			if (blockBelow && blockBelow.isBlank()) {
				this.dropBlock(endPos);
			}
			//makes a group
			else {
				group = this.checkForGroups(endPos);
			}
			
		}
	},

	/*
	 * Check if the given position belongs to a group.
	 */
	checkForGroups: function(startPos){
		var group = [];
		this.groupInRow(startPos, group);
		console.log('Current group: ', group);
		this.groupInCol(startPos, group);
		
		return group;
	},
	
	groupInRow: function(startPos, group) {
		var startBlock = this.getBlock(startPos),
			currCol = startPos[0],
			currBlock, tmpGroup = [startBlock];
		group = group || [];
		
		console.log('Check for Row group: ', startPos, startBlock);
		
		var diff = -1, carryOn = true;
		
		do {
			currCol += diff;
			try {
				currBlock = this.getBlock(currCol, startPos[1]);
				console.log("Check block ", currCol, startPos[1], currBlock);
				if (currBlock && currBlock.match(startBlock)) {
					tmpGroup.push(currBlock);
					continue;
				}
			} catch (e) { 
				// carry on
			}
			
			if (diff < 0) {
				diff = 1;
				currCol = startPos[0];
			}
			else {
				carryOn = false;
			}
		} while (carryOn);
		
		console.log('tmpGroup: ', tmpGroup);
		
		if (tmpGroup.length > 3) {
			group.push(tmpGroup.splice(0, tmpGroup.length));
		}
		return group;
	},
	
	groupInCol: function(startPos, group) {
		
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
				str += (j && !j.isBlank() ? j.id : '_') + ', ';
			});
			str += '\n';
		});
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
			return [this.x, this.y];
		}
		return null;
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
ca.Position = function(x, y) {
};

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
};

