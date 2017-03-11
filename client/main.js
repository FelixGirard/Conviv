import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Rues } from '../imports/api/data.js';

import './main.html';


var directionsService = new google.maps.DirectionsService;
var directionsDisplay = new google.maps.DirectionsRenderer;
var mtlcenter = new google.maps.LatLng(45.514609, -73.636982);
var dest =  new google.maps.LatLng(45.496270, -73.568704);
var txt_origin_lat;
var txt_origin_lng;
var txt_dest_lat;
var txt_dest_lng;


var test = {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "properties": {
          "letter": "G",
          "color": "blue",
          "rank": "7",
          "ascii": "71"
        },
        "geometry": {
          "type": "Polygon",
          "coordinates": [
            [
              [123.61, -22.14], [122.38, -21.73], [121.06, -21.69], [119.66, -22.22], [119.00, -23.40],
              [118.65, -24.76], [118.43, -26.07], [118.78, -27.56], [119.22, -28.57], [120.23, -29.49],
              [121.77, -29.87], [123.57, -29.64], [124.45, -29.03], [124.71, -27.95], [124.80, -26.70],
              [124.80, -25.60], [123.61, -25.64], [122.56, -25.64], [121.72, -25.72], [121.81, -26.62],
              [121.86, -26.98], [122.60, -26.90], [123.57, -27.05], [123.57, -27.68], [123.35, -28.18],
              [122.51, -28.38], [121.77, -28.26], [121.02, -27.91], [120.49, -27.21], [120.14, -26.50],
              [120.10, -25.64], [120.27, -24.52], [120.67, -23.68], [121.72, -23.32], [122.43, -23.48],
              [123.04, -24.04], [124.54, -24.28], [124.58, -23.20], [123.61, -22.14]
            ]
          ]
        }
      }
    ]
  };

// -- AUTO COMPLETE START --
  var placeSearch, autocomplete;

  function initAutocomplete() {
    // Create the autocomplete object, restricting the search to geographical
    // location types.
    autocomplete = new google.maps.places.Autocomplete(
        /** @type {!HTMLInputElement} */(document.getElementById('autocomplete')),
        {types: ['geocode']});

    // When the user selects an address from the dropdown, populate the address
    // fields in the form.
    autocomplete.addListener('place_changed', fillInAddress);
  }

  function fillInAddress() {
    // Get the place details from the autocomplete object.
    var place = autocomplete.getPlace();

    txt_origin_lat = place.geometry.location.lat();
    txt_origin_lng = place.geometry.location.lng();
  }

  // Bias the autocomplete object to the user's geographical location,
  // as supplied by the browser's 'navigator.geolocation' object.
  function geolocate() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var geolocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        var circle = new google.maps.Circle({
          center: geolocation,
          radius: position.coords.accuracy
        });
        autocomplete.setBounds(circle.getBounds());
      });
    }
  }
// -- AUTO COMPLETE END --

// -- AUTO COMPLETE START --
  var dplaceSearch, dautocomplete;

  function dinitAutocomplete() {
    // Create the autocomplete object, restricting the search to geographical
    // location types.
    dautocomplete = new google.maps.places.Autocomplete(
        /** @type {!HTMLInputElement} */(document.getElementById('destautocomplete')),
        {types: ['geocode']});

    // When the user selects an address from the dropdown, populate the address
    // fields in the form.
    dautocomplete.addListener('place_changed', dfillInAddress);
  }

  function dfillInAddress() {
    // Get the place details from the autocomplete object.
    var place = dautocomplete.getPlace();

    txt_dest_lat = place.geometry.location.lat();
    txt_dest_lng = place.geometry.location.lng();
  }

  // Bias the autocomplete object to the user's geographical location,
  // as supplied by the browser's 'navigator.geolocation' object.
  function dgeolocate() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var geolocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        var circle = new google.maps.Circle({
          center: geolocation,
          radius: position.coords.accuracy
        });
        dautocomplete.setBounds(circle.getBounds());
      });
    }
  }
// -- AUTO COMPLETE END --

//Fonction qui affiche le trajet
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
  initAutocomplete();
  dinitAutocomplete();
  var mapOptions = {
    zoom: 12,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  map = new google.maps.Map(document.getElementById("map-canvas"),
    mapOptions);
  map.data.addGeoJson(test);
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

Template.menu.events({
  'focus #autocomplete'(event, instance) {
    // increment the counter when button is clicked
    geolocate();
  },
});

Template.menu.events({
  'focus #destautocomplete'(event, instance) {
    // increment the counter when button is clicked
    dgeolocate();
  },
});
