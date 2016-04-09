
// Should take a geojson thing and return 2 objects
// a paired down geojson
// all the attribues in json
var fs = require('fs');
var GJV = require('geojson-validation');
var splitup = require('./splitup');


module.exports = function(infi, outname){


    console.log(infi,outname)

    var geoStream = fs.createReadStream( infi); //.pipe(split('}'))

    var jsonWriteStream = fs.createWriteStream(outname + 'feats.json');

    var geoJsonWrite = fs.createWriteStream(outname + ".geojson")


    var geoString = "";

    var geojsonObjTester= {};

    var nextFeatStart = "";


    var passedFeatCount = 0;

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

    // console.log('stream done with ', typeof(geoString), geoString.length)

     //console.log(geoString)
     var go = JSON.parse(geoString);
     //console.log(go.type)

    // console.log("blah".indexOf('a'))

    jsonWriteStream.write('}')

    geoJsonWrite.write('\n]}')

    })


    geoStream.on('error', function(d, err){
      console.log('fuooey there was an err', d)

    })



    function startIt(q){
    //  var strbuff = .toString();
    //  find the "features" string and end the object there with a header



      console.log('index start of feats: ', q.toString().indexOf('features": ['))
      var datString = q.toString();

      var geoStarter = q.toString().indexOf('features": [')




      var featuresIndex = q.toString().slice(0, geoStarter+ 12);

      //write first part of geojson to file;
      geoJsonWrite.write(featuresIndex);
      jsonWriteStream.write('{');


      geojsonObjTester = JSON.parse(featuresIndex + "]\n}");
    //  console.log('got a good start')

      var features = '';

    //  console.log(datString.slice(geoStarter+12).split('{ "type": "Feature"'))
      var featArr =  datString.slice(geoStarter+12).split('{ "type": "Feature"');

      var incomFeats = featArr.map(function(d){
        var newfeature = '{ "type": "Feature"' + d;

        return newfeature;
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

    //    console.log('finFeats in start ', finFeats)
        var writeArr = splitup(finFeats);
        console.log('things to write to file', writeArr[0].length)

        writeToFile(writeArr);


        passedFeatCount = geojsonObjTester.features.length;
        geojsonObjTester.features = [];


    }





      // nextFeatures takes the next data chunk, segments it by feat while adding nextFeatStart to the
      // beginnging of the first objsct and then adding all those features to the geojsonObjTester.features
      //
      function nextFeatures(blob){
      //  console.log(nextFeatStart + blob.toString())

        geoJsonWrite.write(',\n');
        jsonWriteStream.write(',\n');

        var newFeatStr = nextFeatStart + blob.toString();


        var newFeatArr = splitFeatures(newFeatStr);
        //console.log(newFeatStr)

      //    console.log(newFeatArr)
        var finFeats =  newFeatArr.map(function(fea){
          //  console.log((fea.slice(1)))
        //    console.log('wha')
            var featObj = JSON.parse(fea);
            geojsonObjTester.features.push(featObj);



            return (fea + ',\n')
          })


          var testbatch = GJV.valid(geojsonObjTester);



          if(testbatch){
            console.log('got ' + geojsonObjTester.features.length + ' valid features for this geojson');
          }

        //  console.log('addto feats', (finFeats), newFeatArr)
        var writeArr = splitup(finFeats);
        writeToFile(writeArr);



      }


      function splitFeatures(featStr){

        var splfeatEnds = featStr.split('] } },\n')
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
          console.log('this is the end')

        }
        else{
          nextFeatStart = lastie;
        }

        return blah

      }



      // add geoFeats to geoJsonWrite and simp feats to jsonWriteStream
      function writeToFile(splitFeat){
        var geoFeats = splitFeat[0];
        var features = splitFeat[1];

          for(i in geoFeats){
            console.log('length of feats to write', features.length)

            var simpFeat = '"' + features[i].osm_id + '":' + JSON.stringify(features[i]);
            if(i < features.length-1){
            //  console.log('heyyyyyyy')
                simpFeat +=  ',\n'
                }

            jsonWriteStream.write(simpFeat);


            var simpgeo = JSON.stringify(geoFeats[i])

            if(i < geoFeats.length-1){

                simpgeo += ',\n';
            }

        //    console.log(simpgeo)

            geoJsonWrite.write(simpgeo);

          }

        //  console.log(geoFeats);

      }


}
