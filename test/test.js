var fs = require('fs');
var splitup = require('../splitup');

var pairDown = require('../index.js');



var pair = pairDown('./test/oceanCampusBuilds.geojson', './test/oceansimp');


console.log(fs.readdirSync('./test'));

console.log(process.argv)


//var thing = fs.readFileSync('./test/ocesimpfeats.json')


//console.log('might read to fast ', JSON.parse(thing.toString()))
