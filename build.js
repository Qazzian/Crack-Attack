#! /usr/bin/env node

var stealTools = require("steal-tools");

var promise = stealTools.build({
	main: "js/crackattack",
	config: __dirname+"/package.json!npm"
},{
	// the following are the default values, so you don't need
	// to write them.
	minify: true,
	debug: true,
	bundleSteal: true
});