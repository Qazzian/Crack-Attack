// import Backbone from "backbone";


// import $ from "jquery";
// import _ from "underscore";

// window._ = _;
console.log('running t.js');

import QUnit from 'steal-qunit';

// steal('steal-qunit', function(QUnit){
// "use strict";

function runTest(QUnit) {
    "use strict";

    console.log('loaded qUnit', QUnit);

    QUnit.module('Qunit sanity checks');
    console.log('module setup', typeof QUnit.module, typeof QUnit.test);
    debugger;
    QUnit.test('QUnit is defined', function (assert) {
        assert.expect(1);
        assert.ok(QUnit, 'QUnit is defined');
        console.info('ran test');
    });

    console.log('defined test');
};

runTest(QUnit);

// });

// System.import("qunitjs").then(runTest);
// steal.import('t/t_BlockManager');
