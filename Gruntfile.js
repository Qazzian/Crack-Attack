module.exports = function(grunt) {
	// Project configuration.
	grunt.initConfig({
		blanket_qunit: {
			all: {
				options: {
					urls: ['t/index.html?coverage=true&gruntReport'],
					threshold: 0
				}
			}
		}
		
	});

	grunt.registerTask('test', ['blanket_qunit']);

	grunt.loadNpmTasks('grunt-blanket-qunit');

};