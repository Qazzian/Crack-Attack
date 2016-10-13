import {default as randomInt} from 'js/tools/randomInt';

export default function shuffleArray(inputArray) {
	"use strict";

	var shuffledArray = [];

	var copy = inputArray.slice(0, inputArray.length), i;
	for (i = copy.length; i > 0; i--) {
		var pos = randomInt(0, i - 1);
		shuffledArray.push(copy.splice(pos, 1)[0]);
	}

	return shuffledArray;
}