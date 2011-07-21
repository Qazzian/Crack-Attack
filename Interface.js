ca.Interface.prototype = {
	cursor_location: null,
	
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
	
	codemap : {'32':'switch','97':'left','100':'right','105':'up','106':'left','107':'down','108':'right','112':'pause','115':'down','119':'up'},
	
	init: function() {
		console.log("init UI");
		var codeMap = {};
		for (var i in this.keymap) {
			codeMap[i.charCodeAt(0)] = this.keymap[i];
		}
		console.log(JSON.stringify(codeMap));
		$('body').bind('keypress', this.onKeyPress);
	},
	
	onKeyPress: function(event) {
		var keycode = event.which;
		var keyStr = String.fromCharCode(keycode);
		console.log("Key pressed: ", keycode, ' ', keyStr);
		
	}
};
