

// splitup will take a array of geojson features and strip out out everything except the id, and return an array where the first is an array of geojson features and the second is an object with the ids as keys and properties stipped out as data
module.exports = function(featArr){

    var geojsonFeats =[];

//  Properties will be objects with a key of the osm_id
    var properties = [];

    var onFeat = {}

    for(i in featArr){

        console.log('feat getting split, ', featArr[i]);
      var jsonFeat;
      if(featArr[i].slice(-2) === ',\n'){

        jsonFeat = JSON.parse(featArr[i].slice(0,-2));
      }
      else{
        jsonFeat = JSON.parse(featArr[i])
      }
    //  console.log('the jsonfeat', jsonFeat)


        var pufeat = geojsonfeature(jsonFeat);


        geojsonFeats.push(pufeat);

        var endprop = slimprops(jsonFeat.properties);

      //  console.log(endprop)

        properties.push(endprop);

    }

    return [geojsonFeats, properties];

}




function geojsonfeature(feature, properties, geometry){

  var featObj = feature;

  var idProp = featObj.properties['osm_id'];


  return {
    "type":featObj.type,
    "properties":{"osm_id": idProp},
    "geometry": featObj.geometry
  }


}

function slimprops  (props){
      var endProps = {"osm_id": props.osm_id};

     var propkeys = Object.keys(props);

    //  console.log(propkeys);

      for(i in propkeys){
        if(props[propkeys[i]]){
          endProps[propkeys[i]] = props[propkeys[i]];
        }
      }

    return endProps;
}
