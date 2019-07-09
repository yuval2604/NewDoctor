function make_markers(lat, lng) {
    console.log("make marker")
    var Doc_loc = new google.maps.LatLng(lat, lng);
    var marker = new google.maps.Marker({
        position: Doc_loc,
        map: map,
        title: 'Doctor location'
    });
    console.log("render a new marker lat "+ lat +" lng" +lng)
}

$(document).ready(function(){
    $('.modal').modal();

});


function get_Distance(lat, lng){
    navigator.geolocation.getCurrentPosition(function (position) {
        console.log(position);
        var lat_loc= position.coords.latitude;
        var lng_loc= position.coords.longitude;

        //my location
        var user_location = {lat: lat_loc, lng: lng_loc};
        //doctor location
        //taken from the user variables input
        var  doctor_location = new google.maps.LatLng(lat, lng);
        var service = new google.maps.DistanceMatrixService();
        service.getDistanceMatrix(
            {
                origins: [user_location],
                destinations: [doctor_location],
                travelMode: 'DRIVING',
            }, callback);

        function callback(response, status) {
            if (status == 'OK') {
                console.log("in the callback")
                var origins = response.originAddresses;
                var destinations = response.destinationAddresses;

                for (var i = 0; i < origins.length; i++) {
                    var results = response.rows[i].elements;
                    for (var j = 0; j < results.length; j++) {
                        var element = results[j];
                        var distance = element.distance.text;
                        var duration = element.duration.text;
                        var from = origins[i];
                        var to = destinations[j];
                        return distance;
                    }
                }
            }
        }

    });
}

