<?php
function generateSelect($selectId, $isMultiSelect, $options){
    return "<select id='" . $selectId . "' " . ($isMultiSelect? "multiple='multiple'" : '') . ">"
            . $options
            . "</select>";
}

function generateOptions($executeResult, $textColumnName){
    $options = "";
    foreach($executeResult as $k=>$v)
    {
        $options .= "<option>" . $v[$textColumnName] . "</option>";
    }
    return $options;
}
function generateOptionsWithValues($executeResult, $textColumnName, $valueColumnName){
    $options = "";
    foreach($executeResult as $k=>$v)
    {
        $options .= "<option value='" . $v[$valueColumnName] . "'>" . $v[$textColumnName] . "</option>";
    }
    return $options;
}

function getOptionsFromList($items) {
    $options = "";
    foreach ($items as $value)
    {
        $options .= "<option>" . $value . "</option>";
    }
    return $options;
}

function getMonthOptions() {
   return
        "<option value='1'>January</option>" .
        "<option value='2'>February</option>" .
        "<option value='3'>March</option>" .
        "<option value='4'>April</option>" .
        "<option value='5'>May</option>" .
        "<option value='6'>June</option>" .
        "<option value='7'>July</option>" .
        "<option value='8'>August</option>" .
        "<option value='9'>September</option>" .
        "<option value='10'>October</option>" .
        "<option value='11'>November</option>" .
        "<option value='12'>December</option>";
}

function getYearOptions() {
    $result = executeStmt("Select DISTINCT EXTRACT(YEAR FROM created_date) AS Yr from receipt ORDER BY Yr DESC");
    return generateOptions($result, 'Yr');
}
function getKioskOptions() {
    $result = executeStmt("select DISTINCT kiosk.name AS Kiosk from kiosk");
    return generateOptions($result, 'Kiosk');
}

function getSkuListOptionsGenerate() {
    $result = executeStmt("Select distinct receipt_line_item.sku As SKU from receipt_line_item inner join product on receipt_line_item.sku = product.sku where product.category_id = 60 and product.active = 1");
    return generateOptions($result, 'SKU');
}



?>