
ca.Animations = {
	
	// ms to fall 1 row.
	fallSpeed: 1000,
	
	onStep: function(now, fx){
		// Need to check for new rows being added.
		// Also possible that the block now needs to fall further or not as far depending on the users actions
	},
	
	switchBlocks: function(leftPos, rightPos){
		$leftBlock.css('z-index', 995);
		$rightBlock.css('z-index', 990);
		
			
	},
	
	dropBlock: function($blockElmt, targetPos, callback){
		var css = {height: ca.positions.rows[targetPos[1]]},
			duration = parseInt(css.height) - parseInt($blockElmt.css.height) * ca.Animations.fallSpeed,
			options = {
				duration: duration, 
				easing: "easeOutBounce", 
				complete: callback,
				step: ca.Animations.onStep
			};
			
		$blockElmt.animate(css, options);
	},
	
	dropGarbage: function($garbageElmt, targetPos, callback){
		
	},
	
	raiseBoard: function(delta, callback){
		
	}
	
	
}