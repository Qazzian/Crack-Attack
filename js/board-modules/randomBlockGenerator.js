ca.Populators.randomBlockGenerator = function(userSeed) {

	var rng;

	var colour_probabilities = {grey: 1, orange: 5, yellow: 5, green: 5, blue: 5, purple: 5},
		total_probability = 0,
		probability_to_colour = [];

	var randomInt = function(low, high, interval) {
		var out = 0;
		var num = rng();
		console.info('Random number generated: ', num);
		if (low !== undefined && high === undefined) {
			out = Math.round(num * low);
		}
		else if (low !== undefined && high !== undefined && interval === undefined) {
			out = Math.round(num * (high - low)) + low;
		}
		else if (low && high && interval) {
			var sub_high = (high - low) / interval;
			out = Math.round(num * sub_high);
			out = (out + low) * interval;
		}
		//log("Math.randomInt: low: "+low+", high: "+high+", interval: "+interval+", out: "+out);
		return out;
	};

	function init(seed) {
		rng = new Math.seedrandom(seed || 'ian');

		var i, j, tArr = [];

		for (i in colour_probabilities) {

			if (colour_probabilities.hasOwnProperty(i)) {
				total_probability += colour_probabilities[i];
				for (j = 0; j < colour_probabilities[i]; j++) {
					probability_to_colour.push(i);
					tArr.push(i);
				}
			}
		}
		probability_to_colour = tArr;
		// probability_to_colour.shuffle();
	}

	this.next = function() {
		var random_num = randomInt(probability_to_colour.length - 1);
		console.info('Random number after rounding: ', random_num);
		return probability_to_colour[random_num];
	};

	init(userSeed);
};