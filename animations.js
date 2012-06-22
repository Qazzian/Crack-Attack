
ca.Animations = {
	
	// ms to fall 1 row.
	fallSpeed: 100,
	// ms to move 1 col.
	switchSpeed: 75,
	
	onStep: function(now, fx){
		// Need to check for new rows being added.
		// Also possible that the block now needs to fall further or not as far depending on the users actions
	},
	
	switchBlock: function(block, startPos, endPos, callback){
		var $block = block.$domobj,
			startCol = startPos[0],
			endCol = endPos[0],
			colDiff = startCol - endCol,
			moveDirection, css, options, onEnd, zIndex;
			
		if (colDiff === 0) {
			return callback();
		} 
		else if (colDiff < 0) {
			moveDirection = 'right';
			zIndex = 995;
			$block.css('z-index', 995);
		}
		else if (colDiff > 0) {
			moveDirection = 'left';
			zIndex = 990;
		}
		
		onEnd = function(){
			block.isAnimating = false;
			$block.css('z-index', '');
			console.log("Animation end: ", block.id);
			callback(block);
		};
		
		block.isAnimating = true;
		$block.css({
			'left': ca.positions.cols[startPos[0]] + '%',
			'z-index': zIndex
		});
		
		css = {left: ca.positions.cols[endPos[0]] + '%'};
		options = {
			duration: ca.Animations.switchSpeed,
			easing: '',
			complete: onEnd,
			step: ca.Animations.onStep
		};
		console.log("Animate: ", block.id, css, options);
		
		$block.animate(css, options);
	},
	
	dropBlock: function($blockElmt, targetPos, callback){
		var css = {height: ca.positions.rows[targetPos[1]]},
			duration = parseInt(css.height, 10) - parseInt($blockElmt.css.height, 10) * ca.Animations.fallSpeed,
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
	
	
};