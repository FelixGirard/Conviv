import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Rues } from '../imports/api/data.js';

import './main.html';


var directionsService = new google.maps.DirectionsService;
var directionsDisplay = new google.maps.DirectionsRenderer;
var mtlcenter = new google.maps.LatLng(45.514609, -73.636982);
var dest =  new google.maps.LatLng(45.496270, -73.568704);

function displayRoute(service, display, origine=mtlcenter, destination=dest) {
  console.log("xdé");
  service.route({
    origin: origine,
    destination: destination,
    //waypoints: [{location: 'Montreal, QBC'}, {location: 'Montreal, QBC'}],
    travelMode: google.maps.TravelMode.DRIVING,
  }, function(response, status) {
    console.log("xdé");
    if (status === google.maps.DirectionsStatus.OK) {
      display.setDirections(response);
      console.log("xdé");
    } else {
      alert('Could not display directions due to: ' + status);
    }
  });
}

if (Meteor.isClient) {
  Meteor.startup(function() {
    //GoogleMaps.load();
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

  //Session.set('map', true);
};

Template.menu.events({
  'click button'(event, instance) {
    // increment the counter when button is clicked
    var start = $("#txtorigin").val();
    var end = $("#txtdest").val();
    if (start != "" && end != "")
    {
      displayRoute(directionsService, directionsDisplay, start, end);
    }else{
      displayRoute(directionsService, directionsDisplay);
    }
  },
});
