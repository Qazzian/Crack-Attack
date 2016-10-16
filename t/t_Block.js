import QUnit from 'steal-qunit';
import Block from 'js/Block';

QUnit.module('Block');

QUnit.test('Block basics', function (assert) {
	assert.ok(Block, 'Block is defined');
	assert.equal(typeof Block, 'function', 'Block is a constructor');
	var myBlock = new Block();
	assert.ok(myBlock, 'Can create instances of Block');
});

QUnit.test('Block Interface', function (assert) {
	var myBlock = new Block();
	assert.equal(myBlock.id, 0, 'id attribute');
	assert.equal(myBlock.colour, '', 'colour attribute');
	assert.equal(myBlock.isSpecial, false, 'isSpecial flag');
	assert.equal(myBlock.state, 0, 'state attribute');
	assert.equal(myBlock.isAnimating, false, 'isAnimating flag');
	assert.equal(myBlock.pos, null, 'pos attribute');

	assert.ok(myBlock.init(), 'Block.init works');
});

QUnit.test('Block.draw', function (assert) {
	var myBlock = new Block();
	myBlock.init({colour: 'orange'});
	var $blockDom = myBlock.draw(2,5);
	assert.ok($blockDom, 'Block renders it\'s self');
	assert.ok($blockDom.hasClass('col_2'), 'rendered with the correct column number');
	assert.ok($blockDom.hasClass('row_5'), 'rendered with the correct row number');
	assert.ok($blockDom.hasClass('orange'), 'rendered with the correct colour');
});