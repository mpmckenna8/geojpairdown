
// Should take a geojson thing and return 2 objects
// a paired down geojson
// all the attribues in json
var fs = require('fs');
var GJV = require('geojson-validation');
var splitup = require('./splitup');


module.exports = function(infi, outname){
  var commandfi = infi || process.argv[2];

  var outter = outname || process.arv[3];



  console.log('comm fi;', commandfi)

    console.log(infi,outter)

    var geoStream = fs.createReadStream(infi); //.pipe(split('}'))

    var jsonWriteStream = fs.createWriteStream(outter + 'feats.json');

    var geoJsonWrite = fs.createWriteStream(outter + ".geojson")


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
        console.log('going to next blob')
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

    geoJsonWrite.write('\n]}');

    return true;

    })


    geoStream.on('error', function(d, err){
      console.log('fuooey there was an err', d)

    })





    function startIt(q){
    //  var strbuff = .toString();
    //  find the "features" string and end the object there with a header


    //  console.log('index start of feats: ', q.toString().indexOf('features": ['))
      var datString = q.toString();

      var geoStarter = q.toString().indexOf('features": [')

      var featuresIndex = q.toString().slice(0, geoStarter+ ('features": [').length +1);

    //  console.log('feat index?? this is written\n',featuresIndex)

      console.log('end of writin start')
      //write first part of geojson to file;
      geoJsonWrite.write(featuresIndex);
      jsonWriteStream.write('{');

      geojsonObjTester = JSON.parse(featuresIndex + "]\n}");
      console.log('got a good start', geojsonObjTester)

      var features = '';


      //  console.log(datString.slice(geoStarter+12).split('{ "type": "Feature"'))
      // slices off the intro part which was already written to the geojson
      var featuresCutting = datString.slice( -(datString.length - (geoStarter + ('features":[').length)))

      console.log('cutting feats: ', featuresCutting);

      var featArr = featuresCutting.split('{ "type": "Feature"'); //datString.slice(geoStarter+12).split('{ "type": "Feature"');

// not sure why i have to do this
      featArr.shift();

      console.log('feat areay is: \n', featArr);


      console.log('end of feat array')


      // makes the features into usable objects if possible.
      var incomFeats = mapRest(featArr);


      console.log('and the maped feats,', incomFeats)
      // now filter out incomplete one and add to nextFeatStart

      var filteredFeats = filterFeatures(incomFeats);

      console.log('incomfeats here', JSON.parse(filteredFeats[1]))
      console.log('ender')

      var togo = splitup(filteredFeats);

      console.log(togo)

      writeToFile(togo);



    }



      // nextFeatures takes the next data chunk, segments it by feat while adding nextFeatStart to the
      // beginnging of the first objsct and then adding all those features to the geojsonObjTester.features
      //
      function nextFeatures(blob){
        console.log('nextFeats', nextFeatStart + blob.toString())

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
            return (fea + ',\n');

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
          console.log(lastie)
          lastie = lastie.slice(0, -9);
          blah.push(lastie);

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


      function jParseFeats(arrS){
        var retArr = [];
        for (i in arrS){
         retArr.push( JSON.parse(arrS[i]))
        }

        return retArr;
      }

      function mapRest(featStrings){

        var endfeat = featStrings.map(function(d){

         var newfeature = '{ "type": "Feature"' + d;

           console.log('end of feat', newfeature.slice(-4) === ']\n}\n');
           // if the feature is the last one fix it
           if(newfeature.slice(-4)=== ']\n}\n'){
               console.log('last ending thing ');
               newfeature = newfeature.slice( 0, newfeature.length-5 )
           }
           // take the , off the preceeding features
           else if(newfeature.slice(-2) === ',\n'){
             newfeature = newfeature.slice(0, newfeature.length-2);
           }
           //console.log('the newfeat:\n', newfeature);
           return newfeature;
       })

       return endfeat;

      }


      // filter out incomplete one and add to nextFeatStart
      function filterFeatures(fil){
          var comFeats = [];

          return fil.filter(function(d){
            console.log(d.slice(-3))
            if(d.slice(-5)=== '] } }'){
              console.log('got a completeee');
              return d;
            }
            else{
              nextFeatStart += d;
            }

          })



      }

}
