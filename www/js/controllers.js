angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, PusherService, $http) {

    var statusCheck;
    $scope.report = function(value) {
        console.log(value);
        statusCheck = value;
        $http({
                method: 'PATCH',
                data: { id: 1, status: value },
                url: 'https://glacial-forest-50256.herokuapp.com/drivers/1/update_status'
            })
            .success(function(data, status, headers, config) {
                console.log(data);
            })
            .error(function(data, status, headers, config) {
                console.log("Error sending status");
            });
    };
    $scope.choice = "Available"


})

.controller('ChatsCtrl', function($scope, Chats) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    $scope.chats = Chats.all();
    $scope.remove = function(chat) {
        Chats.remove(chat);
    };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Math, Server, $http) {
    //$scope.chat = Chats.get($stateParams.chatId);

    var a = 200;
    var b = 100;

    var jsonGet = '//myserver/getURL';
    var jsonPost = '//myserver/postURL';

    //Factory
    Server.get(jsonGet);
    Server.post(jsonPost);

    //Service
    var result = Math.multiply(a, b);
    $scope.result = result;

    //Filter
    $scope.greeting = 'Hello Moto';

    //Filter inside controller
    $scope.numbers = [10, 25, 35, 45, 60, 80, 100];

    $scope.lowerBound = 42;

    // Does the Filters
    $scope.greaterThanNum = function(item) {
        return item > $scope.lowerBound;
    };

    //binding model with view through the controller here - two way binding
    $scope.myModel = '';

    //Server calls using http
    $http({
            method: 'GET',
            url: '//localhost:8100/tab-account.html'
        })
        .success(function(data, status, headers, config) {

        })
        .error(function(data, status, headers, config) {

        });

    //first example of database call from inside the controller
    //Below is the object declaration
    // $scope.user = {};
    // //Below is the database
    // $scope.user.details = {
    //     "username": "A7mad 3oda",
    //     "id": "12323"
    // };  

    //Using JSON file as database - mockLocations.json
    $scope.bookings = {};

    $http({
            method: 'GET',
            url: 'mockLocations.json'
        })
        .success(function(data, status, headers, config) {
            $scope.bookings = data.bookings;

        })
        .error(function(data, status, headers, config) {
            console.log("A7a");
        });

    //Scope functions: using above JSON example
    $scope.deleteBooking = function(bookingID) {
        $scope.bookings.splice(bookingID, 1);
    };

    //Expressions:
    $scope.expression = {};
    $scope.expression.empty = [];
    $scope.expression.full = [{
        "Some": "data"
    }];




})


