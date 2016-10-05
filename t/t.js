import QUnit from 'steal-qunit';

function runSanityCheck(QUnit) {
    "use strict";

    QUnit.module('Qunit sanity checks');
    QUnit.test('QUnit is defined', function (assert) {
        assert.expect(1);
        assert.ok(QUnit, 'QUnit is defined');
    });
};

runSanityCheck(QUnit);

// steal.import('t/t_BlockManager');
