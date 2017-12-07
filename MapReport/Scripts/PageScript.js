$(document).ready(function () {
    // Show button clict event
    $('#btnShow').on('click', reloadMapWithData);
    //$('#btnTest').on('click', convertGpsTow3w);

    $("#selKiosks option").attr("selected", "selected");
    $("#selChennel option").attr("selected", "selected");

    $('#selKiosks,#selChennel').multiselect({
        includeSelectAllOption: true,
    });
    $('#selShowTop').multiselect({
        includeSelectAllOption: true,
    });

    $('#selRadius').on('change', function () {
        updateCircleRadius(this.value);
    })

    var period1Start = moment().startOf('month');
    var period1End = moment();
    var period2Start = moment().subtract(1, 'month').startOf('month');
    var period2End = moment().subtract(1, 'month').endOf('month');

    var selector1 = '#datePeriod1 span';
    var selector2 = '#datePeriod2 span';


    $('#datePeriod1').daterangepicker({
        showDropdowns: true,
        showWeekNumbers: true,
        autoApply: true,
        alwaysShowCalendars: true,
        opens: "right",
        startDate: period1Start,
        endDate: period1End,
        ranges: {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
            'This Month till Date': [moment().startOf('month'), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        }
    }, function (start, end, label) {
        setDate(start, end, selector1);
    });
    setDate(period1Start, period1End, selector1);


    $('#datePeriod2').daterangepicker({
        showDropdowns: true,
        showWeekNumbers: true,
        autoApply: true,
        alwaysShowCalendars: true,
        opens: "right",
        startDate: period2Start,
        endDate: period2End,
        ranges: {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
            'This Month till Date': [moment().startOf('month'), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        }
    }, function (start, end, label) {
        setDate(start, end, selector2);
    });
    setDate(period2Start, period2End, selector2);


    function setDate(start, end, selector) {
        $(selector).html(start.format('MMM D, YYYY') + ' - ' + end.format('MMM D, YYYY'));
    }


    function getSelectedWithComma(elementId) {
        var selectedIds = '';
        $('#' + elementId + ' :selected').each(function (i, selected) {
            selectedIds += $(selected).val() + ',';
        });
        return selectedIds;
    }




    // Show button click handler
    function reloadMapWithData() {
        var startDate_period1 = formatDate($('#datePeriod1').data('daterangepicker').startDate);
        var endDate_period1 = formatDate($('#datePeriod1').data('daterangepicker').endDate);
        var startDate_period2 = formatDate($('#datePeriod2').data('daterangepicker').startDate);
        var endDate_period2 = formatDate($('#datePeriod2').data('daterangepicker').endDate);

        var kioskIds = getSelectedWithComma('selKiosks');
        var channelIds = getSelectedWithComma('selChennel');
        var showTop = getSelectedWithComma('selShowTop');

        clearMap();
        //$("#slider").slider("option", "value", 2);
        //handle.text(2);

        //$.getJSON("Data/SampleData.json", loadSampleData);
        //"Data/MapDataInJson.php?startP1=1-02-2017&endP1=28-02-2017&startP2=1-03-2017&endP2=31-03-2017&showTop=10&kiosks=98,99,100,101,012,103,104,105,112,113&channels=115,116,117,118,119,120,121"

        var root = $('#myRoot').val();
        var url = root + "Data/MapDataInJson.php?startP1=" + startDate_period1 + "&endP1=" + endDate_period1 +
            "&startP2=" + startDate_period2 + "&endP2=" + endDate_period2 + "&showTop=" + showTop +
            "&kiosks=" + kioskIds + "&channels=" + channelIds;


        $.getJSON(url, loadMapData);

    }

    function formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [day, month, year].join('-');
    }



    function convertGpsTow3w() {
        var apiKey = "DW0C89ZJ";
        var lat = "19.042832";
        var lng = "-72.8436973";
        var url = "https://api.what3words.com/v2/reverse?callback=?&coords=" + lat + "," + lng + "&display=full&format=json&key=" + apiKey;
        $.getJSON(url, processConvertedGpsTow3w);
    }
    function processConvertedGpsTow3w(response) {
        var a = response.words;
    }

    var handle = $("#sliderValue");
    $("#slider").slider({
        min: 1,
        max: 100,
        step: 1,
        value: radiusMultiplier,
        create: function () {
            handle.text($(this).slider("value"));
            sliderUpdated($(this).slider("value"));
        },
        slide: function (event, ui) {
            handle.text(ui.value);
            sliderUpdated(ui.value);
        }
    });

    function sliderUpdated(value) {
        updateCircleRadius(value);
    }


});