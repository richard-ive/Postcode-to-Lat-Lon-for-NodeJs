var proj = require('./lib/geotool');
var conf = require('./conf/config');
var util = require('util');


point = {e:480530,n:203216};

let = proj.gridrefNumToLet(point.e,point.n,8);


console.log(proj.OSGridToLatLong(let));
