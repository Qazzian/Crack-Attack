/*global jQuery, _ */

/**
 * Math.randomInt(high)
 * Math.randomInt(low, high)
 * Math.randomInt(low, high, interval)
 *
 * Returns a random intager in the range 0 -> high or low -> high inclusive.
 * if interval is defined then the return value will be
 * a multiple of the interval + low with a max value of high.
 */
Math.randomInt = function (low, high, interval){
	var out = 0;
	var num = Math.random();
	if (low !== undefined && high === undefined)
	{
		out = Math.round(num * low);
	}
	else if (low !== undefined && high !== undefined && interval === undefined)
	{
		out = Math.round(num * (high - low)) + low;
	}
	else if (low && high && interval)
	{
		var sub_high = (high - low) / interval;
		out = Math.round(num * sub_high);
		out = (out + low) * interval;
	}
	//log("Math.randomInt: low: "+low+", high: "+high+", interval: "+interval+", out: "+out);
	return out;
};

Array.prototype.shuffle = function(){
	var copy = this.splice(0, this.length), i;
	for (i=copy.length; i > 0; i--) {
		var pos = Math.randomInt(0, i-1);
		this.push(copy.splice(pos, 1)[0]);
	}
	return this;

};

/**
 * log()
 *
 * A generic logging function. Sends str to any available debugging consoles
 * /
window.log = function(str){
	// Firebug and generic consoles
	if (console && console.log){
		console.log(str);
	}
	// Opera
	else if (opera && opera.console){
		opera.console.log(str);
	}
}*/

/**
 * log()
 * A generic logging function. Passes any arguments to the correct log function
 * for the users browser. Resorts to alert() if can't find a log().
 */
window.log = function(){
	try{
		console.log.apply( console, arguments );
	} catch(e) {
		try {
			opera.postError.apply( opera, arguments );
		} catch(e2){
			alert( Array.prototype.join.call( arguments, " " ) );
		}
	}
};

// TODO: If no console is found, get the firebug lite bookmarklet.

if (window.jQuery)
{
	/**
	 * Add logging to jQuery
	 */
	jQuery.fn.extend({
		log : function(){
			var log_str = 'jQuery object. version: ' + this.jquery + '\n';
			log_str += 'selector: ' + this.selector + '\n';
			log_str += 'length: ' + this.length + '\n';
			if (this.length > 0)
			{
				this.each(function(i){
					log_str += '['+i+'] '+this.nodeName+'#'+this.id+'.'+this.className+'\n';
				});
			}
			window.log(log_str);
		},
		/**
		 * Add move() to jQuery
		 */
//		move : function(moveme, destination, method){
//			var methods = {appendTo:1, prependTo:1, insertBefore:1, insertAfter:1, replaceAll:1};
//			var ret = jQuery( moveme );
//			ret.each(function(){
//				if (this.parentNode)
//					this.parentNode.removeChild( this );
//					if (!methods[method])
//						method = 'appendTo';
//					jQuery(this)[method](destination);
//			});
//			/* Prevent memory leaks (Might need this?)
//			jQuery( "*", this ).add([this]).each(function(){
//				jQuery.event.remove(this);
//				jQuery.removeData(this);
//			});*/
//			return ret;
//		}

		/**
		 * Returns the first className that matches the given regular expression on the first element if the jQuery Object.
		 */
		getClassLike: function(regexp){
			if (this.length > 0) {

				var self = this[0],
					classNames = self.className.split(/\s+/),
					i, l;

				for (i=0, l=classNames.length; i<l; i++) {
					if (classNames[i].match(regexp)){
						return classNames[i];
					}
				}
				
			}
		}
	});
}

/*
 * Useful Underscore extensions
 */
if (typeof window._ !== 'undefined') { 
	/**
	 * Useful for extending high chart options.
	 * Do not use on objects with circular references, you will be here all day :)
	 * Contraversial array implimentation: _.extendDeep(['a', 'b', 'c', 'd'], ['x', 'k']) == ['x', 'k', 'c', 'd']
	 */
	_.extendDeep = function(obj){
		_.each(Array.prototype.slice.call(arguments, 1), function(source) {
			_.each(source, function(value, prop){
				if ( ! source.hasOwnProperty(prop) ) { 
					return;
				}
				else if ( _.isObject(source[prop]) ) {
					obj[prop] = _.extendDeep( _.isObject(obj[prop]) ? obj[prop] : {}, source[prop]);
				}
				else if ( _.isArray(source[prop]) ) {
					obj[prop] = _.extendDeep( _.isArray(obj[prop]) ? obj[prop] : [], source[prop]);
				}
				else if ( source[prop] !== void 0 ) {
					obj[prop] = source[prop];
				}
			});
		});
		return obj;
	};
}


function testExtendDeep(){
	return _.extendDeep(
		{
			hello: 'world', 
			obj: {one: 1, two: 2, four: 4, obj: {title: ''}}, 
			array: ['a', 'b', 'c', 'd'], 
			goodbye:'everybody'
		}, 
		{
			obj:{
				two: 'too', 
				three: 3,
				obj: {title: 'the name'}
			}, 
			array: ['x', 'y', 'z'], 
			goodbye: 'cruel world'
		}
	);
}


