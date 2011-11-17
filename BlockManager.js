/* Manages creating, animation of and states of the game blocks */
ca.BlockManager.prototype = {
	board: null,
	colour_probababilities: {grey: 1, orange:4, 	yellow:4, green:4, blue:4, purple:4},
	total_colour_probablity: 0,
	probability_to_colour: [],
	block_width: 0,
	block_height: 0,
	block_width_pct: 15.8,
	block_height_pct: 3.4,
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

	init: function(args){
		this.board = args['board'];
		// Calculate colour probabilities in advance
		for (var i in this.colour_probababilities) {
			this.total_probablity += this.colour_probababilities[i];
			for (var j=0; j<this.colour_probababilities[i]; j++) {
				this.probability_to_colour.push(i);
			}
		}
		this.probability_to_colour.shuffle();
	},

	/* Returns a hash of the block offset width and height (which includes border and margin) */
	getBlockDims: function(){
		if (!this.block_height || !this.block_width) {this.setBlockDims();}
		return {width: this.block_width, height: this.block_heightz};
	},

	setBlockDims: function(block_width, block_height){
		this.block_height = block_height || this.$control_block[0].offsetHeight + 2;
		this.block_width = block_width || this.$control_block[0].offsetWidth + 2;

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

	}
};

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
	/**
	 * States:
	 *    fresh: just been created, Should not stay in this state long,
	 *    turning: being converted from garbage,
	 *    falling: what it says,
	 *    rising: Hidden beneath the fold and not yet ready for play.
	 *    active: ready to be used by the player,
	 *    dying: disappearing. Still takes up space,
	 *    dead: doesn't take up space and can be cleaned up
	 */
	state: 'fresh',

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

	/* bottom_offset - number of pixels to add to the bottom row
	 * x - column number
	 * y - row number
	 */
	draw: function(arr_x, arr_y, bottom_offset) {
		this.arr_x = arr_x;
		this.arr_y = arr_y;
		this.bottom_offset = bottom_offset
		// if not exists in the DOM call this.paint()
		if (!this.$domobj) {this.paint();}
	},
	paint: function() {
		//console.log("Painting block: ", this.id, " At ", this.arr_x, ", ", this.arr_y);
		var html = '<div id="block_' + this.id + '" class="block ' + this.colour + ' col_' + this.arr_x + ' row_'+this.arr_y+'">'+this.id+'</div>';
		this.$domobj = $(html);
		this.$domobj.data('ca_obj', this); // So we can get the ca object from the DOM tag
		this.board.appendBlock(this.$domobj);
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