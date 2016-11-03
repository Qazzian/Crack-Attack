'use strict';

import Backbone from 'backbone';

import UIEventController from 'js/EventController';

/**
 * TODO:
 * separate input control from cursor movement.
 * user Inputs should fire movement events which the cursor listens for and responds to.
 */


var Cursor = Backbone.Model.extend({
	cursor_id: 'ca_curser',
	cursor_location: null,

	move_dirs: {
		up: [0, 1],
		down: [0, -1],
		left: [-1, 0],
		right: [1, 0],
		none: [0, 0]
	},

	// TODO should be set by the board
	cursor_limits: {
		min_x: 0,
		max_x: 4,
		min_y: 3,
		max_y: 14
	},

	// TODO move to the input controller
	keymap: {
		'i': 'up',
		'j': 'left',
		'k': 'down',
		'l': 'right',
		'w': 'up',
		'a': 'left',
		's': 'down',
		'd': 'right',
		' ': 'switch',
		'p': 'pause'
	},

	// TODO move to the input controller
	codemap: {
		'32': 'switch',
		'97': 'left',
		'100': 'right',
		'105': 'up',
		'106': 'left',
		'107': 'down',
		'108': 'right',
		'112': 'pause',
		'115': 'down',
		'119': 'up',
		'37': 'left',
		'38': 'up',
		'39': 'right',
		'40': 'down'
	},

	init: function () {
		var self = this;
		// TODO move to the input controller
		$(document).on('keydown', function (event) {
			self.onKeyPress(event);
		});
		// TODO Defined by the board
		this.cursor_location = [2, 3];
		this.draw();
	},

	reset: function () {
		$(document).off('keydown');
	},

	// TODO move to the input controller
	onKeyPress: function (event) {
		var self = window.ca.the_game.cursor;
		var keycode = event.keyCode;
		var keyStr = self.codemap[keycode];
		console.log("KeyPress: ", keycode, keyStr);
		switch (keyStr) {
			// TODO these become event triggers
			case 'up':
			case 'down':
			case 'left':
			case 'right':
				event.preventDefault();
				self.moveCursor(self.codemap[keycode]);
				break;
			case 'switch':
				event.preventDefault();
				self.switchBlocks();
				break;
			case 'pause':
				event.preventDefault();
				self.pauseGame();
				break;
			default:
				// ignore unrecognised key presses. Also let them fire default event
				return;
		}
		return false;
	},

	// TODO this becomes the event listener for those triggered above
	moveCursor: function (direction) {
		var moveCoords = this.move_dirs[direction];

		this.cursor_location[0] += moveCoords[0];
		this.cursor_location[1] += moveCoords[1];
		this.containCursor();
		this.draw();
	},

	containCursor: function () {
		var coords = this.cursor_location;
		coords[0] = Math.min(coords[0], this.cursor_limits.max_x);
		coords[1] = Math.min(coords[1], this.cursor_limits.max_y);
		coords[0] = Math.max(coords[0], this.cursor_limits.min_x);
		coords[1] = Math.max(coords[1], this.cursor_limits.min_y);
	},

	/* Needs to know details about where the board offset is etc */
	draw: function () {
		var elmt = document.getElementById(this.cursor_id);
		elmt.className = "col_" + this.cursor_location[0] + ' row_' + this.cursor_location[1];
	},

	switchBlocks: function () {
		UIEventController.fire('switchBlocks', [this.cursor_location, [this.cursor_location[0] + 1, this.cursor_location[1]]]);
	},

	// TODO pauseGame input event
	// TODO move to the input controller
	pauseGame: function () {

	}

});

export default Cursor;
