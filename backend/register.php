<?php
require 'index.php'; // Need this so we have base functionalities to make API calls

$data = getRequestInfo();
$email = $data['email'];
$password = $data['password'];  
$university = $data['university'];
$role = $data['role'];
//$stu_id = '';


$conn = getDbConnection();
if($conn->connect_error){
    returnError(CODE_SERVER_ERROR, 'Could not connect to the database');
}
else{
    if($role == 'student'){
        $stmt = $conn->prepare("SELECT email FROM Students WHERE email =?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();
        if($row = $result->fetch_assoc()){
            returnError(CODE_CONFLICT, 'User already exists');
        }
        else{
            $stmt = $conn->prepare("INSERT INTO Students (stu_id,email, password, university) VALUES(UUID(),?,?,?)");
            $stmt->bind_param("sss",$email, $password, $university);
            $stmt->execute();
            returnJson(['stu_id'=> $conn->insert_id, 'email' => $email, 'university' => $university]);
        }
        $stmt->close();
        $conn->close();
    }
    
    else
    {
        $stmt = $conn->prepare("SELECT email FROM Super_Admins WHERE email =?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();
        if($row = $result->fetch_assoc()){
            returnError(CODE_CONFLICT, 'User already exists');
        }
        else{
            $stmt = $conn->prepare("INSERT INTO Super_Admins (sa_id,email, password, university) VALUES(UUID(),?,?,?)");
            $stmt->bind_param("sss",$email, $password, $university);
            $stmt->execute();
            returnJson(['sa_id'=> $conn->insert_id, 'email' => $email, 'university' => $university]);
        }
        $stmt->close();
        $conn->close();
    }
}


?>