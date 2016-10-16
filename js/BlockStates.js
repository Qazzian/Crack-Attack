import Enum from 'js/tools/Enum';

// BLOCK_STATES
export default new Enum([
	'NULL',
	'ACTIVE', // Can be used. There is no animation active on this block.
	'NEW', // Model created but view has not
	'SWITCHING', // User is moving the block.
	'FALLING', // Filling up the space below.
	'RISING', // User can see it on the bottom row but cannot use it.
	'ACTIVATING', // Turning into a block from garbage.
	'REMOVING', // User has got it in a group waiting for the animation to end
	'REMOVED' // The Block model can be cleaned up
]);