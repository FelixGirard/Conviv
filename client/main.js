import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Rues } from '../imports/api/data.js'

import './main.html';

var directionsService = new google.maps.DirectionsService;
var directionsDisplay = new google.maps.DirectionsRenderer;
var mtlcenter = new google.maps.LatLng(45.514609, -73.636982);
var dest =  new google.maps.LatLng(45.496270, -73.568704);

var feats = [];
var test = {"type": "FeatureCollection",
"features":feats}
    Meteor.call('getRues', {
    }, (err, res) => {
      if (err) {
        alert(err);
      } else {
        // success!
        test = {"type": "FeatureCollection",
        "features":res};
        map.data.addGeoJson(test);
        //var bikeLayer = new google.maps.BicyclingLayer();
        //bikeLayer.setMap(map);
      }
    });

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
  window.map = new google.maps.Map(document.getElementById("map-canvas"),
    mapOptions);

  map.setCenter(mtlcenter);
  var marker = new google.maps.Marker({
    position: mtlcenter,
    title:'My Position',
    icon:'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
  });
  marker.setMap(map);

  map.data.addGeoJson(test);

  map.data.setStyle(function(feature) {
      var code = feature.getProperty('code');
      console.log(code);
      var color = 'black';
      if(code == "2. Jaune")
        color = "green";
      if(code == "1. Vert")
        color = "yellow";
      if(code == "3. Rouge")
        color = "red";
      console.log(color);
      return {
        strokeColor: color,
        strokeWeight: 3
      };
    });
  //var bikeLayer = new google.maps.BicyclingLayer();
  //bikeLayer.setMap(map);

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
