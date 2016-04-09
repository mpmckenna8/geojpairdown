var fs = require('fs');
var split = require('split');

var GJV = require('geojson-validation');
var splitup = require('../splitup');

var pairDown = require('../index.js');

pairDown('./test/oceanCampusBuilds.geojson', './test/ocesimp');

//var thing = fs.readFileSync('./test/ocesimpfeats.json')


//console.log('might read to fast ', JSON.parse(thing.toString()))
