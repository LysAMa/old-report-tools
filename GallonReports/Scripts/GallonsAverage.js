	 $(function () {			
		var averageVarChart = Highcharts.chart('GallonsAveragecontainer', {
		chart: {zoomType: 'xy'},
		title: {},
		subtitle: {},
		xAxis: [{categories:[], crosshair: true}],
		yAxis: [{ // Primary yAxis
			labels: {
				format: '{value} Gallons',
				style: {
					color: Highcharts.getOptions().colors[1]
				}
			},
			title: {
				text: 'Daily Average Of Gallons',
				style: {
					color: Highcharts.getOptions().colors[1]
				}
			}
		}, { // Secondary yAxis
			title: {
				text: 'Monthly Expected Gallons',
				style: {
					color: Highcharts.getOptions().colors[0]
				}
			},
			labels: {
				format: '{value} Gallons',
				style: {
					color: Highcharts.getOptions().colors[0]
				}
			},
			opposite: true
		}],
		tooltip: {
			shared: true
		},
		legend: {
			layout: 'vertical',
			align: 'left',
			x: 120,
			verticalAlign: 'top',
			y: 100,
			floating: true,
			backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
		},
		series: [{
			name: 'Expected',
			type: 'column',
			yAxis: 1,
			data: [],
			tooltip: {
				valueSuffix: '    Gallons'
			}

		}, {
			name: 'Average',
			type: 'spline',
			data: [],
			tooltip: {
				valueSuffix: ' Gallons'
			} 
		}]
		
	});
	
	Highcharts.setOptions({
		lang: {
			thousandsSep: ','
		}
	});
				
	getAvgGallonsData();

	function getAvgGallonsData(){
		var urlString = 'Data/GallonsAvgDataJson.php';
		
		$.get(urlString, function(jsonData, status){
			if(jsonData != null){
				GallonAvgData = JSON.parse(jsonData);
				
				bindChart(GallonAvgData);
			}
		}).fail(function() {
			alert( "Error occured Data Connection Please try again!!!" );
		});
		
	}
	
	function bindChart(GallonAvgData){
		if(GallonAvgData != null){					
			var categoriesData = [];
			var series1Data = [];
			var series2Data = [];
			var monthName = GallonAvgData.length > 0 ? getMonthShortName(GallonAvgData[0].Month) : "" ;
			var noOfWorkingDays = GallonAvgData.length > 0 ? GallonAvgData[0].NoOfWorkingDaysToDate : 0 ;
			$.each(GallonAvgData, function(idx, obj) {
				if($.inArray(obj.Kiosk, categoriesData) == -1){
					categoriesData.push(obj.Kiosk);
				}
				if($.inArray(obj.ExpectedAtMonthEnd, series1Data) == -1){
					series1Data.push(parseInt(obj.ExpectedAtMonthEnd));
				}
				if($.inArray(obj.DailyAvgOfgallons, series2Data) == -1){
					series2Data.push(parseFloat(obj.DailyAvgOfgallons));
				}
				
				
			});	
			averageVarChart.xAxis[0].setCategories(categoriesData);
			averageVarChart.series[0].setData(series1Data, false );
			averageVarChart.series[1].setData(series2Data, true);
			averageVarChart.setTitle({ text: 'Daily Average and Expected Monthly Gallons of ' + monthName  });
			averageVarChart.setTitle(null, { text: 'No of Working Days :' + noOfWorkingDays });
		}
		
	}
	function getMonthShortName(mo){
		var Months = ['January','February','March','April','May','June','July',
			'August','September','October','November','December' ];
		return Months[mo - 1];
	}
	
 });
