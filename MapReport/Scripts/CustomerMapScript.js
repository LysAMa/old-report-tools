var Objects = [];
var map = null;
var radiusMultiplier = 2;
var latLng = { lat: 19.042832, lng: -72.8436973 };
var markersArray = [];

String.prototype.capitalize = function(lower) {
	return (lower ? this.toLowerCase() : this).replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
};

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 8,//4,
        scaleControl: true,
        center: latLng,//{ lat: 37.090, lng: -95.712 },
        mapTypeId: 'roadmap'  // roadmap,satellite,hybrid,terrain
    });
}

function getData(url) {
    $.ajax({
        type: "GET",
        url: url,
        contentType: "application/json; charset=ISO-8859-1",
        dataType: "text",
        success: function (data) {
					var jsonData = JSON.parse(data);
					loadMapData(jsonData);
					$('.overlay').fadeOut();
        },
        error: function (xhr, textStatus, errorThrown) {
            console.log(`${errorThrown}`);
        }
    });
}

function loadMapData(customers) {
	customers.forEach(function (customer) {
		addMarker(customer);
	});
}

function addCircleToMap(customer) {
    var latLng = new google.maps.LatLng(customer.Lat, customer.Lng);
    var circle = new google.maps.Circle({
        strokeColor: '#666666',
        strokeOpacity: 0.8,
        strokeWeight: 1,
        fillColor: getColor(customer),
        fillOpacity: 0.20,
        map: map,
        center: latLng,
        radius: getRadius(customer)
    });
    Objects.push(circle);
    addLabels(circle, latLng, customer);
}

function getColor(customer) {
    if (customer.students < 100) {
        return '#00ff00';
    } else if (customer.students < 400) {
        return '#0000ff';
    } if (customer.students < 800) {
        return '#ff6611';
    }
    else {
        return '#ff0000';
    }
}

function getRadius(customer) {
    var radiusMultiplier = 1.7;
    //return customer.GPD2 * radiusMultiplier;
    //if (customer.Gpd < 10) {
    //    return 4 * radiusMultiplier;
    //} else if (customer.Gpd >= 10 && customer.Gpd < 20) {
    //    return 6 * radiusMultiplier;
    //} else if (customer.Gpd >= 20 && customer.Gpd < 40) {
    //    return 8 * radiusMultiplier;
    //}
    //else {
    //    return 10 * radiusMultiplier;
    //}

    if (customer.NoOfStudents < 100) {
        return radiusMultiplier * 10;
    } else if (customer.NoOfStudents < 400) {
        return radiusMultiplier * 200;
    } if (customer.NoOfStudents < 800) {
        return radiusMultiplier * 300;
    }
    else {
        return radiusMultiplier * 400;
    }
}

function addLabels(circle, latLng, customer) {
    var marker = new google.maps.Marker({
        position: latLng,
        map: map,
        visible: false
    });
    Objects.push(marker);

    circle.bindTo('center', marker, 'position');

    var infoBoxOptions = {
        content: generateCircleContent(customer),
        boxStyle: {
            border: "none",
            textAlign: "left",
            fontSize: "12pt",
            //width: "50px"
        },
        disableAutoPan: true,
        pixelOffset: new google.maps.Size(-10, -10),
        position: latLng,
        closeBoxURL: "",
        isHidden: false,
        pane: "floatPane",
        enableEventPropagation: true
    };

    var label = new InfoBox(infoBoxOptions);
    label.open(map);
    Objects.push(label);
}

function generateCircleContent(customer) {
    return '<div class="borderedText">' +
        '<span>' + customer.customerName + '</span><br/>' +
        '<span>' + customer.NoOfStudents + '</span>'
        + '</div>'
}

function addMarker(customer) {
    var image = 'images/marker.png';

    var infowindow = new google.maps.InfoWindow({
			content: generateInfoWindowContent(customer) //'This is just a info box.'
    });

    var marker = new google.maps.Marker({
			position: new google.maps.LatLng(customer.Lat, customer.Lng),  // latLng,
			map: map,
			title: customer.customerName.capitalize(true),
			icon: image //getMarkerImage(customer)
    });

    marker.addListener('click', function () {
			infowindow.open(map, marker);
    });

		markersArray.push(marker);
}

function generateInfoWindowContent(customer) {
    return `<div>
           		<h2>${customer.customerName.capitalize(true)}</h2>
							Average Daily Gallons Delivered in That Period: ${customer.Gallons || 0}<br>
            </div>`;
}

function getMarkerImage(customer) {
    //     // http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=S|6677ff|ffffff
    var baseUrl = 'http://chart.apis.google.com/chart?chst=d_map_pin_letter';

    var foreColor = '000000';
    var backColor = 'FF0000';
    if (customer.NoOfStudents < 100) {
        backColor = 'FF164A'; // red
    } else if (customer.NoOfStudents < 400) {
        backColor = '01CA43'; // green
    } else if (customer.NoOfStudents < 800) {
        backColor = '33B0FF'; // light blue
    }
    else if (customer.NoOfStudents >= 800) {
        backColor = 'FFC733'; // yellow
    }

    var letter = customer.customerName.length > 0 ? customer.customerName.slice(0, 1).toUpperCase() : '';
    var fullUrl = baseUrl + '&chld=' + letter + '|' + backColor + '|' + foreColor;
    return fullUrl;
}

function clearMap() {
	markersArray.forEach(function (marker) {
		marker.setMap(null);
	});

	markersArray.length = 0;
}
