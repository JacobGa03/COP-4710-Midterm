<?php
require "index.php";

$data = getRequestInfo();

// * Given the UUID for a university return the human readable name.
// * This will be used for displaying university based information in a 
// * readable format to the frontend.
$u_id = $data['u_id'];

$conn = getDbConnection();

if ($conn->connect_error) {
    returnError(CODE_SERVER_ERROR, 'Could not connect to the database');
} else {
    $stmt = $conn->prepare("SELECT name FROM University WHERE u_id = ?");
    $stmt->bind_param("s", $u_id);
    $stmt->execute();
    $result = $stmt->get_result();

    // Return the university Id
    if ($row = $result->fetch_assoc()) {
        returnJson(['name' => $row['name']]);
    } else {
        returnError(CODE_NOT_FOUND, "Couldn't find University name");
    }
}
