$(function () {
			var currentYear = (new Date).getFullYear();
			//$("select#Yearlist option[value =" + currentYear + "]").attr("selected","selected");
			$("select#Molist option").attr("selected", true);
			$('#Yrlist').val(currentYear).attr("selected", "selected");	
			var GallonData = null;
			var FilteredData = null;
			var categoriesData = [];
			var SumOfWaterProduct = [];
			var SumOfNoneWaterProduct = [];
			
		    Highcharts.setOptions({
				lang: {
					thousandsSep: ','
				}
			});
			var WaterAndNoneWater = Highcharts.chart('WaterAndNonWaterProductcontainer', {
				
				title: {
					text: 'Monthly Revenue of Water and Non-water Products'
				},
				subtitle: {
					text: ''
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
				series: [{
					name: '',
					data: []
				}, {
					name: '',
					data: []
				}]
			});
			$('#Yrlist,#Molist').multiselect({
                includeSelectAllOption: true
            });
			showFilteredChart();
			
			$('#btnFilterWaterAndNonWaterProd').click(function () {
				showFilteredChart();

			});
			
			function getGallonData(selectedYr, selectedMo){
				var urlString = 'Data/WaterAndNonWaterProductJsonData.php';
				if(GallonData == null){
					$.get(urlString, function(jsonData, status){
						if(jsonData != null){
							GallonData = JSON.parse(jsonData);
							FilteredData = filterGallonData(selectedYr,selectedMo);
							bindChart(FilteredData);
						}
					}).fail(function() {
						alert( "Error occured Data Connection Please try again!!!" );
					});
				
				}
				else{
					FilteredData = filterGallonData(selectedYr,selectedMo);
					bindChart(FilteredData);
				}
			}
			function filterGallonData(selectedYr, selectedMo){
				FilteredData = GallonData;
				var joined = [];
				//  filters  Data
				if(selectedMo != null && selectedMo.length > 0 ){
					var filtereMonth = [];
					$.each(selectedMo , function(index, value){
						var filtered = getDataByMonth(FilteredData, value);
						filtereMonth.push(filtered);
					});	
					$.each(filtereMonth, function(index, value){
						$.each(value, function(i, v){
							joined.push(v);
						});	
					});	
					FilteredData = joined;
					//FilteredData.reverse();
					joined = [];
				}	
				
				
				if(selectedYr != null && selectedYr.length > 0 ){
					var filtereYear = [];
					$.each(selectedYr , function(index, value){
						var filtered = getDataByYear(FilteredData, value);
						filtereYear.push(filtered);
					});	
					$.each(filtereYear, function(index, value){
						$.each(value, function(i, v){
							joined.push(v);
						});	
					});	
					FilteredData = joined;
					//FilteredData.reverse();
					joined = [];
				}
				
				
				
				
					
				
				
				FilteredData = FilteredData.sort(function(a, b){
					return ( parseInt(a['YrMo']) > parseInt(b['YrMo'])) ? 1 : (( parseInt(a['YrMo']) < parseInt(b['YrMo'])) ? -1 : 0);
				}); 
				return FilteredData;
			}
			function NullInitializer(){
				
				while(WaterAndNoneWater.series.length > 0){
					WaterAndNoneWater.series[0].remove(true);
				}
				SumOfWaterProduct = [];
				SumOfNoneWaterProduct = [];
				
				categoriesData = [];
				WaterAndNoneWater.xAxis[0].setCategories(categoriesData);
				
			}
			
			function bindChart(FilteredData){
				
				if(FilteredData != null){	
					// Clear Chart data
					NullInitializer();
					$.each(FilteredData, function(idx, obj) {
						var categoryText = getMonthShortName(obj.Mo) + '-' + getYearShortName(obj.Yr);
						if($.inArray(categoryText, categoriesData) == -1){
							categoriesData.push(categoryText);
						}
					});
					WaterAndNoneWater.xAxis[0].setCategories(categoriesData);
					
					$.each(FilteredData, function(indData, objData){
							SumOfWaterProduct.push(parseInt(objData.SumOfWaterProduct));
							SumOfNoneWaterProduct.push(parseInt(objData.SumOfNoneWaterProduct));
						});
					WaterAndNoneWater.addSeries({ name: 'Water Products', data: SumOfWaterProduct});
					WaterAndNoneWater.addSeries({ name: 'Non-Water Products', data: SumOfNoneWaterProduct});
						
				}
				
			}
			
			
			function showFilteredChart(){
				
				var selectedYr = [];
				var selectedMo = [];
				
				$('#Yrlist :selected').each(function(j, selected){ 
					//alert($(selected).text());
					selectedYr.push($(selected).text());
				}); 
						
				$('#Molist :selected').each(function(k, selected){ 
					selectedMo.push($(selected).val());
				}); 
				
			   getDataAndBindChart(selectedYr, selectedMo);
			}
			
			function getDataByYear(dataFilter,Yr){
				return dataFilter.filter(
				  function(dataFilter){return dataFilter.Yr == Yr}
				);
			}
			function getDataByMonth(dataFilter,Mo){
				return dataFilter.filter(
				  function(dataFilter){return dataFilter.Mo == Mo}
				);
			}
			
			function getDataAndBindChart(selectedYr, selectedMo){
				getGallonData(selectedYr, selectedMo);
				
			}
			
			function getMonthShortName(mo){
				var Months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec' ];
				return Months[mo - 1];
			}
			
			function getYearShortName(yr){
				return yr.length >= 4 ? yr.substr(2) : yr;
			}

		});			