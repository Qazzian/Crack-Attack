# Crack Attack js

Recreating the popular Linux game Crack-Attack for the internet generation

# Build command

$ npm install
$ ./node_modules/.bin/babel ./js -s -d ./build

# TODO

* Add require.js or similar

* Need to split first load functions from game init.
	Clicking the init button causes new elements to be created but the old ones are not deleted.
	Also a likely source of memory leaks with the number of circular references there are.
	The GC won't remove top level objects if their children also have handles on them.

# Dev notes

## interfaces that each module must adhere to:

init - called by the controlling object's init method for first creating and setting up the child object.
draw - called by the controlling object's draw method for drawing the child object on the screen.
paint - called by the draw method for creating the first instance of this object.
move - called by the draw method if the object is already on the screen.

## Positions

Board positions are generally passed around as an Array object with 2 elements.
The first element being the x co-ordinate, the second is the y.
Board positions start at the bottom left hand corner of the board with an index of 0,0
The first three rows (index 0-2) on the board are hidden to the user and out of play until a new row is un-shifted to the board
There are also 12 rows hidden to the user above the board. This is so that garbage can stack up.


## Css rules for block heights

.block.row_0 { bottom: 0%; }
.block.row_1 { bottom: 3.7%; }
.block.row_2 { bottom: 7.4%; }
.block.row_3 { bottom: 11.100000000000001%; }
.block.row_4 { bottom: 14.8%; }
.block.row_5 { bottom: 18.5%; }
.block.row_6 { bottom: 22.200000000000003%; }
.block.row_7 { bottom: 25.900000000000002%; }
.block.row_8 { bottom: 29.6%; }
.block.row_9 { bottom: 33.300000000000004%; }
.block.row_10 { bottom: 37%; }
.block.row_11 { bottom: 40.7%; }
.block.row_12 { bottom: 44.400000000000006%; }
.block.row_13 { bottom: 48.1%; }
.block.row_14 { bottom: 51.800000000000004%; }
.block.row_15 { bottom: 55.5%; }
.block.row_16 { bottom: 59.2%; }
.block.row_17 { bottom: 62.900000000000006%; }
.block.row_18 { bottom: 66.60000000000001%; }
.block.row_19 { bottom: 70.3%; }
.block.row_20 { bottom: 74%; }
.block.row_21 { bottom: 77.7%; }
.block.row_22 { bottom: 81.4%; }
.block.row_23 { bottom: 85.10000000000001%; }
.block.row_24 { bottom: 88.80000000000001%; }
.block.row_25 { bottom: 92.5%; }
.block.row_26 { bottom: 96.2%; }
.block.row_27 { bottom: 99.9%; }


## Js to generate the css rules

    var str = '';for (var i=0,j=3.7; i*j<101; i++){str += '.block.row_'+i+' { bottom: '+ (i*j) + '%; }\n';} console.log(str);
