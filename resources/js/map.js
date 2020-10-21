var locations = [
  '1600 pennsylvania ave, washington dc',
  '935 pennsylvania ave, washington dc'
];
var zoom = 15;
var center =  [ 38.895345, -77.030101 ];

function createRoute(_locations, _zoom, _center) {

  var map;
  var dir;

  map = L.map('map', {
    layers: MQ.mapLayer(),
    center: center,
    zoom: zoom
  });

  dir = MQ.routing.directions();

  dir.route({
    locations: locations
  });

  map.addLayer(MQ.routing.routeLayer({
    directions: dir,
    fitBounds: true
  }));
}
