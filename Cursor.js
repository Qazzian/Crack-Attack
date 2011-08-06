ca.Cursor.prototype = {
	cursor_id: 'ca_curser',
	cursor_location: null,
	cursor_limits : {
		min_x: 0,
		max_x: 4,
		min_y: 0,
		max_y: 11
	},

	keymap : {
		'i' : 'up',
		'j' : 'left',
		'k' : 'down',
		'l' : 'right',
		'w' : 'up',
		'a' : 'left',
		's' : 'down',
		'd' : 'right',
		' ' : 'switch',
		'p' : 'pause'
	},

	codemap : {
		'32':'switch','97':'left','100':'right','105':'up','106':'left','107':'down','108':'right','112':'pause','115':'down','119':'up'
	},

	init: function() {
		this.self = this;
		console.log("init UI");
		$('body').bind('keypress', this.onKeyPress);
		this.cursor_location = [3, 3];
	},

	onKeyPress: function(event) {
		var keycode = event.which;
		var keyStr = String.fromCharCode(keycode);
		console.log("Key pressed: ", keycode, ' ', keyStr+'\nevent: ', self.codemap[keycode]);
		switch (self.codemap[keycode]) {
			case 'up':
			case 'down':
			case 'left':
			case 'right':
				self.moveCursor(this.codemap[keycode]);
				break;
			case 'switch':
				self.switchBlocks();
				break;
			case 'pause':
				self.pauseGame();
				break;
			default:
				// ignore unrecognised key presses.
				break;
		}
	},

	moveCursor: function(direction) {
		var dirs = {
			up: [0,-1],
			down: [0, 1],
			left: [-1, 0],
			right: [1, 0]
		};

		this.cursor_location[0] += dirs[direction][0];
		this.cursor_location[1] += dirs[direction][1];
		this.moved = true;
		console.log('Move cursor '+direction);
	},

	switchBlocks: function(){

	},

	pauseGame: function(){

	},

	/* Needs to know details about where the board offset is etc */
	draw: function(){
		if (this.moved) {
			// work out the col, row position and include the offset
		}
		else {
			// take the offset from the block top
		}
	}

};
