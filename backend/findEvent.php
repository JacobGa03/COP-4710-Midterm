<?php
require 'index.php';
$data = getRequestInfo();

$searchResults = "";
$searchCount = 0;

$conn = getDbConnection();
if ($conn->connect_error) {
    returnError(CODE_SERVER_ERROR, 'Could not connect to the database');
} else {
    // Query for approved public events
    $queryPublicEvents = "
        SELECT 
            E.e_id, 
            E.name, 
            E.description, 
            E.category, 
            AL.latitude, 
            AL.longitude, 
            AL.address, 
            E.start_time,
            E.end_time,
            E.contact_phone,
            E.contact_email,
            E.room,
            'public' AS visibility,
            PUE.approval_status,
            NULL AS rso_id
        FROM Events E
        LEFT JOIN Public_Event PUE ON E.e_id = PUE.e_id
        LEFT JOIN At_Location AL ON E.location = AL.l_id
        WHERE PUE.approval_status = 'approved'
    ";
    $params = [];
    $types = "";

    if (!empty($data['name'])) {
        $queryPublicEvents .= " AND E.name LIKE ?";
        $params[] = "%" . $data['name'] . "%";
        $types .= "s";
    }
    if (!empty($data['category'])) {
        $queryPublicEvents .= " AND E.category = ?";
        $params[] = $data['category'];
        $types .= "s";
    }

    // Query for private and RSO events
    $queryOtherEvents = "
        SELECT 
            E.e_id, 
            E.name, 
            E.description, 
            E.category, 
            AL.latitude, 
            AL.longitude, 
            AL.address, 
            E.start_time,
            E.end_time,
            E.contact_email,
            E.contact_phone,
            E.room,
            CASE 
                WHEN PE.e_id IS NOT NULL THEN 'private'
                WHEN RE.e_id IS NOT NULL THEN 'rso'
            END AS visibility,
            NULL AS approval_status,
            RE.related_RSO AS rso_id
        FROM Events E
        LEFT JOIN Private_Event PE ON E.e_id = PE.e_id
        LEFT JOIN RSO_Event RE ON E.e_id = RE.e_id
        LEFT JOIN At_Location AL ON E.location = AL.l_id
        WHERE 1=1
    ";
    if (!empty($data['name'])) {
        $queryOtherEvents .= " AND E.name LIKE ?";
        $params[] = "%" . $data['name'] . "%";
        $types .= "s";
    }
    if (!empty($data['category'])) {
        $queryOtherEvents .= " AND E.category = ?";
        $params[] = $data['category'];
        $types .= "s";
    }
    if (!empty($data['associated_uni'])) {
        $queryOtherEvents .= " AND (PE.associated_uni = ? OR RE.associated_uni = ?)";
        $params[] = $data['associated_uni'];
        $params[] = $data['associated_uni'];
        $types .= "ss";
    }

    // Combine the queries using UNION
    $query = "($queryPublicEvents) UNION ($queryOtherEvents)";

    // Prepare and execute the statement
    $stmt = $conn->prepare($query);
    if ($stmt === false) {
        returnError(CODE_SERVER_ERROR, 'Prepare failed: ' . htmlspecialchars($conn->error));
    }

    if (!empty($params)) {
        $stmt->bind_param($types, ...$params);
    }
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

    $stmt->close();
    $conn->close();
}
