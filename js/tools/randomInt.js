/**
 * Created by ian-wallis on 11/10/2016.
 */
export default function randomInt(low, high, interval) {
	var out = 0;
	var num = Math.random();
	if (low !== undefined && high === undefined) {
		out = Math.round(num * low);
	}
	else if (low !== undefined && high !== undefined && interval === undefined) {
		out = Math.round(num * (high - low)) + low;
	}
	else if (low && high && interval) {
		var sub_high = (high - low) / interval;
		out = Math.round(num * sub_high);
		out = (out + low) * interval;
	}
	//log("Math.randomInt: low: "+low+", high: "+high+", interval: "+interval+", out: "+out);
	return out;
};