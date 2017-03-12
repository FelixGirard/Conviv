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

// var feats = [];
// var test = {"type": "FeatureCollection",
//"features":feats}

//    Meteor.call('getRues', {
//    }, (err, res) => {
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
//       }
//     });

Meteor.call('getAccidents', "BD PFDS", (err, res) => {
      if (err) {
        alert(err);
      } else {
        //console.log(res);
      }
      });

      var getFromBetween = {
          results:[],
          string:"",
          getFromBetween:function (sub1,sub2) {
              if(this.string.indexOf(sub1) < 0 || this.string.indexOf(sub2) < 0) return false;
              var SP = this.string.indexOf(sub1)+sub1.length;
              var string1 = this.string.substr(0,SP);
              var string2 = this.string.substr(SP);
              var TP = string1.length + string2.indexOf(sub2);
              return this.string.substring(SP,TP);
          },
          removeFromBetween:function (sub1,sub2) {
              if(this.string.indexOf(sub1) < 0 || this.string.indexOf(sub2) < 0) return false;
              var removal = sub1+this.getFromBetween(sub1,sub2)+sub2;
              this.string = this.string.replace(removal,"");
          },
          getAllResults:function (sub1,sub2) {
              // first check to see if we do have both substrings
              if(this.string.indexOf(sub1) < 0 || this.string.indexOf(sub2) < 0) return;

              // find one result
              var result = this.getFromBetween(sub1,sub2);
              // push it to the results array
              this.results.push(result);
              // remove the most recently found one from the string
              this.removeFromBetween(sub1,sub2);

              // if there's more substrings
              if(this.string.indexOf(sub1) > -1 && this.string.indexOf(sub2) > -1) {
                  this.getAllResults(sub1,sub2);
              }
              else return;
          },
          get:function (string,sub1,sub2) {
              this.results = [];
              this.string = string;
              this.getAllResults(sub1,sub2);
              return this.results;
          }
      };


    // -- AUTO COMPLETE START --
      var aplaceSearch, aautocomplete;

      function ainitAutocomplete() {
        // Create the autocomplete object, restricting the search to geographical
        // location types.
        aautocomplete = new google.maps.places.Autocomplete(
            /** @type {!HTMLInputElement} */(document.getElementById('aautocomplete')),
            {types: ['address']});

        // When the user selects an address from the dropdown, populate the address
        // fields in the form.
        aautocomplete.addListener('place_changed', afillInAddress);
        autoorigin = true;
      }

      function afillInAddress() {
        // Get the place details from the autocomplete object.
        var place = aautocomplete.getPlace();

        //var bikeLayer = new google.maps.BicyclingLayer();
        if (autodest && autoorigin)
        {
          displayRoute(directionsService, directionsDisplay, txt_origin_pos, txt_dest_pos);
        }
      }
      // Bias the autocomplete object to the user's geographical location,
      // as supplied by the browser's 'navigator.geolocation' object.
      function ageolocate() {
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
            aautocomplete.setBounds(circle.getBounds());
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
    var  coordonness = [];
    for(i=0;i<response.routes[0].overview_path.length;i++)
     coordonness[i] = {lat:response.routes[0].overview_path[i].lat(),lng:response.routes[0].overview_path[i].lng()};
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

        //console.log(JSON.stringify(test));
        map.data.addGeoJson(test);

      }
    });
        if (status === google.maps.DirectionsStatus.OK) {
          var color;
          display.setMap(map);
          display.setDirections(response);

          var pointsArray = [];
          pointsArray = response.routes[0].overview_path;


          for (var i = 0, len = response.routes.length; i < len; i++) {

            var acciarray = [];
            var maRoute = response.routes[0].legs[0];
            for (var j = 0, len = maRoute.steps.length; j < len; j++) {
               console.log(maRoute.steps[j].instructions);
               var str = maRoute.steps[j].instructions;
               var accirues = getFromBetween.get(str,"<b>","</b>");
               if (accirues.length == 2) {
                 accirues.splice(0, 1);
                 acciarray[j] = accirues[0];
                 console.log(accirues);
               }else if (accirues.length == 3) {
                 accirues.splice(2, 1);
                 accirues.splice(0, 1);
                 acciarray[j] = accirues[0];
                 console.log(accirues);
               }
               }
          }
          console.log(acciarray);
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
          display.setDirections(response);
          console.log(response);
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
    if (status === google.maps.DirectionsStatus.OK) {
      var color;
      display.setMap(map);
      display.setDirections(response);

      for (var i = 0, len = response.routes.length; i < len; i++) {
        itdistance = response.routes[i].legs[0].distance.value;
        itduration = response.routes[i].legs[0].duration.value;
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

    var styles = [
  {
    featureType: "all",
    stylers: [
      { saturation: -50 }
    ]
  },{
    featureType: "road.arterial",
    elementType: "geometry",
    stylers: [
      { hue: "#00ffee" },
      { saturation: 50 }
    ]
  },{
    featureType: "poi.business",
    elementType: "labels",
    stylers: [
      { visibility: "off" }
    ]
  }
];

map.setOptions({styles: styles});

  map.setCenter(mtlcenter);

  map.data.addGeoJson(test);

  map.data.setStyle(function(feature) {
      var code = feature.getProperty('code');
      var color = '';
      if(code == "2. Jaune")
        color = "orange";
      if(code == "1. Vert")
        color = "green";
      if(code == "3. Rouge")
        color = "red";
      if(code == "4. Manquant")
          color = "";
      if(code=="5. Interdit aux cyclistes")
          color="black";
      return {
        strokeColor: color,
        strokeWeight: 3,
        strokeOpacity:0.5
      };
    });

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
  },
});
