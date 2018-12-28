"use strict";
require('./donation.css');

module.exports = function(app) {
    app.controller('donationCtrl', function($scope) {
        $scope.destinations = ["Community Outreach", "Hartford Food Bank", "Greater Boston Food Bank"];
        $scope.objects = [
            {
                item: "Chicken Marsala",
                timeStamp: "2017-06-01",
                quantity: 12,
                unit: "Pounds",
                location: "Hartford"
            },
            {
                item: "White Rice",
                timeStamp: "2017-06-02",
                quantity: 45,
                unit: "Pounds",
                location: "Manchester"
            },
            {
                item: "General Tso's Chicken",
                timeStamp: "2017-06-02",
                quantity: 23,
                unit: "Pounds",
                location: "Wesleyan"
            },
            {
                item: "Broccoli",
                timeStamp: "2017-06-02",
                quantity: 18,
                unit: "Pounds",
                location: "Hartford"
            },
            {
                item: "Pasta Fagioli",
                timeStamp: "2017-06-02",
                quantity: 11,
                unit: "Pounds",
                location: "Hartford"
            },
            {
                item: "Chicken Tenders",
                timeStamp: "2017-06-03",
                quantity: 15,
                unit: "Pounds",
                location: "Wesleyan"
            }
        ];
        const mapOptions = {
            zoom: 10,
            center: new google.maps.LatLng(41.766045, -72.683339),
            mapTypeId: google.maps.MapTypeId.TERRAIN
        };
        $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);
        $scope.markers = [];
        const infoWindow = new google.maps.InfoWindow();
        const createMarker = function(info) {
            const marker = new google.maps.Marker({
                map: $scope.map,
                position: new google.maps.LatLng(info.lat, info.long),
                title: info.city
            });
            marker.content = '<div class="infoWindowContent">' + info.desc + '</div>';

            google.maps.event.addListener(marker, 'click', function() {
                infoWindow.setContent('<h2>' + marker.title + '</h2>' + marker.content);
                infoWindow.open($scope.map, marker);
            });

            $scope.markers.push(marker);
        };
        const cities = [
            {
                city: 'Hartford',
                lat: 41.766045,
                long: -72.683339
            },
            {
                city: 'Manchester',
                lat: 41.781503,
                long: -72.518324
            },
            {
                city: 'Middletown',
                lat: 41.5566,
                long: -72.6569
            }
        ];

        for (let i = 0; i < cities.length; i++) {
            createMarker(cities[i]);
        }

        $scope.openInfoWindow = function(e, selectedMarker) {
            e.preventDefault();
            google.maps.event.trigger(selectedMarker, 'click');
        }
    });
};