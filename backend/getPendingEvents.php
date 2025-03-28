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
    $query = "SELECT E.*,PE.approval_status
              FROM Events E
              LEFT JOIN Public_Event PE ON E.e_id = PE.e_id
              WHERE PE.approval_status = 'pending'";

    $stmt = $conn->prepare($query);
    $stmt->execute();
    $result = $stmt->get_result();

    while ($row = $result->fetch_assoc()) {
        if ($searchCount > 0) {
            $searchResults .= ",";
        }
        $searchCount++;
        $searchResults .= '{"e_id": "' . $row['e_id'] . '", "name": "' . $row['name'] . '", "description": "' . $row['description'] . '", "category": "' . $row['category'] . '", "location": "' . $row['location'] . '", "contact_info": "' . $row['contact_info'] . '", "status": "' . $row['approval_status'] . '"}';
    }
    if ($searchCount == 0) {
        returnError(CODE_NOT_FOUND, 'No events found');
    } else {
        returnJsonString($searchResults);
    }
}
