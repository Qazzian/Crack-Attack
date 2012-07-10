
interfaces that each module must adhere to:
	init - called by the controlling object's init method for first creating and setting up the child object.
	draw - called by the controlling object's draw method for drawing the child object on the screen.
	paint - called by the draw method for creating the first instance of this object.
	move - called by the draw method if the object is already on the screen.

Positions
	Board positions are generally passed around as an Array object with 2 elements. 
	The first element being the x co-ordinate, the second is the y.
	Board positions start at the bottom left hand corner of the board with an index of 0,0
	The first three rows (index 0-2) on the board are hidden to the user and out of play until a new row is un-shifted to the board
	There are also 12 rows hidden to the user above the board. This is so that garbage can stack up.


