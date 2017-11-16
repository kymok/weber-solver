/* Map */
var map;
var markers = [];
var centerMarker;
var centerMarkerIcon;

function initMap() {
  var initialLocation = {lat: 35.681167, lng: 139.767052};
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 13,
    center: initialLocation,
    clickableIcons: false,
    zoomControl: true,
    mapTypeControl: false,
    scaleControl: true,
    streetViewControl: false,
    rotateControl: false,
    fullscreenControl: true,
    styles:[{"elementType":"geometry","stylers":[{"saturation":-100}]},{"elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"elementType":"labels.text.fill","stylers":[{"saturation":-100},{"lightness":20}]},{"elementType":"labels.text.stroke","stylers":[{"color":"#e9e9e9"}]},{"featureType":"administrative.country","stylers":[{"visibility":"simplified"}]},{"featureType":"administrative.locality","stylers":[{"visibility":"on"}]},{"featureType":"administrative.neighborhood","stylers":[{"visibility":"simplified"}]},{"featureType":"administrative.province","stylers":[{"visibility":"simplified"}]},{"featureType":"landscape.man_made","elementType":"geometry","stylers":[{"color":"#e9e9e9"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#cfe0c9"}]},{"featureType":"road","elementType":"geometry","stylers":[{"color":"#f4f4f4"},{"weight":0.5}]},{"featureType":"road.arterial","elementType":"labels.text.fill","stylers":[{"color":"#888888"}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"color":"#d4d4d4"}]},{"featureType":"road.highway","elementType":"labels.text.fill","stylers":[{"color":"#888888"}]},{"featureType":"road.highway","elementType":"labels.text.stroke","stylers":[{"visibility":"off"}]},{"featureType":"road.local","elementType":"labels.text.fill","stylers":[{"color":"#aaaaaa"}]},{"featureType":"transit.line","elementType":"geometry","stylers":[{"color":"#d89e7c"},{"weight":1}]},{"featureType":"transit.line","elementType":"geometry.stroke","stylers":[{"color":"#edcebc"}]},{"featureType":"transit.station","stylers":[{"visibility":"on"}]},{"featureType":"transit.station","elementType":"geometry","stylers":[{"color":"#edcebc"}]},{"featureType":"transit.station","elementType":"labels.icon","stylers":[{"saturation":-60}]},{"featureType":"transit.station.airport","elementType":"geometry.fill","stylers":[{"color":"#d4d4d4"}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#8ac2ca"}]}]
  });
  centerMarkerIcon = {
    url: '../images/cursor.png',
    scaledSize: new google.maps.Size(80, 80),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(40, 40),
  };
  map.addListener('click', function(event) {
    addMarker(event.latLng);
  })
  initCenterMarker(initialLocation);
}

/* add + delete markers */
function addMarker(location) {
  // create draggable marker
  var marker = new google.maps.Marker({
    map: map,
    position: location,
    draggable: true,
  });
  // bind delete event
  marker.addListener('click', function() {
    deleteMarker(marker);
    computeCenter();
  })
  marker.addListener('drag', function() {
    hideCenterMarker();
  })
  marker.addListener('dragend', function() { // on location edit
    computeCenter();
  })
  // push back to array
  markers.push(marker);
  computeCenter();
}
function deleteMarker(marker) {
  var index = markers.indexOf(marker);
  marker.setMap(null);
  if (index != -1) {
    markers.splice(index, 1);
    console.log("deleted index " + index.toString() );
  }
}
function deleteMarkers() {
  setMapOnAll(null);
  markers = [];
  hideCenterMarker();
}
function setMapOnAll(map) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}

/* Center Marker */
function initCenterMarker(location) {
  centerMarker = new google.maps.Marker({
    map: null,
    position: location,
    draggable: false,
    clickable: false,
    //icon: 'http://maps.google.com/mapfiles/ms/icons/green.png'
    icon: centerMarkerIcon
  });
}
function hideCenterMarker() {
  centerMarker.setMap(null);
}

/* Solver */
var step = 100000.0; //meters
var minStep = 0.01; //meters
var maxIteration = 10000;
function weightFunction(d){1};

function loadWeightFunction() {
  var weightFunctionID = document.getElementById("weightFunctionSelector").value;
  if (weightFunctionID === "distance") {
    weightFunction = new Function('d', 'return d');
  }
  else {
    weightFunction = new Function('d', 'return 1');
  }
}

function computeCenter() {

  loadWeightFunction();
  if (markers.length < 3) {
    hideCenterMarker();
    return null;
  }

  // Compute
  var currentStep = step;
  var iteration = 0;
  var dx = dy = dx_ = dy_ = 0;
  centerMarker.setPosition(markers[0].position);

  while (true) {
    dx_ = dx;
    dy_ = dy;
    dx = dy = 0;

    markers.forEach(function(element) {
      // calc azimuth
      var azi = google.maps.geometry.spherical.computeHeading(
        centerMarker.getPosition(), element.getPosition()
      );
      var aziRadX = radians(90-azi);
      var dist = google.maps.geometry.spherical.computeDistanceBetween(
        centerMarker.getPosition(), element.getPosition()
      );

      // add to dx, dy
      dx += Math.cos(aziRadX) * weightFunction(dist);
      dy += Math.sin(aziRadX) * weightFunction(dist);
    });
    var normaliseFactor = 1/Math.sqrt(dx * dx + dy * dy);
    dx *= normaliseFactor;
    dy *= normaliseFactor;

    // feedback

    var oldPosition = centerMarker.getPosition();
    var newPosition = google.maps.geometry.spherical.computeOffset(
      oldPosition,
      currentStep,
      degrees(90-Math.atan2(dy, dx))
    );
    centerMarker.setPosition(newPosition);

    // step back if needed
    if (dx_*dx + dy_*dy < 0) {
      currentStep *= 0.5;
    }
    else {
      currentStep *= 1.1;
      currentStep = Math.min(10000000, currentStep); // Limit stride to 1/4 of equator
    }

    // loop end
    iteration++;
    if ((currentStep < minStep) || (iteration > maxIteration)) {
      break;
    }
  }
  console.log(iteration);
  centerMarker.setMap(map);
}


/* angle conversion */
function radians(angleDeg) {
  return angleDeg * Math.PI / 180.0;
}
function degrees(angleRad) {
  return angleRad * 180.0 / Math.PI;
}
