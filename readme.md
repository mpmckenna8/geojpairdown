
This is to split up a geojson file which may have a lot of attributes, and just
give it one id attribute and another file which all or the specified fields which
can then be joined to the other layer when/if required.

For an example of how to use it check see if it works with your geojson see the test directory
and specifically the test.js file for a implementation.


Basically you require it and give it the first argument as a string path to your file and
the second argument as the beginning of the file output.

So like in the sample if you do

var pairDown = require('../index.js');

var pair = pairDown('./test/testfile.geojson', './test/tester');


This will output in the test directory a file tester.geojson and testerfeats.json with the Basically
geojson in one and the feature data in the json.


caveats:
  right now designed just to handle OSM files coming out of qgis in geojson format.
  only designed/tested with polygon features.
  a bunch of sloppy console.log ing


What's going on

In index js

Initialize all the filestreams

On each data event the first chunk gets called with startit() and the following ones with nextFeatStart()


startit starts making a file then starts to split it up
