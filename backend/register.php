<?php
require 'index.php'; // Need this so we have base functionalities to make API calls

$data = getRequestInfo();
$email = $data['email'];
$password = $data['password'];  
$university = $data['university'];
$role = $data['role'];
$university_id = "";

// * Take in the 'email' (String), 'password' (SHA256 hashed), 'university' (String), and 'role' (String).
// * Returned is the new information of the user. All important id's will be returned to ensure entities
// * like Universities are easily queryable by the frontend.

$conn = getDbConnection();
if($conn->connect_error){
    returnError(CODE_SERVER_ERROR, 'Could not connect to the database');
}
else{
    // Call the 'createUniversity.php' endpoint to get the university id
    $universityData = json_encode(['university' => $university]);
    $ch = curl_init(BASE_URL+BACKEND+"/getUniversity.php");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $universityData);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type:application/json'));
    // Call the other endpoint 
    $response = curl_exec($ch);
    curl_close($ch);


    // Make sure we can grab the university and u_id of the school to which they belong
    $responseData = json_decode($response, true);
    if (isset($responseData['university_id'])) {
        $university_id = $responseData['university_id'];
    } else {
        returnError(CODE_SERVER_ERROR, 'Could not retrieve university ID');
    }

    // MySQL already has a check for a unique email, so simply trying an
    // insert and catching an error for duplicates will be enough.
    if($role == 'student'){
        $stmt = $conn->prepare("INSERT INTO Students (stu_id, email, password, university_id) VALUES(UUID(),?,?,?)");
        $stmt->bind_param("sss", $email, $password, $university_id);
        if ($stmt->execute()) {
            returnJson(['stu_id' => $conn->insert_id, 'email' => $email, 'u_id' => $university_id]);
        } else {
            if ($conn->errno == 1062) { // 1062 is the error code for duplicate entry
            returnError(CODE_CONFLICT, 'User already exists');
            } else {
            returnError(CODE_SERVER_ERROR, 'Database error: ' . $conn->error);
            }
        }
        $stmt->close();
        $conn->close();
    }
    // Create a super admin 
    else
    {
        $stmt = $conn->prepare("INSERT INTO Super_Admins (sa_id, email, password, university) VALUES(UUID(),?,?,?)");
        $stmt->bind_param("sss", $email, $password, $university);
        if ($stmt->execute()) {
            returnJson(['sa_id' => $conn->insert_id, 'email' => $email, 'u_id' => $university]);
        } else {
            if ($conn->errno == 1062) { // 1062 is the error code for duplicate entry
            returnError(CODE_CONFLICT, 'User already exists');
            } else {
            returnError(CODE_SERVER_ERROR, 'Database error: ' . $conn->error);
            }
        }
        $stmt->close();
        $conn->close();
    }
}
?>