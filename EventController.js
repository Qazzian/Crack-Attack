EventController = function(){
	this.observers = {};
}
EventController.prototype = {
	/* Hash of {eventnames: {observerNames: callbacks}} */
	observers: null,

	/* Replaces an exisitng bind form the same observerName */
	bind: function(eventName, observerName, callback){
		if (!this.observers[eventName]) {
			this.observers[eventName] = {};
		}
		this.observers[eventName][observerName] = callback;
	},

	fire: function(eventName, data) {
		if (this.observers[eventName]) {
			for (var obv in this.observers[eventName]) {
				if (this.observers[eventName].hasOwnProperty(obv)) {
					this.observers[eventName][obv](data);
				}
			}
		}
	},

	unbind: function(eventName, observerName) {
		if (this.observers[eventName] && this.observers[eventName][observerName]) {
			delete this.observers[eventName][observerName];
		}
	}

}