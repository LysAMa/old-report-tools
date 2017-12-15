$(function () {
    var GallonData = null;
    var GallonAllData = null;
    var FilteredData = null;
    var categoriesData = [];
    var seriesNames = [];
    var seriesData = [];
    var currentYear = (new Date).getFullYear();
    $('#SKUYearlist').val(currentYear).attr("selected", "selected");
   // $("select option[ value =" + currentYear + "]").attr("selected", "selected");
    $("select#SKUlist option").attr("selected", true);
    $("select#SKUMonthlist option").attr("selected", true);
    Highcharts.setOptions({
        lang: {
            thousandsSep: ','
        }
    });

    var volumechart = Highcharts.chart('VolumeReportcontainer', {

        title: {
            text: 'Monthly Volume per SKU'
        },
        subtitle: {
            text: 'Number of Gallons'
        },
        xAxis: {
            categories: []
        },
        yAxis: {
            title: {
                text: 'Amount'
            }
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle'
        },
        series: []
    });

    $('#SKUlist,#SKUYearlist,#SKUMonthlist').multiselect({
        includeSelectAllOption: true
    });

    showFilteredChart();

    $('#SKUbtnFilter').click(function () {
        showFilteredChart();

    });

    function showFilteredChart() {
        var selectedSku = [];
        var selectedYr = [];
        var selectedMo = [];

        $('#SKUlist :selected').each(function (i, selected) {
            selectedSku.push($(selected).text());
        });

        $('#SKUYearlist :selected').each(function (j, selected) {
            selectedYr.push($(selected).text());
        });

        $('#SKUMonthlist :selected').each(function (k, selected) {
            selectedMo.push($(selected).val());
        });

        getDataAndBindChart(selectedSku, selectedYr, selectedMo);
    }

    function getDataAndBindChart(selectedSku, selectedYr, selectedMo) {
        getGallonData(selectedSku, selectedYr, selectedMo);

    }

    function getGallonData(selectedSku, selectedYr, selectedMo) {
        var urlString = 'Data/VolumeReportJsonData.php';
        if (GallonAllData == null) {
            $.get(urlString, function (jsonData, status) {
                if (jsonData != null) {
                    GallonAllData = JSON.parse(jsonData);
                    FilteredData = filterGallonData(selectedSku, selectedYr, selectedMo);
                    bindChart(FilteredData);
                }
            }).fail(function () {
                alert("Error occured Data Connection Please try again!!!");
            });

        } else {
            FilteredData = filterGallonData(selectedSku, selectedYr, selectedMo);
            bindChart(FilteredData);
        }
    }

    function filterGallonData(selectedSku, selectedYr, selectedMo) {
        FilteredData = GallonAllData;
        var joined = [];
        //  filters  Data
        if (selectedSku != null && selectedSku.length > 0) {
            var filteredSku = [];
            $.each(selectedSku, function (index, value) {
                var filtered = getDataBySku(FilteredData, value);
                filteredSku.push(filtered);
            });
            $.each(filteredSku, function (index, value) {
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

    function getDataBySku(dataFilter, SKU) {
        return dataFilter.filter(
          function (dataFilter) { return dataFilter.SKU == SKU }
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

    function NullInitializer() {
        while (volumechart.series.length > 0) {
            volumechart.series[0].remove(true);
        }
        categoriesData = [];
        seriesNames = [];
        seriesData = [];
        volumechart.xAxis[0].setCategories(categoriesData);
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
            volumechart.xAxis[0].setCategories(categoriesData);

            $.each(FilteredData, function (idx, obj) {
                if ($.inArray(obj.SKU, seriesNames) == -1) {
                    seriesNames.push(obj.SKU);
                }
            });


            $.each(seriesNames, function (idxSeries, objSeries) {
                $.each(categoriesData, function (idxCate, objCate) {
                    var sumOfgallons = null;
                    $.each(FilteredData, function (indData, objData) {
                        var categoryText = getMonthShortName(objData.Mo) + '-' + getYearShortName(objData.Yr);
                        if (objData.SKU == objSeries && categoryText == objCate) {
                            sumOfgallons = parseInt(objData.SumOfGallons);
                            return false;
                        }
                    });
                    seriesData.push(sumOfgallons);
                });
                volumechart.addSeries({ name: objSeries, data: seriesData });
                seriesData = [];
            });
        }

    }


    function getMonthShortName(mo) {
        var Months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return Months[mo - 1];
    }

    function getYearShortName(yr) {
        return yr.length >= 4 ? yr.substr(2) : yr;
    }

});