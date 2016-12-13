/*global ca, Backbone, _ */

import Backbone from 'backbone';
import randomInt from 'js/tools/randomInt';
import shuffleArray from 'js/tools/shuffle';
import Enum from 'js/tools/Enum';

import Block from 'js/Block';
import BLOCK_STATES from 'js/BlockStates';
import Position from 'js/Position';
import UIEventController from 'js/EventController';

var BlockManager = Backbone.Model.extend({
	blocks: [],

	colour_probabilities: {grey: 1, orange: 5, yellow: 5, green: 5, blue: 5, purple: 5},
	total_probability: 0,
	probability_to_colour: [],

	columns: 6, //blocks
	visible_rows: 12, // only the visible blocks.
	undergroundRows: 3, // Number of rows to hide below the fold
	overgroundRows: 12, // Number of rows hidden above the fold
	total_rows: null,

	has_resized: false,

	init: function () {
		var i, j, tArr = [];

		this.total_rows = this.undergroundRows + this.visible_rows + this.overgroundRows;
		// Calculate colour probabilities in advance
		for (i in this.colour_probabilities) {

			if (this.colour_probabilities.hasOwnProperty(i)) {
				this.total_probability += this.colour_probabilities[i];
				for (j = 0; j < this.colour_probabilities[i]; j++) {
					this.probability_to_colour.push(i);
					tArr.push(i);
				}
			}
		}
		this.probability_to_colour = shuffleArray(tArr);
		this.initBlocks();
		this.setup_random_start();
		UIEventController.bind('switchBlocks', this.switchBlocks, this);
		this.bind('animationEnd', this.checkBlockState, this);

		return true;
	},

	destroy: function() {
		UIEventController.unbind('switchBlocks');
		Backbone.Model.prototype.unbind.call(this);
	},

	initBlocks: function () {
		var x;
		this.blocks = [];
		for (x = 0; x < this.columns; x++) {
			this.blocks[x] = [];
		}
	},

	// TODO extract this into a board populator module
	// That way we can inject test populators into this module
	setup_random_start: function () {
		// Set up 3 hidden rows and one complete visible row
		var start_full_rows = this.undergroundRows + 1;
		var x, y;
		// Add full rows.
		for (x = 0; x < start_full_rows; x++) {
			this.add_row();
		}
		// pick a random column. this will be empty from row 1 up.
		var empty_col = randomInt(this.columns - 1);
		var new_block_count = this.visible_rows / 2;
		var tempBlock;
		// for each of the other columns fill to row 6-8
		for (x = 0; x < this.columns; x++) {
			if (x == empty_col) {
				if (Math.random() > 0.80) { // Sometimes add an extra block to the empty col
					tempBlock = this.makeRandomBlock();
					tempBlock.setState('ACTIVE');
					this.blocks[x].push(tempBlock);
				}
			}
			else {
				var new_blocks = randomInt(new_block_count - 1, new_block_count + 1);
				for (y = 0; y < new_blocks; y++) {
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


	getBlock: function (x, y) {
		var pos;

		if (_.isArray(x) && x.length == 2) {
			pos = x;
		}
		else {
			pos = [x, y];
		}
		return this.blocks[pos[0]][pos[1]];
	},

	getBlockById: function (id) {
		var iter = this.getIter();
		var block;

		while (iter.hasNext()) {
			block = iter.next();
			if (block.id == id) {
				return block;
			}
		}

		return;
	},

	getBlocksById: function (list) {
		if (!_.isArray(list)) {
			throw new Error("getBlocksById: must supply an array of ID's");
		}

		var blocks = [];
		_.each(list, function (id) {
			blocks.push(this.getBlockById(id));
		}, this);

		return blocks;
	},

	/**
	 * Make sure the block has the correct position set before using it.
	 * @param {Block} block - The block to check and update
	 * @return {Block} reference to the given block
	 * */
	updateBlockPosition: function (block) {
		var testBlock, testPos = block.getPos();

		if (_.isArray(testPos)) {
			testBlock = this.getBlock(testPos);
			if (testBlock.id === block.id) {
				return block;
			}
		}


		var iter = this.getIter();
		while (iter.hasNext()) {
			testBlock = iter.next();
			if (block.id == testBlock.id) {
				block.setPos(iter.currentPos());
				return block;
			}
		}

		var error = new Error("BlockManager.updateBlockPosition Error: Block not found");
		error.block = block;
		throw error;
	},

	/**
	 * Return a block only if the position is in the visible area.
	 *
	 * @param pos {Array[2]} - x, y co-ords
	 */
	getVisibleBlock: function (pos) {
		if (!_.isArray(pos)) {
			throw 'Error: getVisibleBlock requires a Position object';
		}
		if (pos[0] >= 0 && pos[0] <= this.columns
			&& pos[1] >= this.undergroundRows && pos[1] <= (this.undergroundRows + this.overgroundRows)
		) {
			return this.getBlock(pos);
		}
		return null;
	},

	add_row: function () {
		var the_block, i;
		// Always adds to the bottom of the lists (unshift)
		// generate 6 randomly coloured blocks and add them to the bottom of each column.
		for (i = 0; i < this.columns; i++) {
			the_block = this.makeRandomBlock();
			the_block.setState('RISING');
			this.blocks[i].unshift(the_block);
		}
	},

	// TODO Extract into another module
	makeRandomBlock: function () {
		var random_num = randomInt(this.probability_to_colour.length - 1);
		var the_colour = this.probability_to_colour[random_num];

		var the_block = new Block();
		the_block.init({colour: the_colour});
		if (the_colour === undefined) {
			console.warn("Created an undefined colour: ", the_colour, random_num, the_block);
		}
		return the_block;
	},

	// Placeholders needed while animations end etc.
	makePlaceHolder: function () {
		var the_block = new Block();
		the_block.init({colour: 'blank'});
		return the_block;
	},

	/**
	 * Remove the block at the given position.
	 * Returns the block that just been removed, just in case you need it again.
	 * */
	deleteBlock: function (blocks) {
		if (!_.isArray(blocks)) {
			blocks = [blocks];
		}

		var i, l, old, pos;
		for (i = 0, l = blocks.length; i < l; i++) {
			pos = this.updateBlockPosition(blocks[i]).getPos();
			this.blocks[pos[0]][pos[1]] = this.makePlaceHolder();
		}
		this.trigger('blockDeleted', this.getPositions(blocks));
		return blocks;
	},

	getPositions: function (blocks) {
		var positions = [];

		if (!_.isArray(blocks)) {
			blocks = [blocks];
		}

		_.each(blocks, function (block) {
			positions.push(block.getPos())
		})

		return positions;
	},

	/**
	 * Swaps the block positions.
	 **/
	switchBlocks: function (eventData) {
		var blocks = this.blocks,

			pos1 = eventData[0],
			pos2 = eventData[1],

			b1 = this.getBlock(eventData[0]),
			b2 = this.getBlock(eventData[1]);

		if (b2) {
			blocks[pos1[0]][pos1[1]] = b2;
			b2.setPos(pos1);
		}
		else {
			blocks[pos1[0]][pos1[1]] = this.makePlaceHolder();
		}
		if (b1) {
			blocks[pos2[0]][pos2[1]] = b1;
			b1.setPos(pos2);
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
	dropBlock: function (pos) {
		var block = this.getBlock(pos),
			col = this.blocks[pos[0]],
			currRow = pos[1],
			currBlock, endRow, endPos;

		// Find the first none blank block
		try {
			do {
				currRow--;
				currBlock = this.getBlock([pos[0], currRow]);
			} while (currBlock.isBlank());
		}
		catch (e) {
			console.error("DropBlock Error", e, pos, currRow, currBlock);
			return false;
		}

		endRow = currRow + 1;

		if (endRow === pos[1]) {
			return false;
		}

		block.setState('FALLING');
		col.splice(pos[1], 1);
		col.splice(endRow, 0, block);

		endPos = [pos[0], endRow];
		this.trigger('dropBlock', {start: pos, end: endPos, block: block});


	},

	/* The block has just been moved.
	 * See what state it is in now and call the related functons/events
	 * TODO Events caused by previous blocks being removed need to be chained to calculate score multipliyers
	 * @param {Array[2]} endPos The final position of the block. */
	checkBlockState: function (endPos) {
		var block = this.getBlock(endPos);
		// Used if endPos block is blank
		var i, blockAbove;
		// Used if endPos block is not blank
		var blockBelow, theGroup;
		console.log("checkBlockState: \n", this.toString(), block);

		if (block.isBlank()) {
			//blocks above?
			console.log("Block is blank, Check for blocks above");
			i = 1;
			blockAbove = this.getBlock(endPos[0], endPos[1] + i);
			while (blockAbove && !blockAbove.isBlank()) {
				this.dropBlock([endPos[0], endPos[1] + i]);
				i++;
				blockAbove = this.getBlock(endPos[0], endPos[1] + i);
			}
		}
		else {
			// First clear the a state that caused an animation that is now finished
			if (!block.isAnimating) {
				if ([BLOCK_STATES['SWITCHING'], BLOCK_STATES['FALLING'], BLOCK_STATES['ACTIVATING']].indexOf(block.state) > -1) {
					block.setState('ACTIVE');
				}
				else if (block.state === BLOCK_STATES['REMOVING']) {
					this.deleteBlock(block);
				}
			}

			// Now check the position of the block in relation to is surroundings
			if (block.state === BLOCK_STATES['ACTIVE']) {
				//falling
				blockBelow = this.getBlock(endPos[0], endPos[1] - 1);
				console.log("Check block below: ", endPos, blockBelow);
				if (blockBelow && blockBelow.isBlank()) {
					this.dropBlock(endPos);
				}
				//makes a group
				else {
					theGroup = this.checkForGroups(endPos);
					console.log('BlockState group: ', theGroup);
					if (theGroup.length > 0) {
						this.removeBlockGroup(theGroup);
					}
				}
			}
		}
	},

	/*
	 * Check if the given position belongs to a group.
	 */
	checkForGroups: function (startPos) {
		var rowGroup = this.groupInRow(startPos);
		var colGroup = this.groupInCol(startPos);
		//console.log('Final group: ', rowGroup, colGroup);

		// Don't know why, but calling concat on an array reference instead of an object generated here does not work.
		// e.g. rowGroup.concat(colGroup)
		var joindGroup = [].concat(rowGroup, colGroup);
		console.log(joindGroup);
		return joindGroup;
	},

	groupInRow: function (startPos) {
		var startBlock = this.getVisibleBlock(startPos),
			currCol = startPos[0],
			currBlock, tmpGroup = [startBlock];

		console.log('Check for Row group: ', startPos, startBlock.id);

		var diff = -1, carryOn = true;

		do {
			currCol += diff;
			try {
				console.log("Check block ", currCol, startPos[1]);
				currBlock = this.getVisibleBlock([currCol, startPos[1]]);

				if (currBlock && currBlock.match(startBlock)) {
					tmpGroup.push(currBlock);
					currBlock.setPos(currCol, startPos[1]);
					continue;
				}
			} catch (e) {
				// carry on
				console.log('Block check error: ', e);
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

		if (tmpGroup.length >= 3) {
			return tmpGroup;
		}
		return [];
	},

	groupInCol: function (startPos) {

		var startBlock = this.getVisibleBlock(startPos),
			currRow = startPos[1],
			currBlock, tmpGroup = [startBlock];

		console.log('Check for Col group: ', startPos, startBlock.id);

		var diff = -1, carryOn = true;

		do {
			currRow += diff;
			try {
				currBlock = this.getVisibleBlock([startPos[0], currRow]);
				console.log("Check block ", startPos[0], currRow, currBlock.id);
				if (currBlock && currBlock.match(startBlock)) {
					tmpGroup.push(currBlock);
					currBlock.setPos(startPos[0], currRow);
					continue;
				}
			} catch (e) {
				// carry on
				console.log('Block check error: ', e);
			}

			if (diff < 0) {
				diff = 1;
				currRow = startPos[1];
			}
			else {
				carryOn = false;
			}
		} while (carryOn);

		console.log('tmpGroup: ', tmpGroup);

		if (tmpGroup.length >= 3) {
			return tmpGroup;
		}
		return [];
	},

	/**
	 * remove the given group of blocks
	 */
	removeBlockGroup: function (theGroup) {
		var self = this,
			groupSize = theGroup.length,
			removed = 0;

		var onAllRemoved = function () {
			removed++;
			console.log('removed ' + removed + ' of ' + groupSize);
			if (removed === groupSize) {
				console.log('Removed all of the group');
				self.deleteBlock(theGroup);
				console.log(self.toString());
			}
		}

		_.each(theGroup, function (theBlock) {
			console.log('Remove Block: ', theBlock.id);
			theBlock.state = BLOCK_STATES['REMOVING'];
			theBlock.bind('animationEnd', onAllRemoved);
		}, self);

		this.trigger('removeBlocks', theGroup);

	},


	/**
	 * Called when the next row becomes playable
	 */
	rowUp: function () {

	},

	getIter: function () {
		return this.iter();
	},

	toString: function () {
		var str = "";
		_.each(this.blocks, function (i) {
			_.each(i, function (j) {
				if (!j) str += '*';
				else if (j.isBlank()) str += '_';
				else if (typeof j.id === 'number') str += j.id;
				str += ', ';
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
BlockManager.prototype.iter = function (board, length) {
	if (typeof board === 'undefined') {
		return new BlockManager.prototype.iter(this.blocks, this.blocks.length * this.total_rows);
	}

	this.board = board;

	// Start at -1 so that the first next() takes us to 0
	this.x = -1;
	this.y = -1;

	this.length = length;
	this.index = -1;
};

BlockManager.prototype.iter.prototype = {

	/* @return the contents of the next board position.
	 * Bare in mind that the location can be empty so this might return null. */
	next: function () {
		this.x = (this.x + 1) % this.board.length;
		if (this.x == 0) {
			this.y++;
		}
		this.index++;
		if (this.index >= this.length) {
			return undefined;
		}

		return this.board[this.x][this.y];
	},

	/* @return true if there are more blocks to return, false otherwise. */
	hasNext: function () {
		return this.index < (this.length - 1);
	},

	/* @returns array [x, y] of the co-ordinates of the most recently returned block
	 *  or null if next() has not been called yet or called too many times. */
	currentPos: function () {
		if (this.index >= 0 && this.index < this.length) {
			return [this.x, this.y];
		}
		return null;
	}
};

/* Iterates around the chosen block.
 * The length of this iterator can change depending on the block to iterate around.
 * e.g. if the target is on the edge. */
BlockManager.prototype.iterRoundBlock = function (board, block) {
	this.board = board;
	this.targetPos = block.getCoords();
	this.index = -1;
};

BlockManager.prototype.iterRoundBlock.prototype = {
	positions: [[0, 1], [1, 0], [0, -1], [-1, 0]],
	length: 4,

	next: function () {
		this.index++;
		var newPos = Position.add(this.targetPos, this.positions[this.index]);

		if (!this.board.isPosVisible(newPos)) {
			return this.hasNext() ? this.next() : null;
		}

		var block = this.board.getBlock(newPos[0], newPos[1]);
		return block.state == Block.STATES.ACTIVE ? block : null;
	},

	hasNext: function () {
		return this.index < this.positions.length;
	}

};

export default BlockManager;