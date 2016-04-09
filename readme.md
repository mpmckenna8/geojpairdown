
This is to split up a geojson file which may have a lot of attributes, and just
give it one id attribute and another file which all or the specified fields which
can then be joined to the other layer when/if required.

caveats:
  right now designed just to handle OSM files coming out of qgis in geojson format.
  only designed/tested with polygon features.
  there's a , after the last feature in the features json.
  a bunch of sloppy console.log ing

  
