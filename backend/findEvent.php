<?php
require 'index.php';
$data = getRequestInfo();

$searchResults = "";
$searchCount = 0;

$conn = getDbConnection();
if ($conn->connect_error) {
    returnError(CODE_SERVER_ERROR, 'Could not connect to the database');
} else {
    $paramsPublic = [];
    $typesPublic = "";

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

    if (!empty($data['name'])) {
        $queryPublicEvents .= " AND E.name LIKE ?";
        $paramsPublic[] = "%" . $data['name'] . "%";
        $typesPublic .= "s";
    }
    if (!empty($data['category'])) {
        $queryPublicEvents .= " AND E.category = ?";
        $paramsPublic[] = $data['category'];
        $typesPublic .= "s";
    }

    $paramsPrivate = [];
    $typesPrivate = "";
    // Query for private events
    $queryPrivateEvents = "
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
            'private' AS visibility,
            NULL AS approval_status,
            NULL AS rso_id
        FROM Events E
        LEFT JOIN Private_Event PE ON E.e_id = PE.e_id
        LEFT JOIN At_Location AL ON E.location = AL.l_id
        WHERE PE.associated_uni = ? 
    ";
    $paramsPrivate[] = $data['associated_uni'];
    $typesPrivate .= "s";

    if (!empty($data['name'])) {
        $queryPrivateEvents .= " AND E.name LIKE ?";
        $paramsPrivate[] = "%" . $data['name'] . "%";
        $typesPrivate .= "s";
    }
    if (!empty($data['category'])) {
        $queryPrivateEvents .= " AND E.category = ?";
        $paramsPrivate[] = $data['category'];
        $typesPrivate .= "s";
    }

    $paramsRSO = [];
    $typesRSO = "";
    // Query for RSO events
    $queryRSOEvents = "
        SELECT DISTINCT
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
            'rso' AS visibility,
            NULL AS approval_status,
            RE.related_RSO AS rso_id
        FROM Events E
        LEFT JOIN RSO_Event RE ON E.e_id = RE.e_id
        LEFT JOIN At_Location AL ON E.location = AL.l_id
        INNER JOIN RSO_Member RM ON RE.related_RSO = RM.rso_id
        WHERE (RM.stu_id = ? OR RE.related_RSO IN (
            SELECT rso_id 
            FROM RSO 
            WHERE admin_id = ?
        ))
    ";
    $paramsRSO[] = $data['stu_id'];
    $paramsRSO[] = $data['stu_id'];
    $typesRSO .= "ss";

    if (!empty($data['name'])) {
        $queryRSOEvents .= " AND E.name LIKE ?";
        $paramsRSO[] = "%" . $data['name'] . "%";
        $typesRSO .= "s";
    }
    if (!empty($data['category'])) {
        $queryRSOEvents .= " AND E.category = ?";
        $paramsRSO[] = $data['category'];
        $typesRSO .= "s";
    }

    // Execute the queries and combine results
    $events = [];

    // Public Events
    $stmt = $conn->prepare($queryPublicEvents);
    if (!empty($paramsPublic)) {
        $stmt->bind_param($typesPublic, ...$paramsPublic);
    }
    if ($stmt->execute() === false) {
        returnError(CODE_SERVER_ERROR, $stmt->error);
    }
    $result = $stmt->get_result();
    while ($row = $result->fetch_assoc()) {
        $events[] = $row;
    }
    $stmt->close();

    // Private Events
    $stmt = $conn->prepare($queryPrivateEvents);
    if (!empty($paramsPrivate)) {
        $stmt->bind_param($typesPrivate, ...$paramsPrivate);
    }
    if ($stmt->execute() === false) {
        returnError(CODE_SERVER_ERROR, "$stmt->error in Private");
    }
    $result = $stmt->get_result();
    while ($row = $result->fetch_assoc()) {
        $events[] = $row;
    }
    $stmt->close();

    // RSO Events
    $stmt = $conn->prepare($queryRSOEvents);
    if (!empty($paramsRSO)) {
        $stmt->bind_param($typesRSO, ...$paramsRSO);
    }
    if ($stmt->execute() === false) {
        returnError(CODE_SERVER_ERROR, $stmt->error);
    }
    $result = $stmt->get_result();
    while ($row = $result->fetch_assoc()) {
        $events[] = $row;
    }
    $stmt->close();

    // Return the combined results
    if (empty($events)) {
        returnError(CODE_NOT_FOUND, 'No events found');
    } else {
        returnJson(['events' => $events]);
    }

    $conn->close();
}
