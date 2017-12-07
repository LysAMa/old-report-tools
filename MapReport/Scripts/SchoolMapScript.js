var Objects = [];
var map = null;
var radiusMultiplier = 2;
    var latLng = { lat: 19.042832, lng: -72.8436973 };

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 8,//4,
        scaleControl: true,
        center: latLng,//{ lat: 37.090, lng: -95.712 },
        mapTypeId: 'roadmap'  // roadmap,satellite,hybrid,terrain
    });
    //$.getJSON("Data/SchoolData.json", loadMapData);

    //var infowindow = new google.maps.InfoWindow({
    //    content: 'This is just a info box.'
    //});
    // http://maps.google.com/mapfiles/ms/icons/green.png
    // http://maps.google.com/mapfiles/ms/icons/green-dot.png
    // http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=S|6677ff|ffffff

    //var image = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';
    //var marker = new google.maps.Marker({
    //    position: latLng,
    //    map: map,
    //    title: 'Hello World!'
    //});

    //marker.addListener('click', function () {
    //    infowindow.open(map, marker);
    //});

    getData();
}

function getData() {
    $.ajax({
        type: "GET",
        url: "Data/SchoolData.txt",
        contentType: "application/json; charset=ISO-8859-1", //"application/json; charset=utf-8",
        //characterEncoding: "ISO-8859-1",
        dataType: "text",
        success: function (data) {
            var jsonData = JSON.parse(data);
            jsonData = convertToIntAndGetNotNulls(jsonData);
            loadMapData(jsonData);
        },
        error: function (xhr, textStatus, errorThrown) {
            alert(textStatus + '; ' + xhr.responseText);
        }
    });
}


function loadMapData(schools) {
    $.each(schools, function (idx, school) {
        //addCircleToMap(school);
        //if (idx == 0) {}
            addMarker(school);
        
    });
}



function convertToIntAndGetNotNulls(data) {
    var temp = [];

    $.each(data, function (idx, school) {
        school.NoOfStudents = getRandom();
        school.lat = parseInt(school.lat);
        school.lng = parseInt(school.lng);
        school.SchoolName = school.SchoolName;
        temp.push(school);
    });
    return temp;
}


function getRandom() {
    var num = Math.floor(Math.random() * 900) + 0;// 0 -> 1
    return num;
}

function addCircleToMap(school) {
    var latLng = new google.maps.LatLng(school.Lat, school.Lng);
    var circle = new google.maps.Circle({
        strokeColor: '#666666',
        strokeOpacity: 0.8,
        strokeWeight: 1,
        fillColor: getColor(school),
        fillOpacity: 0.20,
        map: map,
        center: latLng,
        radius: getRadius(school)
    });
    Objects.push(circle);
    addLabels(circle, latLng, school);
}

function getColor(school) {
    if (school.students < 100) {
        return '#00ff00';
    } else if (school.students < 400) {
        return '#0000ff';
    } if (school.students < 800) {
        return '#ff6611';
    }
    else {
        return '#ff0000';
    }
}

function getRadius(school) {
    var radiusMultiplier = 1.7;
    //return school.GPD2 * radiusMultiplier;
    //if (school.Gpd < 10) {
    //    return 4 * radiusMultiplier;
    //} else if (school.Gpd >= 10 && school.Gpd < 20) {
    //    return 6 * radiusMultiplier;
    //} else if (school.Gpd >= 20 && school.Gpd < 40) {
    //    return 8 * radiusMultiplier;
    //}
    //else {
    //    return 10 * radiusMultiplier;
    //}

    if (school.NoOfStudents < 100) {
        return radiusMultiplier * 10;
    } else if (school.NoOfStudents < 400) {
        return radiusMultiplier * 200;
    } if (school.NoOfStudents < 800) {
        return radiusMultiplier * 300;
    }
    else {
        return radiusMultiplier * 400;
    }
}

function addLabels(circle, latLng, school) {
    var marker = new google.maps.Marker({
        position: latLng,
        map: map,
        visible: false
    });
    Objects.push(marker);

    circle.bindTo('center', marker, 'position');

    var infoBoxOptions = {
        content: generateCircleContent(school),
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
function generateCircleContent(school) {
    return '<div class="borderedText">' +
        '<span>' + school.SchoolName + '</span><br/>' +
        '<span>' + school.NoOfStudents + '</span>'
        + '</div>'
}

function addMarker(school) {
    //var image = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';
    //var infowindow = new google.maps.InfoWindow({
    //    content: generateInfoWindowContent(school)
    //});
    //var marker = new google.maps.Marker({
    //    position: school.LatLng,
    //    map: map,
    //    title: school.school,
    //    icon: new google.maps.MarkerImage("http://maps.google.com/mapfiles/ms/icons/yellow-dot.png"),
    //});

    //marker.addListener('click', function () {
    //    infowindow.open(map, marker);
    //});

    //    var image = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';

    var image = 'images/marker.png';

    var infowindow = new google.maps.InfoWindow({
        content: generateInfoWindowContent(school) //'This is just a info box.'
    });


    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(school.Lat, school.Lng),  // latLng,
        map: map,
        title: school.SchoolName,
        icon: image //getMarkerImage(school)
    });

    marker.addListener('click', function () {
        infowindow.open(map, marker);
    });

}
function generateInfoWindowContent(school) {
    return '<div>' +
                '<h2>' + school.SchoolName + '</h2>' +
                'Number of Students: ' + school.NoOfStudents + '<br/>' +
                'Average Daily Gallons Delivered: ' + school.Gallons + '' + 
            '</div>';
}

function getMarkerImage(school) {
    //     // http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=S|6677ff|ffffff
    var baseUrl = 'http://chart.apis.google.com/chart?chst=d_map_pin_letter';

    var foreColor = '000000';
    var backColor = 'FF0000';
    if (school.NoOfStudents < 100) {
        backColor = 'FF164A'; // red
    } else if (school.NoOfStudents < 400) {
        backColor = '01CA43'; // green
    } else if (school.NoOfStudents < 800) {
        backColor = '33B0FF'; // light blue
    }
    else if (school.NoOfStudents >= 800) {
        backColor = 'FFC733'; // yellow
    }

    var letter = school.SchoolName.length > 0 ? school.SchoolName.slice(0, 1).toUpperCase() : '';
    var fullUrl = baseUrl + '&chld=' + letter + '|' + backColor + '|' + foreColor;
    return fullUrl;
}






