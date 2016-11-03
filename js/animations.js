/*global ca */

"use strict";

var Animations = {

	// ms to fall 1 row.
	fallSpeed: 20,
	// ms to move 1 col.
	switchSpeed: 75,
	removeSpeed: 500,
	positions: {},

	setup: function(options) {
		Animations.positions = options.positions;
		Animations.blockManager = options.blockManager;
		Animations.blockHeight = options.blockHeight;
		Animations.blockWidth = options.blockWidth;
	},

	onStep: function (now, fx) {
		// Need to check for new rows being added.
		// Also possible that the block now needs to fall further or not as far depending on the users actions
	},

	/**
	 * Animate the left or right movement of a block
	 * @param block {Block}: the Block object to animate
	 * @param startPos {Array[2]}: the Blocks starting location
	 * @param endPos {Array[2]}: the final posiion,
	 * @param callback {function(Block)}: function to call once the animation ends. Given the Block object as a paramerter
	 */
	switchBlock: function (block, startPos, endPos, callback) {
		var $block = block.$domobj,
			startCol = startPos[0],
			endCol = endPos[0],
			colDiff = startCol - endCol,
			css, options, onEnd, zIndex;

		if (colDiff === 0) {
			return callback();
		}
		else if (colDiff < 0) {
			zIndex = 995;
			$block.css('z-index', 995);
		}
		else if (colDiff > 0) {
			zIndex = 990;
		}

		onEnd = function () {
			block.isAnimating = false;
			$block.css('z-index', '');
			callback(block);
			Animations.blockManager.trigger('animationEnd', endPos);
		};

		block.isAnimating = true;
		$block.css({
			'left': Animations.positions.cols[startPos[0]] + '%',
			'z-index': zIndex
		});

		css = {left: Animations.positions.cols[endPos[0]] + '%'};
		options = {
			duration: Animations.switchSpeed,
			easing: '',
			complete: onEnd,
			step: Animations.onStep
		};

		$block.animate(css, options);
	},

	dropBlock: function (block, startPos, endPos, callback) {
		var css = {bottom: Animations.positions.rows[endPos[1]] + '%'};
		var $blockElmt = block.$domobj;
		var duration = (Animations.positions.rows[startPos[1]] - parseInt(css.bottom, 10)) * Animations.fallSpeed;
		var onEnd = function () {
			block.isAnimating = false;
			callback(block);
			Animations.blockManager.trigger('animationEnd', endPos);
		};
		var options = {
			duration: duration,
			easing: "",
			complete: onEnd,
			step: Animations.onStep
		};

		block.isAnimating = true;
		$blockElmt.animate(css, options);
	},

	dropGarbage: function ($garbageElmt, targetPos, callback) {

	},

	removeBlock: function (block, pos, callback) {
		var css = {
			width: 0,
			height: 0,
			marginBottom: (Animations.blockHeight / 2) + 'px',
			marginLeft: (Animations.blockWidth / 2) + 'px'
		};

		var onEnd = function () {
			block.isAnimating = false;
			callback(block);
			block.trigger('animationEnd', pos);
		};

		var options = {
			duration: this.removeSpeed,
			easing: "",
			complete: onEnd,
			step: Animations.onStep
		};

		block.isAnimating = true;
		block.$domobj.animate(css, options);
	},

	raiseBoard: function (delta, callback) {

	}


};

export default Animations;