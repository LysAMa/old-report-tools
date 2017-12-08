<?php
		$username="app";
		$password="password";
		$dbname="dlo";
		$servername="104.131.40.239";
		
		//For Kiosk Name
		$Name  = isset($_GET["kiosk"]) ? $_GET["kiosk"] : "";
		$ArrName = explode(',', $Name);
		$kioskparam ="";
		
		if(!empty($Name) && count($ArrName) > 0 )
		{
			foreach($ArrName as $N)
			{
				$kioskparam .= "'" . $N . "',";
				
			}
			$kioskparam = rtrim($kioskparam,",");
			$kioskparam = " AND name IN ( $kioskparam ) ";
		}	
		
		//For Years
		$year  = isset($_GET["Yr"]) ? $_GET["Yr"] : "";
		$Arryear = explode(',', $year);
		$yearparam ="";
		
		if(!empty($year) && count($Arryear) > 0 )
		{
			foreach($Arryear as $N)
			{
				$yearparam .= $N.",";
				
			}
			$yearparam = rtrim($yearparam,",");
			$yearparam = " AND Year(created_date) IN ( $yearparam ) ";
		}
		
		//For Month
		$Month  = isset($_GET["Mo"]) ? $_GET["Mo"] : '' ;
		$ArrMonth = explode(',', $Month);
		$Monthparam ="";
		
		if(!empty($Month) && count($ArrMonth) > 0 )
		{
			foreach($ArrMonth as $N)
			{
				$Monthparam .= $N.",";
				
			}
			$Monthparam = rtrim($Monthparam,",");
			$Monthparam = " AND Month(created_date) IN ( $Monthparam ) ";
		}	
		
		
		
		try
		{
			$conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
			// set the PDO error mode to exception
			$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			$stmt = "SELECT 
					kiosk.name AS Kiosk, 
					Year(created_date) AS Yr,
					Month(created_date) AS Mo,
					Sum(receipt_line_item.gallons) AS SumOfgallons 
				FROM (receipt_line_item INNER JOIN receipt ON receipt_line_item.receipt_id = receipt.id) 
				INNER JOIN kiosk ON receipt.kiosk_id = kiosk.id 
				WHERE receipt.created_date >= '11/1/2016' " . $kioskparam . $yearparam . $Monthparam
				. "GROUP BY kiosk.name,  
				 Year(created_date),
				 Month(created_date) 
				ORDER BY kiosk.name, 
				 Year(created_date) DESC , Month(created_date) DESC";
			
			// echo $stmt;
			// echo "<br/><br/><br/><br/>";

			$stmt = $conn->prepare($stmt);
			$stmt->execute();
			
			echo "<table id='gallons_table' border='1' class='table table-bordered' >
				<tbody>
				<tr>
				<th> Kiosk</th>
				<th> Year</th>
				<th> Month</th>
				<th> Sum of Gallons</th>
				</tr>";
				$result = $stmt->setFetchMode(PDO::FETCH_ASSOC); 
				foreach($stmt->fetchAll() as $k=>$v)
				{ 
					echo "<tr><td>" . $v['Kiosk'] . "</td><td>" . $v['Yr'] . "</td><td>" . $v['Mo'] . "</td><td>" . $v['SumOfgallons'] . "</td></tr>";
				}
				echo "</tbody></table>";
				
			$stmt = null;
			$conn = null;			
		}		

		catch(PDOException $e)
		{
			echo "Error: " . $e->getMessage();
			die();
		}
?>