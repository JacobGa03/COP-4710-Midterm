<?php
require 'index.php';
$data = getRequestInfo();

$searchResults = "";
$searchCount = 0;

$conn = getDbConnection();
if($conn->connect_error){
    returnError(CODE_SERVER_ERROR, 'Could not connect to the database');
}
else{
    $stmt = $conn->prepare("SELECT * FROM RSO WHERE name LIKE ?");
    $rsoName = "%" . $data['search'] . "%";
    $stmt->bind_param("s", $rsoName);
    $stmt->execute();
    $result = $stmt->get_result();
    while($row = $result->fetch_assoc()){
        if($searchCount > 0){
            $searchResults .= ",";
        }
        $searchCount++;
        $searchResults .= '{"rso_id": "' . $row['rso_id'] . '", "name": "' . $row['name'] . '", "member_count": "' . $row['member_count'] . '"}';
    }
    if($searchCount == 0){
        returnError(CODE_NOT_FOUND, 'No RSOs found');
    }
    else{
        returnJsonString($searchResults);
    }
    $stmt->close();
    $conn->close();
}


?>