/**
 * A central place for UI events to be fired from.
 * 
 * Models and other views should bind event listeners to this object.
 * UI views will then call the fire function which will trigger the appropriate event.
 * 
 * Events need to be listed in registeredEvents in order to trigger.
 */

ca.UIEventController = new (Backbone.Model.extend({
	
	registeredEvents: [
		'switchBlocks'
	],
	
	fire: function(eventName, data, element) {
		if (this.registeredEvents.indexOf(eventName) > -1) {
			this.trigger(eventName, data, element);
		}
		else {
			console.log('Unknown event: ' + eventName);
		}
	}
}))();