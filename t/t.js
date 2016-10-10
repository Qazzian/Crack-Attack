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

import TestObj from 't/t_steal';


function testImports(testObj) {
    "use strict";

    QUnit.test ('steal.import', function (assert) {
        assert.ok(TestObj, 'imported object ok');
        var testInst = new TestObj();
        assert.equal(testInst.isDefined, true, 'Can create instances of the test object');
    })
};

testImports();
