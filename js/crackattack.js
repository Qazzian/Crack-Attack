
import $ from "jquery";

import Board from 'js/Board';
import BlockManager from 'js/BlockManager';
import Block from 'js/Block';
import Garbage from 'js/Garbage';
import Cursor from 'js/Cursor';
import Position from 'js/Position';
import Animations from 'js/animations';

/* create a crackattack namespace */
window.ca = {
	init : function () {
		if (ca.the_game) {
			ca.clearGame();
		}
		ca.the_game = new ca.Game();
		ca.the_game.init();
		ca.initButtons(ca.the_game);
		ca.Animations.setup({
			positions: ca.positions,
			blockManager: ca.the_game.board.block_manager,
			blockHeight: ca.the_game.board.block_height,
			blockWidth: ca.the_game.board.block_width
		});
	},

	Game : function(){},
	Populators: {},
	Board: Board,
	BlockManager : BlockManager,
	Block : Block,
	next_block_id : 0,
	Garbage : Garbage,
	Cursor : Cursor,
	Position : Position,
	Animations: Animations,
	
	/*** Constants   ***/

	// Possible states the Blocks can be in
	// TODO Moved to BlockManager temporarily 
	// BLOCK_STATES: new Enum([
	// 	'NULL',
	// 	'ACTIVE', // Can be used. There is no animation active on this block.
	// 	'NEW', // Model created but view has not
	// 	'SWITCHING', // User is moving the block.
	// 	'FALLING', // Filling up the space below.
	// 	'RISING', // User can see it on the bottom row but cannot use it.
	// 	'ACTIVATING', // Turning into a block from garbage.
	// 	'REMOVING', // User has got it in a group waiting for the animation to end
	// 	'REMOVED' // The Block model can be cleaned up
	// ]),
	
	
	// Positions are percentages relative to the size of .ca_block_container
	positions: {
		rows: [
			0, 3.7, 7.4, 11.1, 14.8, 18.5, 22.2, 25.9, 29.6, 33.3, 37, 40.7, 44.4, 48.1, 51.8, 
			55.5, 59.2, 62.9, 66.6, 70.3, 74, 77.7, 81.4, 85.1, 88.8, 92.5, 96.2, 99.9
		],
		cols: [
			0, 16.66, 33.33, 50, 66.66, 83.33
		]
	},

	initButtons: function(game) {
		$(window).one('resize', function(){ game.queueEvent('resize'); });
		$('.ca_stop_button').one('click', function(){ game.event_queue.unshift('stop'); });
		$('.ca_start_button').one('click', function(){ game.start(); });
		$('.ca_init_button').one('click', function(){ game.init(); });
		$('.ca_reset_button').one('click', function(){ game.cleanUp(); });
	},

	clearGame: function(){
		ca.the_game.stop();
		ca.the_game.cleanUp();
	}

};

ca.Game.prototype = {
	board : null,
	name : null,
	score : 0,
	ticks : 0,
	event_queue : [],
	ui : null,
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

		this.cursor = new ca.Cursor();
		this.cursor.init();
		//this.start();
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
		var fps = 32;
		var interval = 1000 / fps;
		console.log("Game started with an interval of ", interval);
		window.gameloop = setInterval(function (){ca.the_game.tick();}, interval);
	},

	tick : function(){
		if (this.in_tick || !window.gameloop) {return;} // Stop the game running away with it's self.
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
	},

	cleanUp: function(){
		this.board.cleanUp();
		this.cursor.reset();
	}
};
