/*
 * Board
 * 
 * This is the visual representation of the Board.
 * It needs to deal with painting the blocks and animations.
 */

import Backbone from 'backbone';
import getClassLike from 'js/tools/jquery-getClassLike';

import {default as BlockManager} from 'js/BlockManager';
import Animations from 'js/animations';

/**
 * The board view
 */
var Board = Backbone.View.extend({
	tagName: 'div',
	el: '.ca_board',
	boardtag: null,
	container_tag: null,
	block_manager: null,
	current_height: 0,
	current_block_level: 0,
	bottom_offset: 0,

	// The pixel dimensions of the Blocks
	block_width: 0,
	block_height: 0,
	// percentage size of the board that a block needs,
	// based on the normal number of rows and columns
	block_width_pct: 15.8,
	block_height_pct: 3.4,


	init: function () {
		this.boardtag = $(this.el);
		this.container_tag = this.$('.ca_block_container');
		this.block_manager = new BlockManager();
		this.block_manager.init();
		this.resetAspectRatio();
		var self = this;
		setTimeout(function () {
			self.draw();
		}, 30);

		_.bindAll(this, 'switchBlocks');

		this.block_manager.bind('switchBlocks', this.switchBlocks, this);
		this.block_manager.bind('dropBlock', this.dropBlock, this);
		this.block_manager.bind('removeBlocks', this.removeBlocks, this);
		this.block_manager.bind('blockDeleted', this.updatePositions, this);

	},

	resetAspectRatio: function () {
		var height = this.boardtag.height();
		var width = height / this.block_manager.visible_rows * this.block_manager.columns;

		var block_width = width / this.block_manager.columns;

		var hidden_height = height / this.block_manager.visible_rows * this.block_manager.total_rows;
		var block_height = hidden_height / this.block_manager.total_rows;
		this.setBlockDims(block_width, block_height);

		var top_pos = (this.block_manager.overgroundRows) * block_height;
		this.boardtag.css({width: width + 'px'});
		this.container_tag.css({
			width: width + 'px',
			height: hidden_height + 'px',
			top: -top_pos + 'px'
		});


		console.log("Board element: ", this.boardtag);
		console.log("current_height: ", height, "new width: ", width);
		console.log("Block height: ", block_height, ", top pos: ", top_pos);
		console.log("hidden_height: ", hidden_height, " width: ", width);
	},

	/* Returns a hash of the block offset width and height (which includes border and margin) */
	getBlockDims: function () {
		return {width: this.block_width, height: this.block_height};
	},

	setBlockDims: function (w, h) {
		this.block_height = h;
		this.block_width = w;

		this.has_resized = true;
	},

	/* Returns the block bottom, left pixel values based on the given array co-ords and bottom_offset */
	getBlockPos: function (x, y, bottom_offset) {
		var pos = {
			bottom: y * this.block_height + bottom_offset,
			left: x * this.block_width,
			width: this.block_width,
			height: this.block_height
		};
		return pos;
	},
	/* Checks that the position is in the visable range */
	isPosVisible: function (x, y) {
		return x >= 0 && x < this.columns && y >= (this.undergroundRows - 1) && y < (this.undergroundRows + this.visible_rows - 1);
	},

	/* Adds the block html to the end of the board DOM */
	appendBlock: function ($block) {
		this.container_tag.append($block);
	},


	getBlock: function (x, y) {
		return this.blockManger.getBlock(x, y);
	},

	moveBlock: function (block) {

	},

	/* Remove a given block's html from the board's DOM
	 * Returns success flag. */
	removeBlock: function (block_id) {
		try {
			this.boardtag.remove("div#" + block_id);
		}
		catch (e) {
			return false;
		}
		return true;
	},

	add_garbage: function () {
	},

	draw: function () {
		var curr_offset = this.bottom_offset;
		var blockIter = this.block_manager.iter();
		//console.log("Block Iter: ", blockIter);

		while (blockIter.hasNext()) {
			var block = blockIter.next();
			var pos = blockIter.currentPos();

			//console.log("Drawing block: ", block);

			if (typeof block !== 'undefined') {
				var newElmt = block.draw(pos[0], pos[1]);

				if (newElmt) {
					this.appendBlock(newElmt);
					block.setState('ACTIVE');
				}
			}

		}
	},

	updatePositions: function (positions) {
		var self = this;

		_.each(positions, function (pos) {
			var block = this.block_manager.getBlock(pos);
			var dom = block.draw(pos[0], pos[1]);
			this.appendBlock(dom);
			this.block_manager.trigger('animationEnd', pos);
		}, self);
	},

	/**
	 * Swaps the block positions.
	 * Need to seperate the visual from the logical here.
	 * TODO: The blocks have already switch position in the board so need to take that into account now
	 **/
	switchBlocks: function (eventData) {

		var pos1 = eventData[0],
			pos2 = eventData[1];

		var b1 = this.block_manager.getBlock(pos1);
		var b2 = this.block_manager.getBlock(pos2);

		if (b1) {
			b1.removeColClass();
			Animations.switchBlock(b1, pos2, pos1, function () {
				b1.$domobj.addClass('col_' + pos1[0]);
				b1.$domobj.removeAttr('style');
			});
		}
		if (b2) {
			b2.removeColClass();
			Animations.switchBlock(b2, pos1, pos2, function () {
				b2.$domobj.addClass('col_' + pos2[0]);
				b2.$domobj.removeAttr('style');
			});
		}
	},

	/**
	 * Animate a block falling
	 * @param data {Object} event data
	 * @attribute start {Array[2]} Start positon of the fall
	 * @attribute end {Array[2]} The final resting point of the block
	 * @attribute block {ca.Block} The block Object that is being animated
	 **/
	dropBlock: function (data) {
		var block = data.block;
		var i, blankBlock, rowClass, rowNum, newRow;

		//console.log("Start Drop block animation", data);

		Animations.dropBlock(block, data.start, data.end, function () {
			//console.log("End drop Animation", data);
			block.$domobj.removeClass(block.$domobj.getClassLike(/row_/));
			block.$domobj.addClass('row_' + data.end[1]);
			//console.log("Adding class row_"+data.end[1]);
		});

		for (i = data.start[1]; i >= data.end[1]; i--) {
			blankBlock = this.block_manager.getBlock(data.start[0], i);
			if (blankBlock.isBlank() && blankBlock.$domobj) {
				rowClass = blankBlock.$domobj.getClassLike(/row_/);
				rowNum = parseInt(rowClass.replace('row_', ''), 10);
				newRow = rowNum + 1;
				//console.log('Move blank block', 'from', rowClass, rowNum, 'to:', newRow, blankBlock.$domobj[0].className);
				blankBlock.$domobj.removeClass(rowClass);
				blankBlock.$domobj.addClass('row_' + newRow);
			}
		}


	},

	/**
	 * Remove a group of blocks
	 */
	removeBlocks: function (blockGroup) {
		var completed = 0;

		var groupCallback = function () {

		}

		var singleCallback = function (block) {
			console.log('Block Removed: ', block);
			var pos = block.getPos();
			block.$domobj.remove();
			completed++;

			if (completed === blockGroup.length) {
				groupCallback();
			}
		}

		_.each(blockGroup, function (block) {
			// TODO  trigger the individual animation on the old block
			// refresh with the new blank blocks
			var pos = block.getPos();
			Animations.removeBlock(block, pos, singleCallback);
		});
	},

	cleanUp: function () {
		this.boardtag.find('.block').remove();
		this.block_manager.destroy();
		delete this.block_manager;
	}


});

export default Board;