import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Rues } from '../imports/api/data.js'

import './main.html';

var directionsService = new google.maps.DirectionsService;
var directionsDisplay = new google.maps.DirectionsRenderer;
var mtlcenter = new google.maps.LatLng(45.514609, -73.636982);
var dest =  new google.maps.LatLng(45.496270, -73.568704);
var txt_origin_pos;
var txt_dest_pos;


var feats = [];
var test = {"type": "FeatureCollection",
"features":feats};

// Meteor.call('getRues',{}, (err, res) => {
//   if (err) {
//     console.log("error");
//     alert(err);
//   } else {
//     console.log("success");
//
//     // success!
//     test = {"type": "FeatureCollection",
//     "features":res};
//     map.data.addGeoJson(test);
//     console.log("supposed to be done");
//   }
// });

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

    txt_origin_pos = place.geometry.location;
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

    txt_dest_pos = place.geometry.location;
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
    provideRouteAlternatives: true,
    travelMode: google.maps.TravelMode.DRIVING,
  }, function(response, status) {
    var  coordonness = [];
    for(i=0;i<response.routes[1].overview_path.length;i++)
     coordonness[i] = {lat:response.routes[1].overview_path[i].lat(),lng:response.routes[1].overview_path[i].lng()};
    Meteor.call('getColor', coordonness, (err, res) => {
      if (err) {
        alert(err);
      } else {
        // success!

        var features = [];
        var tempCouleur = "";

        var compteurFeature = 0;
        var compteurCoordinates = 0;

        if(res.length > 0)
        {
          features[compteurFeature] = {};
          features[compteurFeature].properties = {};
          features[compteurFeature].geometry = {};
          features[compteurFeature].type ="Feature";
          features[compteurFeature].geometry.type = "MultiLineString";
          features[compteurFeature].geometry.coordinates=[];
          features[compteurFeature].geometry.coordinates[compteurCoordinates]=[];
        for(i = 0;i<res.length;i++)
        {
          if(res[i] != null && res[i].coor != null && res[i].code != null)
          {
            if(res[i].code == tempCouleur)
            {

              features[compteurFeature].geometry.coordinates[compteurCoordinates] = []
              features[compteurFeature].geometry.coordinates[compteurCoordinates][0] =  res[i].coor.lng;
              features[compteurFeature].geometry.coordinates[compteurCoordinates++][1] =  res[i].coor.lat;

            }else {
                  tempCouleur = res[i].code;
              if(features[compteurFeature].geometry.coordinates.length == 1)
              {
                  features[compteurFeature].properties.code = res[i].code;

                  features[compteurFeature].geometry.coordinates[compteurCoordinates] = []
                  features[compteurFeature].geometry.coordinates[compteurCoordinates][0] =  res[i].coor.lng;
                 features[compteurFeature].geometry.coordinates[compteurCoordinates++][1] =  res[i].coor.lat;
            }else{
              if(features[compteurFeature].geometry.coordinates.length == 1)
                console.log("length == 1 !?!?");
              features[++compteurFeature] = {};
              features[compteurFeature].properties = {};
              features[compteurFeature].geometry = {};
              features[compteurFeature].properties.code = res[i].code;
              features[compteurFeature].type ="Feature";
              features[compteurFeature].geometry.type = "MultiLineString";
              compteurCoordinates = 0;
              features[compteurFeature].geometry.coordinates=[];
              // features[compteurFeature].geometry.coordinates[0]=[];
              features[compteurFeature].geometry.coordinates[compteurCoordinates]=[];

              features[compteurFeature].geometry.coordinates[compteurCoordinates][0] = res[i].coor.lng;
              features[compteurFeature].geometry.coordinates[compteurCoordinates++][1] = res[i].coor.lat;
            }
            }
          }
        }
      }

      for(i=0;i<compteurFeature + 1;i++){
        var test = [];
        test[0] = features[i].geometry.coordinates;
        features[i].geometry.coordinates = test;
      }
        test = {"type": "FeatureCollection",
        "features":features};

        console.log(JSON.stringify(test));
        map.data.addGeoJson(test);
        console.log("supposed to be done");

        //var bikeLayer = new google.maps.BicyclingLayer();
        //bikeLayer.setMap(map);
      }
    });
    if (status === google.maps.DirectionsStatus.OK) {
      var color;
      for (var i = 0, len = response.routes.length; i < len; i++) {

        switch(i){
          case 1:
            color = "#ff3300";
            break;
          case 2:
            color = "#0000ff";
            break;
          case 2:
            color = "#00cc66";
            break;
          default:
            color = "#9900ff";
            break;
        }

      new google.maps.DirectionsRenderer({
          map: map,
          directions: response,
          routeIndex: i,
          polylineOptions: { strokeColor: color }
      });
    }
      // display.setDirections(response);
      // console.log(response);
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
      var color = 'black';
      if(code == "2. Jaune")
        color = "green";
      if(code == "1. Vert")
        color = "yellow";
      if(code == "3. Rouge")
        color = "red";
      return {
        strokeColor: color,
        strokeWeight: 3,
        strokeOpacity:0.5
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
    if (txt_dest_pos != "" && txt_origin_pos != "")
    {
      displayRoute(directionsService, directionsDisplay, txt_origin_pos, txt_dest_pos);
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
