$(document).ready(function () {
    var periodStart = moment().subtract(2, 'month').startOf('month');
    var periodEnd = moment();
    var selectedKiosk;
    var selector1 = '#datePeriod1 span';
    Highcharts.setOptions({
        lang: {
            thousandsSep: ','
        }
    });

    $('#kiosklistProductionCapacity').multiselect({
        includeSelectAllOption: true
    });

    $('#btnFilterProductionCapacity').click(function () {
        reloadedChartWithData();
    });

    $('#datePeriod1').daterangepicker({
        showDropdowns: true,
        showWeekNumbers: true,
        autoApply: true,
        alwaysShowCalendars: true,
        opens: "right",
        startDate: periodStart,
        endDate: periodEnd,
        maxDate: moment(),
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

    setDate(periodStart, periodEnd, selector1);

    function setDate(start, end, selector) {
        $(selector).html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
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

    function reloadedChartWithData() {
        periodStart = formatDate($('#datePeriod1').data('daterangepicker').startDate);
        periodEnd = formatDate($('#datePeriod1').data('daterangepicker').endDate);
        selectedKiosk = $("#kiosklistProductionCapacity option:selected").text();

        var root = $('#myRoot').val();
        var url = root + "Data/ProductionCapacityDataInJson.php?startDate=" + periodStart + "&endDate=" + periodEnd +
                  "&kiosk=" + selectedKiosk;


        $.get(url, function (jsonData, status) {
            if (jsonData != null) {
                jsonToArray(JSON.parse(jsonData));
                BindChart();
            }
        }).fail(function () {
            alert("Error occured Data Connection Please try again!!!");
        });
    }

    reloadedChartWithData();

    var data = []; var  empty = [];
    function jsonToArray(jsonData) {
        data = []; empty = [];
        $.each(jsonData, function (idx, obj) {
            var row = new Array(utcFormateDate(obj.date), parseInt(obj.EstimatedDailyProduction));
            var row2 = new Array(utcFormateDate(obj.date), parseInt(2500));
            data.push(row);
            empty.push(row2);
        });
    }

    function utcFormateDate(date) {
        var d = new Date(date);
        return Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
    }

    function BindChart() {

        Highcharts.chart('ProductionCapacityContainer', {
            chart: {
                zoomType: 'x'
            },
            title: {
                text: 'Production Capacity'
            },
            subtitle: {
                text: document.ontouchstart === undefined ?
                        'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'
            },
            xAxis: {
                type: 'datetime'
            },
            yAxis: {
                title: {
                    text: 'Gallons'
                },
                plotLines: [ {
                    value: 2500,
                    color: 'red',
                    dashStyle: 'shortdash',
                    width: 2,
                    label: {
                        text: 'Target Gallons'
                    }
                }]  
                
            },
            legend: {
                enabled: false
            },
            plotOptions: {
                area: {
                    fillColor: {
                        linearGradient: {
                            x1: 0,
                            y1: 0,
                            x2: 0,
                            y2: 1
                        },
                        stops: [
                            [0, Highcharts.getOptions().colors[0]],
                            [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                        ]
                    },
                    marker: {
                        radius: 2
                    },
                    lineWidth: 1,
                    states: {
                        hover: {
                            lineWidth: 1
                        }
                    },
                    threshold: null
                }
            },

            series: [{
                type: 'area',
                name: 'Production Capacity',
                data: data
            },
            {
                name: 'Target',
                type: 'line',
                width: 0,
                dashStyle: 'shortdash',
                color: 'transparent',
                marker: {
                    enabled: false
                },
                enableMouseTracking: false,
                data: empty
            }
            ]
        });
    }
});