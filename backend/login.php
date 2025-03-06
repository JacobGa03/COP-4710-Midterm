<?php
require 'index.php'; // Need this so we have base functionalities to make API calls

//get JSON data 
$data = getRequestInfo();

// * Take in the users credentials email (String), and password (SHA256) 
// * and return all related user information. 'u_id' represents the University
// * the user is associated with. Along with this an array of RSOs should be returned
// * indicating which RSOs the user is a part of.

//get connection to the database
$conn = getDbConnection();
if ($conn->connect_error) {
    returnError(CODE_SERVER_ERROR, 'Could not connect to the database');
}
else{
    // Prepare sql statement
    $stmt = $conn->prepare("SELECT stu_id,university,email FROM Students WHERE email =? AND password =?");
    $stmt->bind_param("ss", $data['email'], $data['password']);
    $stmt->execute();
    $result = $stmt->get_result();

    // User is a student
    if($row = $result->fetch_assoc()){
        // TODO: Grab a list of the RSO's the user is in (RSOMember) & a list of RSOs the user is an Admin of
        returnJson(['stu_id' => $row['stu_id'], 'university' => $row['university'], 'u_id' => $row['u_id'], 'email' => $row['email']]);
    }
    // User is a super admin
    else{
        $stmt = $conn->prepare("SELECT sa_id,university,email FROM Super_Admins WHERE email =? AND password =?");
        $stmt->bind_param("ss", $data['email'], $data['password']);
        $stmt->execute();
        $result = $stmt->get_result();
        if($row = $result->fetch_assoc()){
            returnJson(['sa_id' => $row['sa_id'], 'university' => $row['university'], 'email' => $row['email']]);
        }
        else{
            returnError(CODE_NOT_FOUND, 'User not found');
        }
    }
    $stmt->close();
    $conn->close();
}
?>