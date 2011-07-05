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
	if (low && !high)
	{
		out = Math.round(num * low);
	}
	else if (low && high && !interval)
	{
		out = Math.round(num * (high - low)) + low;
	}
	else if (low && high && interval)
	{
		var sub_high = (high - low) / interval
		out = Math.round(num * sub_high);
		out = (out + low) * interval;
	}
	//log("Math.randomInt: low: "+low+", high: "+high+", interval: "+interval+", out: "+out);
	return out;
}

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
		} catch(e){
			alert( Array.prototype.join.call( arguments, " " ) );
		}
	}
}

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
		}/*,*/
		/**
		 * Add move() to jQuery
		 */
// 		move : function(moveme, destination, method){
// 			var methods = {appendTo:1, prependTo:1, insertBefore:1, insertAfter:1, replaceAll:1};
// 			var ret = jQuery( moveme );
// 			ret.each(function(){
// 				if (this.parentNode)
// 					this.parentNode.removeChild( this );
// 					if (!methods[method])
// 						method = 'appendTo';
// 					jQuery(this)[method](destination);
// 			});
// 			/* Prevent memory leaks (Might need this?)
// 			jQuery( "*", this ).add([this]).each(function(){
// 				jQuery.event.remove(this);
// 				jQuery.removeData(this);
// 			});*/
// 			return ret;
// 		}
	})
}