<html>
  <head>
    <meta charset="utf-8"/>
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"/>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <title>DloHaiti: Gallons</title>
    
	<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js"></script>
    <link href="http://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.0.3/css/bootstrap.min.css" rel="stylesheet" type="text/css" />
    <script type="text/javascript" src="http://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.0.3/js/bootstrap.min.js"></script>
    <link href="http://cdn.rawgit.com/davidstutz/bootstrap-multiselect/master/dist/css/bootstrap-multiselect.css" rel="stylesheet" type="text/css" />
    <script src="http://cdn.rawgit.com/davidstutz/bootstrap-multiselect/master/dist/js/bootstrap-multiselect.js"
        type="text/javascript"></script>
	
  </head>
  <body>
    <div class="container" style="margin:5px;">

      <?php

		$username="app";
		$password="password";
		$dbname="dlo";
		$servername="104.131.40.239";


		try
		{
			$conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
			// set the PDO error mode to exception
			
			$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			
			//$stmt = $conn->prepare("SELECT kiosk.name AS Kiosk, Year(created_date) AS Yr, Month(created_date) AS Mo, Sum(receipt_line_item.gallons) AS SumOfgallons FROM (receipt_line_item INNER JOIN receipt ON receipt_line_item.receipt_id = receipt.id) INNER JOIN kiosk ON receipt.kiosk_id = kiosk.id WHERE receipt.created_date >= '11/1/2016' GROUP BY kiosk.name, Year(created_date), Month(created_date) ORDER BY kiosk.name, Year(created_date) DESC , Month(created_date) DESC"); 
			$stmt = $conn->prepare("select DISTINCT kiosk.name AS Kiosk from kiosk");
			$stmtyr = $conn->prepare("Select DISTINCT EXTRACT(YEAR FROM created_date) AS Yr from receipt ORDER BY Yr DESC");
			$stmt->execute();
			$stmtyr->execute();
	
			 // set the resulting array to associative
			$result = $stmt->setFetchMode(PDO::FETCH_ASSOC); 
			echo "<div class = 'container' >";
			
				echo "<div class='col-sm-3'>";
				echo "<b>Kiosk :</b>&nbsp;&nbsp;<select id='kiosklist' multiple='multiple'>";
				foreach($stmt->fetchAll() as $k=>$v)
				{ 
					echo "<option>" . $v['Kiosk'] . "</option>";
   				}
				echo "</select></div>";
				$result = $stmtyr->setFetchMode(PDO::FETCH_ASSOC); 
				echo "<div class='col-sm-3'>";						
				echo "<b>Year :</b>&nbsp;&nbsp;&nbsp;&nbsp;<select id='Yearlist' multiple='multiple'>";
				foreach($stmtyr->fetchAll() as $k=>$v)
				{ 
					echo "<option>" . $v['Yr'] . "</option>";
   				}
				echo "</select></div>";
				echo "<div class='col-sm-3'>";
				echo "<b>Month :</b>&nbsp;<select id='Monthlist' multiple='multiple'>";
								
					echo "<option value='1'>January</option>";
					echo "<option value='2'>February</option>";
					echo "<option value='3'>March</option>";
					echo "<option value='4'>April</option>";
					echo "<option value='5'>May</option>";
					echo "<option value='6'>June</option>";
					echo "<option value='7'>July</option>";
					echo "<option value='8'>August</option>";
					echo "<option value='9'>September</option>";
					echo "<option value='10'>October</option>";
					echo "<option value='11'>November</option>";
					echo "<option value='12'>December</option>";
					
				
				echo "</select></div>";
				
				echo "<div class='col-sm-3'><input type='button' id='btnFilter' value='Show' class='btn btn-primary' /></div></div><hr/>";
				echo "<Div id = 'gallons_DataTable'></Div>";
				
				$stmt = null;
				$conn = null;
		}
		catch(PDOException $e)
		{
			echo "Error: " . $e->getMessage();
			die();
		}
?>

</div>
	 
     <script type="text/javascript" >
        $(function () {
            $('#kiosklist,#Yearlist,#Monthlist').multiselect({
                includeSelectAllOption: true
            });
            $('#btnFilter').click(function () {
				var selectedKiosk = '';
				
				$('#kiosklist :selected').each(function(i, selected){ 
				  selectedKiosk += $(selected).text() + ','; 				   
				}); 
				
                if(selectedKiosk != ''){
					selectedKiosk =  selectedKiosk.substring(0, selectedKiosk.length-1);
				}
                
				var selectedYr = '';
				$('#Yearlist :selected').each(function(j, selected){ 
				  selectedYr += $(selected).text()+ ','; 
				}); 
				
				if(selectedYr != ''){
					selectedYr = selectedYr.substring(0, selectedYr.length-1);
				}
               
				var selectedMo = "";
				$('#Monthlist :selected').each(function(k, selected){ 
				  selectedMo += $(selected).val()+ ",";
				}); 
				
                if(selectedMo != ''){
					selectedMo =   selectedMo.substring(0, selectedMo.length-1);
				}
				var url = 'GallonData.php?kiosk=' + selectedKiosk + '&Yr=' + selectedYr + '&Mo=' + selectedMo ;
				
				$.get(url, function(data, status){
					
					$('#gallons_DataTable').html(data);
					//alert("Data: " + data + "\nStatus: " + status);
				});
				
            });
        });
	</script>
  </body>
</html>