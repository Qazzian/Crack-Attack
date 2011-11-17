Events = (function(){
	var Observer = function(id, eventName, callback){
		this.id = id;
		this.method = callback;
		this.eventName = eventName;
	}

	var observers = {};

	var self = {
		bind: function(eventName, callback){
			if (!observers[eventName]) {
				observers[eventName] = [];
			}

			observers[eventName].push(new Observer(eventName, callback));
			return observers[eventName].length - 1;
		},

		fire: function(eventName, data){
			if (observers[eventName]) {
				for (var i=0, l=observers[eventName].length; i<l; i++) {
					observers[eventName][i].method(data);
				}
			}
		},

		unbind: function(id, eventName) {
			if (observers[eventName]) {
				for (var i=0, l=observers[eventName].length; i<l; i++) {
					if (observers[eventName][i].id == id) {
						observers[eventName].splice(i, 1);
					}
				}

			}
		}
	}

	return self;


})()