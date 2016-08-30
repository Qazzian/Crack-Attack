ca.Populators.randomBlockGenerator = function() {

	var colour_probabilities = {grey: 1, orange: 5, yellow: 5, green: 5, blue: 5, purple: 5},
		total_probability = 0,
		probability_to_colour = [];

	function init() {
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
		probability_to_colour.shuffle();
	}

	this.next = function() {
		var random_num = Math.randomInt(this.probability_to_colour.length - 1);
		return probability_to_colour[random_num];
	};

	init();
};