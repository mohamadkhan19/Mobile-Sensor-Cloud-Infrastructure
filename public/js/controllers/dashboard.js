App.controller('dashboardController', ['$scope', '$http', function ($scope, $http) {

  $scope.sensor_type = {};
  $scope.buses_status = {};
  $scope.markers = [];
  $scope.directionsService = null;

  $scope.init = function() {
    //Draw sensor type
    // console.log('init dashboard');
    //Draw your pie chart
    $http({
      method: 'GET',
      headers: APP_CLOUD.getHeaders(true),
      url: '/api/sensors'
    }).then(function(resp) {
      $scope.sensor_type = resp.data.metadata;
      Morris.Donut({
        element: 'morris-donut-chart1',
        data: [{
            label: "Temperature Sensor",
            value: $scope.sensor_type.temperature
        }, {
            label: "Location Sensor",
            value: $scope.sensor_type.location
        }, {
            label: "Speed Sensor",
            value: $scope.sensor_type.speed
        },{
            label: "Clipper Sensor",
            value: $scope.sensor_type.clipper
        }],
        resize: true
      });
    });
    //Draw your host
    $http({
      method: 'GET',
      headers: APP_CLOUD.getHeaders(true),
      url: '/api/hosts/status'
    }).then(function(resp) {
      // console.log(resp.data);
      $scope.buses_status = resp.data;
      Morris.Donut({
         element: 'morris-donut-chart',
         data: [{
             label: "ON ",
             value: $scope.buses_status.active
         }, {
             label: "OFF",
             value: $scope.buses_status.inactive
         }],
         resize: true
      });
    });
    //Draw billings
    //draw map
    $scope.drawMap();
  }

  $scope.drawMap = function() {
    $scope.directionsService = new google.maps.DirectionsService;
    var mapOptions = {
        zoom: 8,
        center: new google.maps.LatLng(37.353694,-121.952618)
        //mapTypeId: google.maps.MapTypeId.TERRAIN
    };
    $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);
    var infoWindow = new google.maps.InfoWindow();
  //    var status = "http://localhost:8083/cloudproject/dashboard/map?user="+user+"&role="+role;
  // $.getJSON( status, {
  // })
  //  .done(function( cities ) {

  //    for (i = 0; i < cities.length; i++){
  //        createMarker(cities[i]);
  //    }
  //    //Angular App Module and Controller

  // });

    //Create routes
    $http({
      method: 'GET',
      headers: APP_CLOUD.getHeaders(true),
      url: '/api/routes'
    }).then(function(resp) {
      var routes = resp.data;
      for (i = 0; i < routes.length; i++){
        $scope.createRoute(routes[i]);
      }
    });
  };

  $scope.createMarker = function (info) {
    var marker = new google.maps.Marker({
        map: $scope.map,
        position: new google.maps.LatLng(info.latitude, info.longitude),
        title: info.description,
        icon: iconBase
    });
    marker.content = '<div class="infoWindowContent">' + info.description + '</div>';

    google.maps.event.addListener(marker, 'click', function(){
        infoWindow.setContent('<h2>' + marker.title + '</h2>' + marker.content);
        infoWindow.open($scope.map, marker);
    });
    $scope.markers.push(marker);
  };

  $scope.createRoute = function(info) {
    var directionsDisplay = new google.maps.DirectionsRenderer;
    directionsDisplay.setMap($scope.map);
    $scope.directionsService.route({
      origin: new google.maps.LatLng(info.src_latitude, info.src_longitude),
      destination: new google.maps.LatLng(info.dest_latitude, info.dest_longitude),
      travelMode: 'DRIVING'
    }, function(response, status) {
      if (status === 'OK') {
        directionsDisplay.setDirections(response);
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
  };

  $scope.openInfoWindow = function(e, selectedMarker) {
    e.preventDefault();
    google.maps.event.trigger(selectedMarker, 'click');
  };
}]);