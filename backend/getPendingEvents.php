<?php
include "index.php";

$data = getRequestInfo();

// return a list of events whose status is 'pending' and the
//super admin has not yet approved or denied
//returns event id, name, description, category, location, contact info, and status

$searchResults = "";
$searchCount = 0;

$conn = getDbConnection();
if ($conn->connect_error) {
    returnError(CODE_SERVER_ERROR, 'Could not connect to the database');
} else {
    $query = "SELECT E.*, AL.*
              FROM Events E
              LEFT JOIN Public_Event PE ON E.e_id = PE.e_id
              LEFT JOIN At_Location AL ON E.location = AL.l_id
              WHERE PE.approval_status = 'pending'";

    $stmt = $conn->prepare($query);
    $stmt->execute();
    $result = $stmt->get_result();

    // Fetch results
    $events = [];
    while ($row = $result->fetch_assoc()) {
        $events[] = $row;
    }
    if (empty($events)) {
        returnError(CODE_NOT_FOUND, 'No events found');
    } else {
        returnJson(['events' => $events]);
    }
}
