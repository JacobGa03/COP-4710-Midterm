<?php

require "index.php";

$data = getRequestInfo();

// * Grab ALL of the RSO information for an RSO with the given rso_id
// * Used for displaying RSO info within the Profile page, and NOT within the 
// * RSO page.

$conn = getDbConnection();

if ($conn->connect_error) {
    returnError(CODE_SERVER_ERROR, "Could not connect to database");
} else {
    $stmt = $conn->prepare("SELECT * FROM RSO WHERE rso_id = ?");
    $stmt->bind_param("s", $data['rso_id']);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        // TODO: Add more fields here to display different stuff
        returnJson($row);
    } else {
        returnError(CODE_NOT_FOUND, "RSO not found");
    }
    $stmt->close();
    $conn->close();
}
