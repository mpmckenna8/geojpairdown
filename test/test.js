var fs = require('fs');
var split = require('split');

var GJV = require('geojson-validation');
var splitup = require('../splitup');

var pairDown = require('../index.js');

pairDown('oceanCampusBuilds.geojson', 'ocesimp')

/*

var geoStream = fs.createReadStream( 'oceanCampusBuilds.geojson') //.pipe(split('}'))

var jsonWriteStream = fs.createWriteStream('testy.json');

jsonWriteStream.write('blah blop')

var geoString = "";

var geojsonObjTester= {};

var nextFeatStart = "";


var passedFeatCount = 0;


geoStream.on('open', function(d){
  //console.log('hopla', d)

})

var begin = true;

geoStream.on('data', function(d){
  //console.log('data')
  if(d){

    geoString += d.toString();

  }
  if (begin) {
  //  console.log('who ha ', d.toString())

    startIt(d)
    begin = false;
  }
  else{
    nextFeatures(d)
// console.log(d.toString())
  }
})


geoStream.on('end', function(d){

 console.log('stream done with ', typeof(geoString), geoString.length)

 jsonWriteStream.write(geoString);
 //console.log(geoString)
 var go = JSON.parse(geoString);
 //console.log(go.type)

// console.log("blah".indexOf('a'))

})


geoStream.on('error', function(d, err){
  console.log('fuooey there was an err', d)

})

//geo.pipe(process.stdout);


function startIt(q){
//  var strbuff = .toString();
//  find the "features" string and end the object there with a header

  console.log('index start of feats: ', q.toString().indexOf('features": ['))
  var datString = q.toString();

  var geoStarter = q.toString().indexOf('features": [')

  var featuresIndex = q.toString().slice(0, geoStarter+ 12) + "]\n}";

  //console.log(featuresIndex + "]\n}");

  geojsonObjTester = JSON.parse(featuresIndex);
//  console.log('got a good start')
//  console.log(featuresIndex)

  var features = '';

//  console.log(datString.slice(geoStarter+12).split('{ "type": "Feature"'))
  var featArr =  datString.slice(geoStarter+12).split('{ "type": "Feature"');

  var incomFeats = featArr.map(function(d){
    var newfeature = '{ "type": "Feature"' + d;

    return newfeature;
  //  console.log(d)
  })

  finFeats = incomFeats.filter(function(d){
//    console.log(d.slice(-5))

    return d.slice(-2) === ",\n";

  })



  if(finFeats.length !=  featArr.length){

    nextFeatStart = '{ "type": "Feature"' + featArr[featArr.length-1];

//    console.log('got this extra', nextFeatStart)
  }




  finFeats.map(function(mayFeat){
      var comFeat = {}

      geojsonObjTester.features.push((JSON.parse(mayFeat.slice(0,-2))))

//      console.log(geojsonObjTester)

   if(comFeat === (mayFeat)){
      console.log('compleeater')
    }
  })

  console.log(GJV.valid(geojsonObjTester))

  console.log('got ' + geojsonObjTester.features.length + ' valid features for this geojson');


  splitup(finFeats)
  passedFeatCount = geojsonObjTester.features.length;
  geojsonObjTester.features = [];

}



// nextFeatures takes the next data chunk, segments it by feat while adding nextFeatStart to the
// beginnging of the first objsct and then adding all those features to the geojsonObjTester.features
//
function nextFeatures(blob){
//  console.log(nextFeatStart + blob.toString())
  var newFeatStr = nextFeatStart + blob.toString();


  var newFeatArr = splitFeatures(newFeatStr);
  //console.log(newFeatStr)

//    console.log(newFeatArr)
    newFeatArr.map(function(fea){
    //  console.log((fea.slice(1)))
  //    console.log('wha')
      var featObj = JSON.parse(fea);
      geojsonObjTester.features.push(featObj);



      return JSON.parse(fea)
    })
    var testbatch = GJV.valid(geojsonObjTester);

    if(testbatch){
      console.log('got ' + geojsonObjTester.features.length + ' valid features for this geojson');
    }

}



function splitFeatures(featStr){

  var splfeatEnds = featStr.split('] } },\n')
  console.log(splfeatEnds.length)
  var blah;

   blah = splfeatEnds.map(function(d){
//  console.log('each thing', d)
    return  d + '] } }';
  })


  var lastie = blah.pop();

  //console.log('need this')
  //console.log( lastie.slice(-9));

  var ender = "]\n}\n" +
    "] } }"

  if(lastie.slice(-9) === ender){
    //console.log('this is the end')

  }
  else{
    nextFeatStart = lastie;
  }


  return blah

}
*/
