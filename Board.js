/*
 * ca.Board
 * 
 * This is the visual representation of the Board.
 * It needs to deal with painting the blocks and animations.
 */

ca.Board = function(opts){
	// Quick hack to change some of the properties.
	if (typeof opts === 'object') for (var o in opts) {
		if (this.hasOwnProperty(o) && typeof this[o] !== 'function') {
			this[o] = opts[o];
		}
	}
	
	this.total_rows = this.underground_rows + this.visible_rows + this.overground_rows;
};

ca.Board.prototype = {
	boardtag : null,
	container_tag : null,
	block_manager : null,
	current_height : 0,
	current_block_level: 0,
	bottom_offset: 0,
	
	// The pixel dimensions of the Blocks
	block_width: 0,
	block_height: 0,
	// percentge size of the board that a block needs, 
	// based on the normal number of rows and columns
	block_width_pct: 15.8,
	block_height_pct: 3.4,
	

	init : function (){
		this.boardtag = $('.ca_board');
		this.container_tag = $('.ca_block_container');
		this.block_manager = new ca.BlockManager();
		this.block_manager.init();
		this.resetAspectRatio();
		var self = this;
		setTimeout( function(){
			self.draw();
		}, 30 );
	},

	resetAspectRatio : function() {
		var height = this.boardtag.height();
		var width = height / this.block_manager.visible_rows * this.block_manager.columns;
		var block_width = width / this.block_manager.columns;
		var hidden_height = height / this.block_manager.visible_rows * this.block_manager.total_rows;
		var block_height = hidden_height / this.block_manager.total_rows;
		var top_pos = (this.block_manager.overground_rows) * block_height;
		this.boardtag.css({width: width+'px'});
		this.container_tag.css({
			width : width+'px',
			height: hidden_height+'px',
			top: -top_pos + 'px'
		});
		this.setBlockDims(block_width, block_height);
		console.log("current_height: ", height, "new width: ", width);
		console.log("Block height: ", block_height, ", top pos: ", top_pos);
		console.log("hidden_height: ", hidden_height, " width: ", width);
	},

	/* Returns a hash of the block offset width and height (which includes border and margin) */
	getBlockDims: function(){
		if (!this.block_height || !this.block_width) {this.setBlockDims();}
		return {width: this.block_width, height: this.block_heightz};
	},

	setBlockDims: function(block_width, block_height){
		this.block_height = block_height;
		this.block_width = block_width;

		this.has_resized = true;
	},

	/* Returns the block bottom, left pixel values based on the given array co-ords (0-indexed) and bottom_offset */
	getBlockPos: function(x, y, bottom_offset){
		var pos = {
			bottom : y * this.block_height + bottom_offset,
			left : x * this.block_width,
			width: this.block_width,
			height: this.block_height
		}
		return pos;
	},
	/* Checks that the position is in the visable range */
	isPosVisible: function(x, y){
		return x >= 0 && x < this.columns && y >= (this.underground_rows - 1) && y < (this.underground_rows+this.visible_rows-1);
	},
	
	/* Adds the block html to the end of the board DOM */
	appendBlock : function($block)  {
		this.container_tag.append($block);
	},
	
	
	getBlock: function(x, y) {
		return this.blockManger.getBlock(x, y);
	},

	moveBlock: function(block) {
		
	},

	add_garbage : function(){},
	
	draw : function(){
		console.log("Drawing the board");
		var curr_offset = this.bottom_offset;
		var blockIter = this.block_manager.iter();
		console.log("Block Iter: ", blockIter);
		
		while (blockIter.hasNext()) {
			var block = blockIter.next();
			console.log("Drawing block: ", block);
			if (typeof block === 'undefined') { continue; }
			
			var newElmt = block.draw(curr_offset);
			
			if (newElmt) {
				this.appendBlock(newElmt);
			}
			
		}
	},

	switchBlocks: function(pos1, pos2) {
		var b1 = this.getBlock(pos1);
		var b2 = this.getBlock(pos2);

		if (b2){
			this.blocks[pos1[0]][pos1[1]] = b2;
			b2.$domobj.removeClass('col_'+pos2[0]).addClass('col_'+pos1[0]);
			b2.arr_x = pos1[0];
			b2.arr_y = pos1[1];
		}
		else {
			this.blocks[pos1[0]][pos1[1]] = null;
		}
		if (b1) {
			this.blocks[pos2[0]][pos2[1]] = b1;
			b1.$domobj.removeClass('col_'+pos1[0]).addClass('col_'+pos2[0]);
			b1.arr_x = pos2[0];
			b1.arr_y = pos2[1];
		}
		else {
			this.blocks[pos2[0]][pos2[1]] = null;
		}
	},

	checkForGroups: function(){
		var checked = {}; // " 'x,y' : (false | groupId | undefined) = checked not in a group | is in a group | not checked"
		var groups = {};
		var iter = this.getiter();

		while(iter.hasNext()) {
			var block = iter.next();


		}
		
		/*
		 * for each space (start at 0,3) and move right and up
		 * if has block and block active
		 *		Check to the right first
				 *	if Same colour & active
				 *		add to group
				Check up as well
					if up block works check left as well as right.

			Store a hash of checked blocks
		 */
	},

	checkInGroup: function(){

	}



}
