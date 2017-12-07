var Objects = [];
var map = null;
var radiusMultiplier = 1;

function initMap() {
    // Create the map.
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 8,//4,
        scaleControl: true,
        center: { lat: 19.042832, lng: -72.8436973 },//{ lat: 37.090, lng: -95.712 },
        mapTypeId: 'roadmap'  // roadmap,satellite,hybrid,terrain
    });
}

    function loadSampleData(data) {
        $.each(data, function (idx, person) {
            addCircleToMap(person);
        });
    }

    function loadMapData(data) {
        var people = convertToIntAndGetNotNulls(data);
        $.each(people, function (idx, person) {
            addCircleToMap(person);
        });
        generateTable(people);

    }

    function convertToIntAndGetNotNulls(data){
        var people = [];
        baseLat = 18.00;
        baseLng = -74.00;

        $.each(data, function (idx, person) {
            var tempPerson = person;
            tempPerson.Lat = person.Lat == null? getRandom(baseLat) : parseInt(person.Lat);
            tempPerson.Lng = person.Lng == null? getRandom(baseLng) : parseInt(person.Lng);
            tempPerson.Total1 = person.Total1 == null? null : parseInt(person.Total1);
            tempPerson.Total2 = person.Total2 == null? null : parseInt(person.Total2);
            tempPerson.GPD1 = person.GPD1 == null? null : parseInt(person.GPD1);
            tempPerson.GPD2 = person.GPD2 == null? null : parseInt(person.GPD2);
            tempPerson.P2PChange = person.P2PChange == null ? null : parseInt(person.P2PChange);
            console.log(tempPerson.Lat, tempPerson.Lng);
            if(tempPerson.Lat != null && tempPerson.Lng != null && 
                tempPerson.GPD1 != null && tempPerson.GPD2 != null && tempPerson.P2PChange != null){
                people.push(tempPerson);
            }
        });
    return people;
    }

    function getRandom(base){
       var num =  Math.floor(Math.random() * 3) + 0;// 0 -> 1
       var deci =  Math.floor(Math.random() * 999) + 0;
        return base + ((deci/1000) + num);
    }

    function addCircleToMap(person) {
        var latLng = new google.maps.LatLng(person.Lat, person.Lng);
        var circle = new google.maps.Circle({
            strokeColor: '#666666',
            strokeOpacity: 0.8,
            strokeWeight: 1,
            fillColor: getColor(person),
            fillOpacity: 0.20,
            map: map,
            center: latLng,
            radius: getRadius(person)
        });
        Objects.push(circle);
        addLabels(circle, latLng, person);
    }

    function getColor(person) {
        if (person.P2PChange > 10) {
            return '#00ff00';
        } else if (person.P2PChange > -10) {
            return '#0000ff';
        } else {
            return '#ff0000';
        }
    }

    function getRadius(person) {
        //var radiusMultiplier = 1.7;
        //return person.GPD2 * radiusMultiplier;
        if (person.Gpd < 40) {
            return 50 * radiusMultiplier;
        } else if (person.Gpd >= 40 && person.Gpd < 100) {
            return 125 * radiusMultiplier;
        } else if (person.Gpd >= 100 && person.Gpd <= 150) {
            return 250 * radiusMultiplier;
        }
        else {
            return 325 * radiusMultiplier;
        }
    }

    function addLabels(circle, latLng, person) {
        var marker = new google.maps.Marker({
            position: latLng,
            map: map,
            visible: false
        });
        Objects.push(marker);

        circle.bindTo('center', marker, 'position');

        var infoBoxOptions = {
            content: generateCircleContent(person),
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
    function generateCircleContent(person) {
        return '<div class="borderedText">' +
            '<span style="color:orange"><b>' + person.Name + '</b></span><br/>' +
            '<span style="color:white"><b>' + person.GPD2 + '</b></span>'
            + '</div>'
    }


function clearMap(){
  for(var i in Objects) {
    Objects[i].setMap(null);
  }
  Objects = [];
}

function updateCircleRadius(multiplier) {
    //alert('Radius: ' + radius);
    for (var i in Objects) {
        if (Objects[i].radius != undefined) {
            //alert('Radius in circle: ' + Objects[i].radius);
            var gpd2 = Objects[i].radius / radiusMultiplier;
            Objects[i].setRadius(gpd2 * multiplier);
        };
    }
    radiusMultiplier = multiplier;
}

function generateTable(people) {
    var table = '<table>'
    table += '<tr>';
    table += '<th>Name</th>';
    table += '<th>Period 1 Total</th>';
    table += '<th>Period 1 GPD</th>';
    table += '<th>Period 2 Total</th>';
    table += '<th>Period 2 GPD</th>';
    table += '<th>Period to period Change</th>';
    table += '</tr>';
    $.each(people, function (idx, person) {
        table += getTableRow(person);
    });
    table += '</table>';
    $('#mapTabularData').html(table);
}

function getTableRow(person) {
    var row = '<tr>';
    row += '<td>' + person.Name + '</td>';
    row += '<td>' + person.Total1 + '</td>';
    row += '<td>' + person.GPD1 + '</td>';
    row += '<td>' + person.Total2 + '</td>';
    row += '<td>' + person.GPD2 + '</td>';
    row += '<td>' + person.P2PChange + '%</td>';
    row += '</tr>';
    return row;
}

