/* 
 * StateChanger.js
 * 
 * Responsible for checking the state of individual blocks and triggering appropriate events for them.
 */

ca.StateChanger = {
	
	board: null,
	manager: null,
	
	// The block at the given position has just been moved here.
	onBlockMove: function(blockPos){
		// check in order
			// Will it fall
			// does it complete a set
		
	},
	
	onBlockRemoved: function(blockPos) {
		
	},
	
	// When a row is added all the animations need to change their target row.
	onRowAdded: function(){
		
	},
	
	willBlockFall: function(blockPos){
		
	},
	
	isBlockInSet: function(blockPos){
		
	}
	
	
}


