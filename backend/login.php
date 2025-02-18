<?php
require 'index.php'; // Need this so we have base functionalities to make API calls

//get JSON data 
$data = getRequestInfo();

//get connection to the database
$conn = getDbConnection();
if ($conn->connect_error) {
    returnError(CODE_SERVER_ERROR, 'Could not connect to the database');
}
else{
    //prepare sql statement
    $stmt = $conn->prepare("SELECT stu_id,university,email FROM Students WHERE email =? AND password =?");
    $stmt->bind_param("ss", $data['email'], $data['password']);
    $stmt->execute();
    $result = $stmt->get_result();
    if($row = $result->fetch_assoc()){
        returnJson(['stu_id' => $row['stu_id'], 'university' => $row['university'], 'email' => $row['email']]);
    }
    else{
        returnError(CODE_NOT_FOUND, 'No records found');
    }

    $stmt->close();
    $conn->close();
}


?>