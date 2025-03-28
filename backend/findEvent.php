<?php
require 'index.php';
$data = getRequestInfo();

$searchResults = "";
$searchCount = 0;

$conn = getDbConnection();
if ($conn->connect_error) {
    returnError(CODE_SERVER_ERROR, 'Could not connect to the database');
} else {
    $query = "SELECT E.e_id, E.name, E.description, E.category, E.location, E.contact_info, E.time 
              FROM Events E 
              LEFT JOIN Private_Event PE ON E.e_id = PE.e_id 
              LEFT JOIN RSO_Event RE ON E.e_id = RE.e_id 
              WHERE 1=1";
    $params = [];
    $types = "";

    if (!empty($data['name'])) {
        $query .= " AND E.name LIKE ?";
        $params[] = "%" . $data['name'] . "%";
        $types .= "s";
    }
    if (!empty($data['category'])) {
        $query .= " AND E.category = ?";
        $params[] = $data['category'];
        $types .= "s";
    }
    if (!empty($data['location'])) {
        $query .= " AND E.location = ?";
        $params[] = $data['location'];
        $types .= "s";
    }
    if (!empty($data['associated_uni'])) {
        $query .= " AND (PE.associated_uni = ? OR RE.associated_uni = ?)";
        $params[] = $data['associated_uni'];
        $params[] = $data['associated_uni'];
        $types .= "ss";
    }
    if (!empty($data['time'])) {
        $query .= " AND E.time = ?";
        $params[] = $data['time'];
        $types .= "s";
    }

    $stmt = $conn->prepare($query);
    if ($stmt === false) {
        returnError(CODE_SERVER_ERROR, 'Prepare failed: ' . htmlspecialchars($conn->error));
    }

    if (!empty($params)) {
        $stmt->bind_param($types, ...$params);
    }
    $stmt->execute();
    $result = $stmt->get_result();

    while ($row = $result->fetch_assoc()) {
        if ($searchCount > 0) {
            $searchResults .= ",";
        }
        $searchCount++;
        $searchResults .= '{"e_id": "' . $row['e_id'] . '", "name": "' . $row['name'] . '", "description": "' . $row['description'] . '", "category": "' . $row['category'] . '", "location": "' . $row['location'] . '", "contact_info": "' . $row['contact_info'] . '", "time": "' . $row['time'] . '"}';
    }
    if ($searchCount == 0) {
        returnError(CODE_NOT_FOUND, 'No events found');
    } else {
        returnJsonString($searchResults);
    }
    $stmt->close();
    $conn->close();
}
