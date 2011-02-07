/* create a crackattack namespace */

window.ca = {
	init : function () {
		ca.the_game = new ca.Game();
		ca.the_game.init();
	},
	Game : function(){},
	Board : function(){},
	BlockManager : function(){},
	Block : function(){},
	next_block_id : 0,
	Garbage : function(){}
};

ca.Game.prototype = {
	board : null,
	name : null,
	score : 0,
	ticks : 0,
	event_queue : [],
	mainloop : null, // Holds the timeout reference
	in_tick : false,

	init : function (name){
		if (window.gameloop) { this.stop(); }
		this.board = new ca.Board();
		this.board.init();
		this.name = name;
		this.score = 0;
		this.start_time = new Date();
		this.time = 0;
		this.event_queue = [];
		// List of debug elements
		this.debug = {$fps : $('#ca_fps')};

		this.init_events();
		//this.start();
	},

	init_events : function(){
		var thisgame = this;
		$(window).bind('resize', function(){ thisgame.queueEvent('resize'); });
		$('.ca_stop_button').bind('click', function(){ thisgame.event_queue.unshift('stop'); });
		$('.ca_start_button').bind('click', function(){ thisgame.start(); });
		$('.ca_init_button').bind('click', function(){ thisgame.init(); });
	},
	// At some point this will need to save the event object.
	queueEvent : function(event_name, event_obj) {
		this.event_queue.push(event_name);
	},
	dealWithEvent : function() {
		var event = this.event_queue.shift();
		if (event === undefined){ return; }
		switch (event) {
			case 'resize':
				ca.the_game.board.resetAspectRatio();
				break;
			case 'stop':
				ca.the_game.stop();
				break;
			default :
				console.log("Unhandled event: ", event);
				break;
		}
	},

	start: function(){
		if (window.gameloop) {return;}
		var interval = 200;
		console.log("Game started with an interval of ", interval);
		window.gameloop = setInterval(function (){ca.the_game.tick();}, interval);
	},

	tick : function(){
		if (this.in_tick) {return;} // Stop the game running away with it's self.
		this.in_tick = true;
		this.time = new Date();
		this.dealWithEvent();
		this.draw();
		this.in_tick = false;
	},

	draw : function(){
		this.board.draw();
		// do at the end.
		this.print_debug();
	},

	print_debug: function(){
		if (undefined === this.debug.fps_ticks) {
			this.debug.fps_ticks = 0;
			this.debug.fps_start = Date.now();
		}
		else if (this.debug.fps_ticks >= 50) {
			var td = (Date.now() - this.debug.fps_start) / 1000; // convert to seconds
			var fps = this.debug.fps_ticks / td;
			this.debug.$fps.html(fps.toPrecision(4));
			this.debug.fps_ticks = 0;
			this.debug.fps_start = Date.now();
		}
		else {
			this.debug.fps_ticks++;
		}
	},

	stop: function(){
		clearInterval(window.gameloop);
		console.log("Game stopped");
		window.gameloop = null;
	}

};

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
		var self = this;
		var height = this.boardtag.height();
		var width = height / this.visible_rows * this.columns;
		var block_width = width / this.columns;
		var hidden_height = height / this.visible_rows * this.total_rows;
		var block_height = hidden_height / this.total_rows;
		var top_pos = (self.overground_rows) * block_height;
		this.boardtag.css({width: width+'px'});
		this.container_tag.css({
			width : width+'px',
			height: hidden_height+'px',
			top: -top_pos + 'px'
		});
		self.block_manager.setBlockDims(block_width, block_height);
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
		// for each of the other columns fill to row 6-8
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

/* Manages the animations and states of the game blocks */
ca.BlockManager.prototype = {
	board: null,
	$control_block: $('#ca_control_block'),
	colour_probababilities: {grey: 2, orange:4, 	yellow:4, green:4, blue:4, purple:4},
	total_colour_probablity: 0,
	probability_to_colour: [],
	block_width: 0,
	block_height: 0,
	has_resized: false,

	init: function(args){
		this.board = args['board'];
		// Calculate colour probabilities in advance
		for (var i in this.colour_probababilities) {
			this.total_probablity += this.colour_probababilities[i];
			for (var j=0; j<this.colour_probababilities[i]; j++) {
				this.probability_to_colour.push(i);
			}
		}
	},



	/* Returns a hash of the block offset width and height (which includes border and margin) */
	getBlockDims: function(){
		if (!this.block_height || !this.block_width) { this.setBlockDims();}
		return {width: this.block_width, height: this.block_height};
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
		var random_num = Math.randomInt(this.total_probablity);
		var the_colour = this.probability_to_colour[random_num];
		var the_block = new ca.Block();
		the_block.init({colour : the_colour, block_manager: this, board: this.board});
		return the_block;
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
	/**
	 * States:
	 *    new: just been created, Should not stay in this state long,
	 *    turning: being converted from garbage,
	 *    falling: what it says,
	 *    rising: Hidden beneath the fold and not yet ready for play.
	 *    active: ready to be used by the player,
	 *    dying: disappearing. Still takes up space,
	 *    dead: doesn't take up space and can be cleaned up
	 */
	state: 'new',

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
		if (!this.$domobj) { this.paint(); }
		else {this.move()}
		// else call this.move()
	},
	paint: function() {
		console.log("Painting block: ", this.id, " At ", this.arr_x, ", ", this.arr_y);
		var html = '<div id="block_'+this.id+'" class="block ' + this.colour + '"/>';
		this.$domobj = $(html);
		this.$domobj.data('ca_obj', this); // So we can get the ca object from the DOM tag
		this.board.appendBlock(this.$domobj);
		this.move();
	},
	move: function() {
		// TODO move bottom_offset responsibility to Block manager
		var pos = this.block_manager.getBlockPos(this.arr_x, this.arr_y, this.bottom_offset);
		console.log("moving block: ", this.id, " At ", this.arr_x, ",", this.arr_y, " to: ", pos.left, ",",pos.bottom);
		this.$domobj.css({left: pos.left + 'px', bottom: pos.bottom+'px', width:pos.width, height:pos.height});
	},
	remove: function(){
		this.$domobj.remove();
		this.board = null;
		this.block_manager = null;
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

}


ca.init();
