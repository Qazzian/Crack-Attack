import jQuery from 'jquery';


jQuery.fn.getClassLike = function (regexp) {
	if (this.length > 0) {

		var self = this[0],
			classNames = self.className.split(/\s+/),
			i, l;

		for (i = 0, l = classNames.length; i < l; i++) {
			if (classNames[i].match(regexp)) {
				return classNames[i];
			}
		}

	}
};

export default jQuery.fn.getClasslike;