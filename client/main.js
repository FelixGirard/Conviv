import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Rues } from '../imports/api/data.js';

import './main.html';

// Template.hello.onCreated(function helloOnCreated() {
//   // counter starts at 0
//   this.counter = new ReactiveVar(0);
// });
//
// Template.hello.helpers({
//   counter() {
//     return Template.instance().counter.get();
//   },
// });
//
// Template.hello.events({
//   'click button'(event, instance) {
//     // increment the counter when button is clicked
//     instance.counter.set(instance.counter.get() + 1);
//   },
// });

var mtlcenter = new google.maps.LatLng(45.514609, -73.636982);
var dest =  new google.maps.LatLng(45.496270, -73.568704);

function calcRoute() {
  var request = {
      origin: mtlcenter,
      destination: dest,
      // Note that Javascript allows us to access the constant
      // using square brackets and a string value as its
      // "property."
      travelMode: google.maps.TravelMode.DRIVING
  };
  console.log("xd");
  directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
    }
  });
}

if (Meteor.isClient) {
  Meteor.startup(function() {
    GoogleMaps.load();
  });
}

Template.body.helpers({
  exampleMapOptions: function() {
    // Make sure the maps API has loaded
    if (GoogleMaps.loaded()) {
      // Map initialization options
    }
  }
});

Template.mapPostsList.rendered = function() {
  var directionsService = new google.maps.DirectionsService;
  var directionsDisplay = new google.maps.DirectionsRenderer;
  var mapOptions = {
    zoom: 12,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  map = new google.maps.Map(document.getElementById("map-canvas"),
    mapOptions);

  map.setCenter(mtlcenter);
  var marker = new google.maps.Marker({
    position: mtlcenter,
    title:'My Position',
    icon:'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
  });
  marker.setMap(map);

  var bikeLayer = new google.maps.BicyclingLayer();
  bikeLayer.setMap(map);

  directionsDisplay.setMap(map);

  Session.set('map', true);
};

Template.hello.events({
  'click button'(event, instance) {
    // increment the counter when button is clicked
    calcRoute();
  },
});

// Template.body.onCreated(function() {
//   // We can use the `ready` callback to interact with the map API once the map is ready.
//   GoogleMaps.ready('ConvivMap', function(map) {
//     // Add a marker to the map once it's ready
//     // var marker = new google.maps.Marker({
//     //   position: map.options.center,
//     //   map: map.instance
//     // });
//     //var direction = new google.maps.
//
//     // var directionsService = new google.maps.DirectionsService;
//     // var directionsDisplay = new google.maps.DirectionsRenderer({
//     //   draggable: true,
//     //   map: map,
//     //   panel: document.getElementById('right-panel')
//     // });
//
//     var marker = new google.maps.Marker({
//       position: new google.maps.LatLng(45.514609, -73.636982),
//       map: map.instance
//     });
//   });
// });
