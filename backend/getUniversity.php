<?php
require "index.php";

// Input a University name and either
// 1. Adds a new university to the 'University' table
// 2. Returns the university ID of the university in the table 

$data = getRequestInfo();

// * This should be uniform across all US universities.
// * ie. Only 'University of Central Florida' should appear and not 'UCF' or something else.
$university = $data['university'];

$conn = getDbConnection();

if($conn->connect_error){
    returnError(CODE_SERVER_ERROR, 'Could not connect to the database');
}
else{
    $stmt = $conn->prepare("SELECT * FROM University WHERE name = ?"); 
    $stmt->bind_param("s", $university);
    $stmt->execute();
    $result = $stmt->get_result();

    // Return the university Id
    if($row = $result->fetch_assoc()){
        returnJson(['u_id' => $row['u_id'], 'university' => $university]);
    } else {
        // Add the new university into the database
        $insertStmt = $conn->prepare("INSERT INTO University (u_id, name) VALUES (UUID(), ?)");
        $insertStmt->bind_param("s", $university);
        $insertStmt->execute();
        // Grab the newly inserted University to retrieve its UUID
        $newStmt = $conn->prepare("SELECT * FROM University WHERE name = ?");
        $newStmt->bind_param("s", $university);
        $newStmt->execute();
        $newResult = $newStmt->get_result();

        // Return it!
        if($newRow = $newResult->fetch_assoc()){
            returnJson(['u_id' => $newRow['u_id'], 'university' => $university]);
        } else {
            returnError(CODE_SERVER_ERROR, 'Could not insert the university');
        }
    }
}
?>