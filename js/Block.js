'use strict';

import Backbone from 'backbone';
import BLOCK_STATES from 'js/BlockStates';

var nextBlockId = 0;

var Block = Backbone.Model.extend({
	id: 0,
	colour: '', /* can be 'grey', 'orange', 'yellow', 'green', 'blue', 'purple', 'black', 'white' */
	isSpecial: false, /* for extreme play */
	$domobj: null,
	state: 0,
	// If the block is in the middle of an animation, we can't change the state
	isAnimating: false,
	pos: null,

	/**
	 * Accepted parameters:
	 * colour - A named colour (required)
	 * isSpecial - boolean (default false)
	 * col - column index
	 * row - row index
	 * pos - array [col, row]
	 */
	init: function (args) {
		if (typeof(args) === 'object') {
			for (var key in args) {
				if (this[key] !== undefined) {
					this[key] = args[key];
				}
			}
		}
		this.id = nextBlockId++;
		this.setState('NEW');
		return this;
	},

	/* bottom_offset - number of pixels to add to the bottom row
	 * x - column number
	 * y - row number
	 */
	draw: function (x, y) {
		//console.log("Painting block: ", this.id, " At ", this.arr_x, ", ", this.arr_y);
		var html = '<div id="block_' + this.id + '" class="block ' + this.colour + ' col_' + x + ' row_' + y + '">' + this.id + '</div>';
		this.$domobj = $(html);
		this.$domobj.data('ca_obj', this); // So we can get the ca object from the DOM tag
		return this.$domobj;
	},
	remove: function () {
		this.$domobj.remove();
		this.board = null;
		this.block_manager = null;
	},

	setState: function (state) {
		if (typeof BLOCK_STATES[state] === 'number') {
			this.state = BLOCK_STATES[state];
			this.trigger('change', {'state': state});
		}
	},

	/**
	 * A way for the block to know about it's current position.
	 * NOTE: This is not currently maintained and is only valid for short times.
	 * In other words set it then use it quickly, before the data becomes stale.
	 * @param {Number} x The column index
	 * @param {Number} y The row index
	 * @return {Array[2]} The generated position object.
	 */
	setPos: function (x, y) {
		if (_.isArray(x)) {
			this.position = x;
		}
		else {
			this.position = [x, y];
		}

		return this.position;
	},

	getPos: function () {
		return this.position;
	},

	match: function (other) {
		return this.colour === other.colour;
	},

	removeColClass: function() {
		var colClass = this.$domobj[0].className.match(/col_([0-9]+)/);
		this.$domobj.removeClass(colClass[0]);
	},

	// Check the state of the block to see if the user can interact with it.
	canUse: function () {
		return (!this.isAnimating && this.state === BLOCK_STATES['ACTIVE']);
	},
	// Return true if this is a placeholder block
	isBlank: function () {
		return this.colour === 'blank';
	}
});

export default Block;