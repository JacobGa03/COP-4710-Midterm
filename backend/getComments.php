<?php
require 'index.php';

$data = getRequestInfo();

// Validate input: Ensure the event ID (`e_id`) is provided
if (empty($data['e_id'])) {
    returnError(CODE_BAD_REQUEST, 'Missing event ID');
}

$conn = getDbConnection();
if ($conn->connect_error) {
    returnError(CODE_SERVER_ERROR, 'Could not connect to the database');
}

// Query to retrieve comments for the given event, including the user's name
$query = "
    SELECT 
        C.c_id, 
        C.u_id,
        C.text, 
        C.rating, 
        S.name AS user_name 
    FROM 
        Comments C
    JOIN 
        Students S ON C.u_id = S.stu_id
    WHERE 
        C.e_id = ?
";

$stmt = $conn->prepare($query);
if ($stmt === false) {
    returnError(CODE_SERVER_ERROR, 'Prepare failed: ' . htmlspecialchars($conn->error));
}

// Bind the event ID to the query
$stmt->bind_param("s", $data['e_id']);
$stmt->execute();
$result = $stmt->get_result();

$comments = [];
while ($row = $result->fetch_assoc()) {
    $comments[] = $row; // Add each comment to the array
}

if (empty($comments)) {
    returnError(CODE_NOT_FOUND, 'No comments found for this event');
} else {
    returnJson(['comments' => $comments]);
}

$stmt->close();
$conn->close();
