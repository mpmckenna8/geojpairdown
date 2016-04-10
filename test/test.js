var fs = require('fs');
var split = require('split');
var q = require('q')
var GJV = require('geojson-validation');
var splitup = require('../splitup');

var pairDown = require('../index.js');

var pair = pairDown('./test/oceanCampusBuilds.geojson', './test/oceansimp');



//var thing = fs.readFileSync('./test/ocesimpfeats.json')


//console.log('might read to fast ', JSON.parse(thing.toString()))
