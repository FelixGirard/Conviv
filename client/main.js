import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Rues } from '../imports/api/data.js'

import './main.html';

var directionsService = new google.maps.DirectionsService;
var polylineOptionsActual;
var directionsDisplay = new google.maps.DirectionsRenderer({polylineOptions: polylineOptionsActual});
var mtlcenter = new google.maps.LatLng(45.514609, -73.636982);
var dest =  new google.maps.LatLng(45.496270, -73.568704);
var txt_origin_pos;
var txt_dest_pos;
var itduration;
var itdistance;
var temp;
var selectedmode = 0;

var autoorigin = false;
var autodest = false;

var mypos;

var calories;
var emprunt_carbon;

function Calories_Spend(itdistance){
    calories = itdistance * 0.02366;
    calories = Math.round(calories);
    document.getElementById("fixed").innerHTML = calories

}

function EmpruntEco(itdistance, itduration){
    emprunt_carbon = itdistance * 125;
    emprunt_carbon /= 1000;
    emprunt_carbon = Math.round(emprunt_carbon);
    document.getElementById("fixed2").innerHTML = emprunt_carbon
}

// var feats = [];
// var test = {"type": "FeatureCollection",
// "features":feats}
//     Meteor.call('getRues', {
//     }, (err, res) => {
//       if (err) {
//         alert(err);
//       } else {
//         // success!
//         test = {"type": "FeatureCollection",
//         "features":res};
//         //map.data.addGeoJson(test);
//         //var bikeLayer = new google.maps.BicyclingLayer();
//         //bikeLayer.setMap(map);
//       }
//     });

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
    autoorigin = true;
  }

  function fillInAddress() {
    // Get the place details from the autocomplete object.
    var place = autocomplete.getPlace();

    txt_origin_pos = place.geometry.location;
    if (autodest && autoorigin)
    {
      displayRoute(directionsService, directionsDisplay, txt_origin_pos, txt_dest_pos);
    }
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
        mypos = geolocation
        var circle = new google.maps.Circle({
          center: geolocation,
          radius: position.coords.accuracy
        });
        autocomplete.setBounds(circle.getBounds());
      });
    }
    var marker = new google.maps.Marker({
      position: mypos,
      title:'My Position',
      icon:'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
    });
    marker.setMap(map);
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
    autodest = true;
  }

  function dfillInAddress() {
    // Get the place details from the autocomplete object.
    var place = dautocomplete.getPlace();

    txt_dest_pos = place.geometry.location;
    if (autodest && autoorigin)
    {
      displayRoute(directionsService, directionsDisplay, txt_origin_pos, txt_dest_pos);
    }
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
    var marker = new google.maps.Marker({
      position: mypos,
      title:'My Position',
      icon:'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
    });
    marker.setMap(map);
  }
// -- AUTO COMPLETE END --

//Fonction qui affiche le trajet
function displayRoute(service, display, origine, destination) {
  console.log("xdé");
  //display.setDirections({routes: []});
  if (origine != null && destination != null) {
    if(selectedmode === 0){
      service.route({
        origin: origine,
        destination: destination,
        //waypoints: [{location: 'Montreal, QBC'}, {location: 'Montreal, QBC'}],
        provideRouteAlternatives: true,
        travelMode: google.maps.TravelMode.BICYCLING,
      },
      function(response, status) {
        console.log("xdé");
        if (status === google.maps.DirectionsStatus.OK) {
          var color;
          display.setMap(map);
          display.setDirections(response);

          for (var i = 0, len = response.routes.length; i < len; i++) {
            itdistance = response.routes[i].legs[0].distance.value;
            itduration = response.routes[i].legs[0].duration.value;
            Calories_Spend(itdistance);
            console.log(calories);
            EmpruntEco(itdistance);
            console.log(emprunt_carbon);

            console.log("okéééé");
            var maRoute = response.routes[0].legs[0];
            for (var j = 0, len = maRoute.steps.length; j < len; j++) {
               console.log(maRoute.steps[i].instructions+' -> '+maRoute.steps[i].distance.value);
              console.log("ok");
            }
          }
            // polylineOptionsActual = {
            //  strokeColor: color, strokeWeight: 6
            // };
          // window.temp = new google.maps.DirectionsRenderer({
          //     map: map,
          //     directions: response,
          //     routeIndex: i,
          //     polylineOptions: { strokeColor: color, strokeWeight: 6 }
          // });
        // }
          // display.setDirections(response);
          // console.log(response);
        } else {
          //alert('Could not display directions due to: ' + status);
        }
      });
    }else{
  service.route({
    origin: origine,
    destination: destination,
    //waypoints: [{location: 'Montreal, QBC'}, {location: 'Montreal, QBC'}],
    provideRouteAlternatives: true,
    travelMode: google.maps.TravelMode.WALKING,
  },
  function(response, status) {
    console.log("xdé");
    if (status === google.maps.DirectionsStatus.OK) {
      var color;
      display.setMap(map);
      display.setDirections(response);

      for (var i = 0, len = response.routes.length; i < len; i++) {
        itdistance = response.routes[i].legs[0].distance.value;
        itduration = response.routes[i].legs[0].duration.value;
        Calories_Spend(itdistance);
        console.log(calories);
        EmpruntEco(itdistance);
        console.log(emprunt_carbon);
      }
        // polylineOptionsActual = {
        //  strokeColor: color, strokeWeight: 6
        // };
      // window.temp = new google.maps.DirectionsRenderer({
      //     map: map,
      //     directions: response,
      //     routeIndex: i,
      //     polylineOptions: { strokeColor: color, strokeWeight: 6 }
      // });
    // }
      // display.setDirections(response);
      // console.log(response);
    } else {
      //alert('Could not display directions due to: ' + status);
    }
  });
}
}else{
  //PAS DE BOX SAD
}
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
        // strokeColor: color,
        // strokeWeight: 3,
        // strokeOpacity: 0.5
      };
    });
  var bikeLayer = new google.maps.BicyclingLayer();
  bikeLayer.setMap(map);

  directionsDisplay.setMap(map);

  //Session.set('map', true);
};

Template.menu.events({
  'click button'(event, instance) {
    if (txt_dest_pos != "" && txt_origin_pos != "")
    {
      displayRoute(directionsService, directionsDisplay, txt_origin_pos, txt_dest_pos);
    }else{
    }
  },
});

Template.menu.events({
  'focus #autocomplete'(event, instance) {
    geolocate();
  },
});

Template.menu.events({
  'focus #destautocomplete'(event, instance) {
    dgeolocate();
  },
});

Template.menu.events({
  'click #walk'(event, instance) {
    selectedmode = 1;
    displayRoute(directionsService, directionsDisplay, txt_origin_pos, txt_dest_pos);
    var aClass = "active";
    var bgroup = $("#bike");
    var wgroup = $("#walk");
    $(bgroup).removeClass(aClass);
    $(wgroup).addClass(aClass);
    console.log(selectedmode);
  },
});

Template.menu.events({
  'click #bike'(event, instance) {
    selectedmode = 0;
    displayRoute(directionsService, directionsDisplay, txt_origin_pos, txt_dest_pos);
    var aClass = "active";
    var bgroup = $("#bike");
    var wgroup = $("#walk");
    $(wgroup).removeClass(aClass);
    $(bgroup).addClass(aClass);
    console.log(selectedmode);
  },
});
