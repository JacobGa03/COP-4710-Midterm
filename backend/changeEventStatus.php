<?php
include "index.php";

$data = getRequestInfo();
//takes in event_id and status 
//returns the event_id of event whose status was changed
$e_id = $data['e_id'];
//$admin_id = $data['admin_id'];
$status = $data['status'];

$conn = getDbConnection();
if($conn->connect_error){
    returnError(CODE_SERVER_ERROR, 'Could not connect to the database');
}
else{
    if($status == 'approved'){
    $stmt = $conn->prepare("UPDATE Public_Event SET approval_status = 'approved' WHERE e_id = ?");
    $stmt->bind_param("s", $e_id);
    $stmt->execute();
    $stmt->close();
    returnJson(['e_id' => $e_id]);
    }
    //if the event is denied then delete the event 
    else if($status == 'rejected'){
        $stmt = $conn->prepare("UPDATE Public_Event SET approval_status = 'rejected' WHERE e_id = ?");
        $stmt->bind_param("s", $e_id);
        $stmt->execute();
        $stmt->close();
        returnJson(['e_id' => $e_id]);
    }
}
?>