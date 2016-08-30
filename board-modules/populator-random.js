/**
 *
 * @param boardConfig.undergroundRows [int] - number of rows hidden below the fold
 * @param boardconfig.columns
 * @param boardconfig.visible_rows
 */
ca.Populators.random = function*(boardConfig) {

	function makeRandomBlock() {
		var random_num = Math.randomInt(this.probability_to_colour.length - 1);
		var the_colour = this.probability_to_colour[random_num];

		var the_block = new ca.Block();
		the_block.init({colour: the_colour});
		if (the_colour === undefined) {
			console.warn("Created an undefined colour: ", the_colour, random_num, the_block);
		}
		return the_block;
	}

	function makePlaceHolder() {
		var the_block = new ca.Block();
		the_block.init({colour: 'blank'});
		return the_block;
	}

	// Set up 3 hidden rows and one complete visible row
	var start_full_rows = boardConfig.undergroundRows + 1;
	var x, y;
	// Add full rows.
	for (x = 0; x < start_full_rows; x++) {
		this.add_row();
	}
	// pick a random column. this will be empty from row 1 up.
	var empty_col = Math.randomInt(boardConfig.columns - 1);
	var new_block_count = boardConfig.visible_rows / 2;
	var tempBlock;
	// for each of the other columns fill to row 6-8
	for (x = 0; x < boardConfig.columns; x++) {
		if (x == empty_col) {
			if (Math.random() > 0.80) { // Sometimes add an extra block to the empty col
				tempBlock = makeRandomBlock();
				tempBlock.setState('ACTIVE');
				yield tempBlock;
			}
		}
		else {
			var new_blocks = Math.randomInt(new_block_count - 1, new_block_count + 1);
			for (y = 0; y < new_blocks; y++) {
				tempBlock = makeRandomBlock();
				yield tempBlock;
			}
		}
		// Fill the rest of the column with placeholder blocks
		while (this.blocks[x].length < this.total_rows) {
			this.blocks[x].push(makePlaceHolder());
		}
	}
};
