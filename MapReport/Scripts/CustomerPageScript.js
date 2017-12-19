$(document).ready(function () {
    $('#btnGetData').on('click', reloadMapWithData);

    $("#selKiosks option").attr("selected", "selected");

    $('#selKiosks, #selShowTop').multiselect({
        includeSelectAllOption: true,
    });

    var periodStart = moment().startOf('month');
    var periodEnd = moment();

    var contentSelector = '#datePeriod span';

    $('#datePeriod').daterangepicker({
        showDropdowns: true,
        showWeekNumbers: true,
        autoApply: true,
        alwaysShowCalendars: true,
        opens: "right",
        startDate: periodStart,
        endDate: periodEnd,
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
        setDate(start, end, contentSelector);
    });

    setDate(periodStart, periodEnd, contentSelector);

    function setDate(start, end, selector) {
        $(selector).html(start.format('MMM D, YYYY') + ' - ' + end.format('MMM D, YYYY'));
    }

    function getSelectedWithComma(elementId) {
        var selectedIds = '';

        $('#' + elementId + ' :selected').each(function (i, selected) {
            selectedIds += $(selected).val() + ',';
        });

        return selectedIds.slice(0, -1);
    }

    // Show button click handler
    function reloadMapWithData() {
			var startDate_period = formatDate($('#datePeriod').data('daterangepicker').startDate);
			var endDate_period = formatDate($('#datePeriod').data('daterangepicker').endDate);

			var kioskIds = getSelectedWithComma('selKiosks');
			var showTop = $('#selShowTop').val();

			// This is an example url
			//"Data/CustomerData.php?startP=1-02-2017&endP=28-02-2017&showTop=10&kiosks=98,99,100,101,012,103,104,105,112,113"

			var url = "Data/CustomerData.php?startP=" + startDate_period +
								"&endP=" + endDate_period +
								"&showTop=" + showTop +
								"&kiosks=" + kioskIds;

			// TODO: Show loading screen here
			console.log(`URL: ${url}`);
			getData(url);
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
});
