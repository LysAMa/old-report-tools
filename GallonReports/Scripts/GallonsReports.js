$(function () {
    Highcharts.setOptions({
        lang: {
            thousandsSep: ','
        }
    });
    var currentYear = (new Date).getFullYear();
    $('#Yearlist').val(currentYear).attr("selected", "selected");
    //$("select option[ value =" + currentYear + "]").attr("selected", "selected");
    $("select#kiosklist option").attr("selected", true);
    $("select#Monthlist option").attr("selected", true);
    showFilteredChart();

    var varchart = Highcharts.chart('Gallonscontainer', {

        chart: {
            type: 'column'
        },
        title: {
            text: 'Gallons Reports on Kiosk Data'
        },
        subtitle: {
            text: ' '
        },
        xAxis: {
            categories: [],
            crosshair: true
        },
        lang: {
            thousandsSep: ','
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Number of Gallons'
            }
        },
        tooltip: {
            formatter: function () {
                //alert(this.y);
                var total = 0;
                var s = '<table class="tip"><caption>' + this.x + '</caption>'
                  + '<tbody>'  //'<b>'+ this.x +'</b>';

                for (a = 0; a < this.points.length ; a++) {
                    s += '<tr><td style="color: ' + this.points[a].series.color + '">' + this.points[a].series.name + ': </td>'
                        + '<td style="text-align: right">' + this.points[a].y + '</td></tr>',
                    total += this.points[a].y;
                }

                s += '<tr><th>Total: </th>'
                    + '<td style="text-align:right"><b>' + total + '</b></td></tr>'
                    + '</tbody></table>'

                return s;
            },
            shared: true,
            useHTML: true
        },


        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },

        series: []
    });


    $('#kiosklist,#Yearlist,#Monthlist').multiselect({
        includeSelectAllOption: true
    });

    $('#btnFilter').click(function () {
        showFilteredChart();

    });

    function showFilteredChart() {
        var selectedKiosk = [];
        var selectedYr = [];
        var selectedMo = [];

        $('#kiosklist :selected').each(function (i, selected) {
            //alert($(selected).text());
            selectedKiosk.push($(selected).text());
        });

        $('#Yearlist :selected').each(function (j, selected) {
            selectedYr.push($(selected).text());
        });

        $('#Monthlist :selected').each(function (k, selected) {
            selectedMo.push($(selected).val());
        });

        getDataAndBindChart(selectedKiosk, selectedYr, selectedMo);
    }



    var GallonAllData = null;
    var FilteredData = null;
    var categoriesData = [];
    var seriesNames = [];
    var seriesData = [];

    function NullInitializer() {
        while (varchart.series.length > 0) {
            varchart.series[0].remove(true);
        }
        categoriesData = [];
        seriesNames = [];
        seriesData = [];
        varchart.xAxis[0].setCategories(categoriesData);
    }

    function getDataByKioskName(dataFilter, Kiosk) {
        return dataFilter.filter(
          function (dataFilter) { return dataFilter.Kiosk == Kiosk }
        );
    }

    function getDataByYear(dataFilter, Yr) {
        return dataFilter.filter(
          function (dataFilter) { return dataFilter.Yr == Yr }
        );
    }

    function getDataByMonth(dataFilter, Mo) {
        return dataFilter.filter(
          function (dataFilter) { return dataFilter.Mo == Mo }
        );
    }

    function getGallonData(selectedKiosk, selectedYr, selectedMo) {
        var urlString = 'Data/GallonsDataInJson.php';
        if (GallonAllData == null) {
            $.get(urlString, function (jsonData, status) {
                if (jsonData != null) {
                    GallonAllData = JSON.parse(jsonData);
                    FilteredData = filterGallonData(selectedKiosk, selectedYr, selectedMo);
                    bindChart(FilteredData);
                }
            }).fail(function () {
                alert("Error occured Data Connection Please try again!!!");
            });
        } else {
            FilteredData = filterGallonData(selectedKiosk, selectedYr, selectedMo);
            bindChart(FilteredData);
        }
    }

    function filterGallonData(selectedKiosk, selectedYr, selectedMo) {
        FilteredData = GallonAllData;
        var joined = [];
        //  filters  Data
        if (selectedKiosk != null && selectedKiosk.length > 0) {
            var filteredKiosks = [];
            $.each(selectedKiosk, function (index, value) {
                var filtered = getDataByKioskName(FilteredData, value);
                filteredKiosks.push(filtered);
            });
            $.each(filteredKiosks, function (index, value) {
                $.each(value, function (i, v) {
                    joined.push(v);
                });
            });

            FilteredData = joined;
            joined = [];
        }
        if (selectedMo != null && selectedMo.length > 0) {
            var filtereMonth = [];
            $.each(selectedMo, function (index, value) {
                var filtered = getDataByMonth(FilteredData, value);
                filtereMonth.push(filtered);
            });
            $.each(filtereMonth, function (index, value) {
                $.each(value, function (i, v) {
                    joined.push(v);
                });
            });
            FilteredData = joined;
            //FilteredData.reverse();
            joined = [];
        }

        if (selectedYr != null && selectedYr.length > 0) {
            var filtereYear = [];
            $.each(selectedYr, function (index, value) {
                var filtered = getDataByYear(FilteredData, value);
                filtereYear.push(filtered);
            });
            $.each(filtereYear, function (index, value) {
                $.each(value, function (i, v) {
                    joined.push(v);
                });
            });
            FilteredData = joined;
            //FilteredData.reverse();
            joined = [];
        }
        FilteredData = FilteredData.sort(function (a, b) {
            return (parseInt(a['YrMo']) > parseInt(b['YrMo'])) ? 1 : ((parseInt(a['YrMo']) < parseInt(b['YrMo'])) ? -1 : 0);
        });
        return FilteredData;
    }

    function bindChart(FilteredData) {
        if (FilteredData != null) {
            // Clear Chart data
            NullInitializer();
            $.each(FilteredData, function (idx, obj) {
                var categoryText = getMonthShortName(obj.Mo) + '-' + getYearShortName(obj.Yr);
                if ($.inArray(categoryText, categoriesData) == -1) {
                    categoriesData.push(categoryText);
                }
            });
            varchart.xAxis[0].setCategories(categoriesData);

            $.each(FilteredData, function (idx, obj) {
                if ($.inArray(obj.Kiosk, seriesNames) == -1) {
                    seriesNames.push(obj.Kiosk);
                }
            });


            $.each(seriesNames, function (idxSeries, objSeries) {
                $.each(categoriesData, function (idxCate, objCate) {
                    var sumOfgallons = null;
                    $.each(FilteredData, function (indData, objData) {
                        var categoryText = getMonthShortName(objData.Mo) + '-' + getYearShortName(objData.Yr);
                        if (objData.Kiosk == objSeries && categoryText == objCate) {
                            sumOfgallons = parseInt(objData.SumOfgallons);
                            return false;
                        }
                    });
                    seriesData.push(sumOfgallons);
                });
                varchart.addSeries({ name: objSeries, data: seriesData });
                seriesData = [];
            });
        }

    }

    function getDataAndBindChart(selectedKiosk, selectedYr, selectedMo) {
        getGallonData(selectedKiosk, selectedYr, selectedMo);

    }


    function getMonthShortName(mo) {
        var Months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return Months[mo - 1];
    }

    function getYearShortName(yr) {
        return yr.length >= 4 ? yr.substr(2) : yr;
    }

});