.controller('AccountCtrl', function($scope, Framework, $ionicModal, $http, PusherService) {


    var jsonObj;

    var source_Lat
    var source_Lng

    var destination_lat
    var destination_lng

    var origsrcMarker;
    var latitude
    var longitude
    var zeby

    var booking_id
    var bookingContent

    $scope.buttonVisible = true;

    PusherService.instantiatePusher(3);
    $scope.asyncNotification = '';
    PusherService.onMessage(function(response) {
        $scope.buttonVisible = false;
        console.log("is pusher working");
        bookingContent = response.message;
        console.log("pusher");
        console.log(response.message);

        jsonObj = JSON.parse(response.message);
        source_Lat = jsonObj.start_lat;
        source_Lng = jsonObj.start_lon;
        destination_lat = jsonObj.destination_lat;
        destination_lng = jsonObj.destination_lon;
        console.log(source_Lat);
        console.log(source_Lng);
        console.log(destination_lat);
        console.log(destination_lng);
        origsrcMarker.setMap(null);
        getBookingCoords(source_Lat, source_Lng, destination_lat, destination_lng);
        setPickUpCoordinates(source_Lat, source_Lng);
        setDestinationCoordinates(destination_lat, destination_lng);

    });


    function getBookingCoords(source_Lat, source_Lng, destination_lat, destination_lng) {
        var slatlng = { lat: source_Lat, lng: source_Lng };
        var dlatlng = { lat: destination_lat, lng: destination_lng };
        var srcMarker = new google.maps.Marker({
            map: $scope.map,
            position: slatlng,
            title: "Pick-up Location",
            draggable: true,
            animation: google.maps.Animation.DROP
        });

        var desMarker = new google.maps.Marker({
            map: $scope.map,
            position: dlatlng,
            title: "Destination Location",
            draggable: true,
            icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
            animation: google.maps.Animation.DROP
        });

    }

    //Decision function...............
    $scope.decision = {};
    var acceptance;
    var rejection;


    $scope.acceptBooking = function() {
        console.log("Inside Accepted");
        jsonObj = JSON.parse(bookingContent);
        console.log(jsonObj.status);
        jsonObj.status = "accepted";
        console.log(jsonObj.status);
        $http({
            method: 'PATCH',
            data: jsonObj,
            url: 'https://glacial-forest-50256.herokuapp.com/bookings/3/booking_decide'
        })
        console.log(jsonObj);
    };

    $scope.rejectBooking = function() {
        console.log("Rejected");
        jsonObj = JSON.parse(bookingContent);
        $http({
            method: 'PATCH',
            data: jsonObj,
            url: 'https://glacial-forest-50256.herokuapp.com/bookings/3/booking_decide'
        })
    };




    var dummylocation = {
        "title": "Stockholm",
        "lat": 59.3,
        "lng": 18.1,
        "description": "Stockholm is the capital and the largest city of Sweden and constitutes the most populated urban area in Scandinavia with a population of 2.1 million in the metropolitan area (2010)"
    }

    function setPickUpCoordinates(lat, lng) {
        source_lat = lat
        source_lng = lng
        console.log("source_lat: " + source_lat);
        console.log("source_lng: " + source_lng);
        setPickUpCoordinatesView(lat, lng)
    }

    function setPickUpCoordinatesView(lat, lng) {
        $scope.source_coordinates = lat + "," + lng
        console.log("$scope.source_coordinates: " + $scope.source_coordinates);
        geocodeLatLng(lat, lng, true)
    }

    function setDestinationCoordinates(lat, lng) {
        destination_lat = lat
        destination_lng = lng
        console.log("destination_lat: " + destination_lat);
        console.log("destination_lng: " + destination_lng);
        setDestinationCoordinatesView(lat, lng)
    }

    function setDestinationCoordinatesView(lat, lng) {
        $scope.destination_coordinates = lat + "," + lng
        console.log("$scope.destination_coordinates: " + $scope.destination_coordinates);
        //$scope.$apply()
        geocodeLatLng(lat, lng, false)
    }

    $scope.getEstimate = function() {

        var service = new google.maps.DistanceMatrixService();
        var origin = { lat: source_lat, lng: source_lng };
        var destination = { lat: destination_lat, lng: destination_lng };

        service.getDistanceMatrix({
            origins: [origin],
            destinations: [destination],
            travelMode: 'DRIVING',
            unitSystem: google.maps.UnitSystem.METRIC,
            avoidHighways: false,
            avoidTolls: false,
        }, callback);

        function callback(response, status) {
            if (status == 'OK') {
                var origins = response.originAddresses;
                var destinations = response.destinationAddresses;

                for (var i = 0; i < origins.length; i++) {
                    var results = response.rows[i].elements;
                    for (var j = 0; j < results.length; j++) {
                        var element = results[j];
                        var distance = element.distance.text;
                        var duration = element.duration.text;
                        console.log(distance);
                        console.log(duration);
                        var from = origins[i];
                        var to = destinations[j];

                        $scope.travel_distance = "Distance: " + distance
                        $scope.travel_time = "Estimated Travel Time: " + duration
                        var distanceValue = distance.split(" ");
                        $scope.travel_fare = "Estimated Fare: " + distanceValue[0] * 2 + " euro"

                        $scope.modal.show()
                        $scope.$apply()

                    }
                }
            }
        }
    };



    function geocodeLatLng(lat, lng, isSource) {
        var geocoder = new google.maps.Geocoder
        var latlng = { lat: lat, lng: lng };
        geocoder.geocode({ 'location': latlng }, function(results, status) {
            if (status === 'OK') {
                if (results[0]) {
                    if (isSource) {
                        $scope.source_coordinates = results[0].formatted_address;
                    } else {
                        $scope.destination_coordinates = results[0].formatted_address;
                    }
                    $scope.$apply()
                } else {
                    window.alert('No results found');
                }
            } else {
                window.alert('Geocoder failed due to: ' + status);
            }
        });
    }



    Framework.navigator().then(function(navigator) {


        navigator.geolocation.getCurrentPosition(function(position) {
            console.log("I am on this inside");
            latitude = position.coords.latitude;
            longitude = position.coords.longitude;
            var mapProp = {
                center: { lat: latitude, lng: longitude },
                zoom: 14,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            $scope.map = new google.maps.Map(document.getElementById('map'), mapProp);

            origsrcMarker = new google.maps.Marker({
                map: $scope.map,
                position: mapProp.center,
                title: "Pick-up Location",
                draggable: true,
                animation: google.maps.Animation.DROP
            });

            // var desMarker = new google.maps.Marker({
            //     map: $scope.map,
            //     position: mapProp.center,
            //     title: "Destination Location",
            //     draggable: true,
            //     icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
            //     animation: google.maps.Animation.DROP
            // });

            setPickUpCoordinates(latitude, longitude);
            setDestinationCoordinates(latitude, longitude);

            google.maps.event.addListener(origsrcMarker, 'dragend', function(event) {
                console.log("lat: " + this.getPosition().lat());
                console.log("lng: " + this.getPosition().lng());
                //   setPickUpCoordinates(this.getPosition().lat(),this.getPosition().lng());
            });

            google.maps.event.addListener(desMarker, 'dragend', function(event) {
                console.log("lat: " + this.getPosition().lat());
                console.log("lng: " + this.getPosition().lng());
                //   setDestinationCoordinates(this.getPosition().lat(),this.getPosition().lng());
            });

            $scope.$apply(function() {
                $scope.latitude = latitude;
            });

        });

    });


    $ionicModal.fromTemplateUrl('my-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
    });

    $scope.openModal = function() {
        $scope.modal.show();
    };
    $scope.closeModal = function() {
        $scope.modal.hide();
    };
    // Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
        $scope.modal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hidden', function() {
        // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function() {
        // Execute action
    });

    //  @scope.submit = function(){
    //    $http.post('http://localhost:3000/bookings')
    //  }





});