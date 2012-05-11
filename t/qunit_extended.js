/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


QUnit.has = function(actual, expected, message){
	console.log("QUnit.has has been called");
	QUnit.push(QUnit.hasProperties(actual, expected), actual, expected, message);
};

QUnit.hasProperties = function(actual, expected) {
	for (var e in expected) {
		if ( !QUnit.equiv(actual[e], expected[e]) ) {
			return false;
		}
	}
	
	return true;
}