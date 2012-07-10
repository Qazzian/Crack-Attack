/*
 * ca.Board
 * 
 * This is the visual representation of the Board.
 * It needs to deal with painting the blocks and animations.
 */

ca.Board = Backbone.View.extend({
	// Quick hack to change some of the properties.
//	if (typeof opts === 'object') for (var o in opts) {
//		if (this.hasOwnProperty(o) && typeof this[o] !== 'function') {
//			this[o] = opts[o];
//		}
//	}
//	
//	this.total_rows = this.underground_rows + this.visible_rows + this.overground_rows;
//};

//ca.Board.prototype = {
	tagName: 'div',
	el: '.ca_board',
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
		this.boardtag = $(this.el);
		this.container_tag = this.$('.ca_block_container');
		this.block_manager = new ca.BlockManager();
		this.block_manager.init();
		this.resetAspectRatio();
		var self = this;
		setTimeout( function(){
			self.draw();
		}, 30 );
		
		_.bindAll(this, 'switchBlocks');
		
		this.block_manager.bind('switchBlocks', this.switchBlocks, this);
		this.block_manager.bind('dropBlock', this.dropBlock, this);
		
	},

	resetAspectRatio : function() {
		var height = this.boardtag.height();
		var width = height / this.block_manager.visible_rows * this.block_manager.columns;
		
		var block_width = width / this.block_manager.columns;
		
		var hidden_height = height / this.block_manager.visible_rows * this.block_manager.total_rows;
		var block_height = hidden_height / this.block_manager.total_rows;
		this.setBlockDims(block_width, block_height);
		
		var top_pos = (this.block_manager.overground_rows) * block_height;
		this.boardtag.css({width: width+'px'});
		this.container_tag.css({
			width : width+'px',
			height: hidden_height+'px',
			top: -top_pos + 'px'
		});
		
		
		console.log("current_height: ", height, "new width: ", width);
		console.log("Block height: ", block_height, ", top pos: ", top_pos);
		console.log("hidden_height: ", hidden_height, " width: ", width);
	},

	/* Returns a hash of the block offset width and height (which includes border and margin) */
	getBlockDims: function(){
		return {width: this.block_width, height: this.block_height};
	},

	setBlockDims: function(w, h){
		this.block_height = h;
		this.block_width = w;

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

	add_garbage : function(){},
	
	draw : function(){
		console.log("Drawing the board");
		var curr_offset = this.bottom_offset;
		var blockIter = this.block_manager.iter();
		console.log("Block Iter: ", blockIter);
		
		while (blockIter.hasNext()) {
			var block = blockIter.next();
			var pos = blockIter.currentPos();
			console.log("Drawing block: ", block);
			if (typeof block === 'undefined') { continue; }
			
			var newElmt = block.draw(pos[0], pos[1]);
			
			if (newElmt) {
				this.appendBlock(newElmt);
			}
			
		}
	},

	/**
	 * Swaps the block positions.
	 * Need to seperate the visual from the logical here.
	 * TODO: The blocks have already switch position in the board so need to take that into account now
	 **/
	switchBlocks: function(eventData) {
		
		var pos1 = eventData[0],
			pos2 = eventData[1];	
		
		
		var b1 = this.block_manager.getBlock(pos1);
		var b2 = this.block_manager.getBlock(pos2);

		if (b1) {
			b1.$domobj.removeClass(b1.$domobj.getClassLike(/col_.+/));
			ca.Animations.switchBlock(b1, pos2, pos1, function(){
				b1.$domobj.addClass('col_'+pos1[0]);
				b1.$domobj.removeAttr('style');
			});
		}
		if (b2){
			b2.$domobj.removeClass(b2.$domobj.getClassLike(/col_.+/))
			ca.Animations.switchBlock(b2, pos1, pos2, function(){
				b2.$domobj.addClass('col_'+pos2[0]);
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
	dropBlock: function(data){
		
		/* TODO
		 * Start animating the block's DOM element
		 * rescan the column and re-render the rest of the blocks correctly
		 * */
		console.log("Start Drop block animation", data);
		var block = data.block;
		ca.Animations.dropBlock(block, data.start, data.end, function(){
			console.log("End drop Animation", data);
			block.$domobj.removeClass(block.$domobj.getClassLike(/row_/));
			block.$domobj.addClass('row_'+data.end[1]);
		});
		
		
		
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



});
