ca.Board.prototype = {
	boardtag : null,
	container_tag : null,
	block_manager : null,
	columns : 6, //blocks
	visible_rows : 12, // only the visible blocks.
	underground_rows : 3, // Number of rows to hide below the fold
	overground_rows: 12, // Number of rows hidden above the fold
	total_rows : null,
	blocks : [],
	current_height : 0,
	current_block_level: 0,
	bottom_offset: 0,

	init : function (){
		this.boardtag = $('.ca_board');
		this.container_tag = $('.ca_block_container');
		this.block_manager = new ca.BlockManager();
		this.block_manager.init({board:this});
		this.total_rows = this.underground_rows + this.visible_rows + this.overground_rows;
		this.resetAspectRatio();
		this.blocks = [];
		for (var x=0; x<this.columns; x++) {
			this.blocks[x] = [];
		}
		this.setup_random_start();
		var self = this;
		setTimeout( function(){ self.draw(); }, 30 );
	},

	resetAspectRatio : function() {
		var height = this.boardtag.height();
		var width = height / this.visible_rows * this.columns;
		var block_width = width / this.columns;
		var hidden_height = height / this.visible_rows * this.total_rows;
		var block_height = hidden_height / this.total_rows;
		var top_pos = (this.overground_rows) * block_height;
		this.boardtag.css({width: width+'px'});
		this.container_tag.css({
			width : width+'px',
			height: hidden_height+'px',
			top: -top_pos + 'px'
		});
		this.block_manager.setBlockDims(block_width, block_height);
		console.log("current_height: ", height, "new width: ", width);
		console.log("Block height: ", block_height, ", top pos: ", top_pos);
		console.log("hidden_height: ", hidden_height, " width: ", width);
	},

	setup_random_start : function(){
		// Set up 3 hidden rows and one complete visible row
		var start_full_rows = this.underground_rows + 1;
		for (var x = 0; x < start_full_rows; x++) {
			this.add_row();
		}
		// pick a random column. this will be empty from row 1 up.
		var empty_row = Math.randomInt(this.columns -1);
		var new_block_count = this.visible_rows / 2;
		// for each of the other columns fill to row 6-8
		for (var x=0; x<this.columns; x++) {
			if (x == empty_row) {
				if (Math.random() > 0.80) { // Sometimes add an extra block to the empty row
					this.blocks[x].push(this.block_manager.makeRandomBlock());
				}
				continue;
			}
			var new_blocks = Math.randomInt(new_block_count -1, new_block_count +1);
			for(y=0; y<new_blocks; y++) {
				this.blocks[x].push(this.block_manager.makeRandomBlock());
			}
		}
	},
	/* Adds the block html to the end of the board DOM */
	appendBlock : function($block)  {
		this.container_tag.append($block);
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
			var the_block = this.block_manager.makeRandomBlock();
			this.blocks[i].unshift(the_block);
		}
	},
	make_block : function(colour, special){
		var the_block = new ca.Block();
		the_block.colour = colour;
	},
	/** A block starts falling to the bottom */
	block_fall : function(block_id) {
	},
	block_ready : function(block_id) {
	},

	add_garbage : function(){},
	draw : function(){
		console.log("Drawing the board");
		var curr_offset = this.bottom_offset;
		for (var x=0; x<this.columns; x++) {
			for (var y=0; y<this.blocks[x].length; y++) {
				this.blocks[x][y].draw(x, y, curr_offset);
			}
		}
	}

}

