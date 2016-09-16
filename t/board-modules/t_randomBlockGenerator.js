
(function(global) {
	"use strict";

	function TestGenerator() {
		this.run();
	}

	TestGenerator.prototype = {
		run: function() {
			var self = this;
			module('Random block generator');
			for (var func in this) {
				if (func.match(/^test/)) {
					test(func, this, self[func]);
				}
			}
		},
		
		testNew() {
			ok(typeof ca.Populators.randomBlockGenerator === 'function', "Generator defined");
			var myRbg = new ca.Populators.randomBlockGenerator();
			ok(myRbg, 'produce new block generator');
			var myRbgWithSeed = new ca.Populators.randomBlockGenerator('test');
			ok(myRbgWithSeed, 'produce new block generator with seed');
			var b1 = myRbgWithSeed.next();
			console.info('b1:', b1);
			ok(b1, 'return a random block');
			ok(b1 === 'green', 'Seed generators should always return the same result');
		}
	};

	global.randomBlockGeneratorSuits = new TestGenerator();

})(window);

