<?php
require 'index.php';

$data = getRequestInfo();

if (empty($data['e_id']) || empty($data['u_id']) || empty($data['text']) || empty($data['rating'])) {
    returnError(CODE_BAD_REQUEST, 'Missing required fields');
}

$conn = getDbConnection();
if ($conn->connect_error) {
    returnError(CODE_SERVER_ERROR, 'Could not connect to the database');
}

$query = "INSERT INTO Comments (c_id, e_id, u_id, text, rating) VALUES (UUID(), ?, ?, ?, ?)";
$stmt = $conn->prepare($query);
if ($stmt === false) {
    returnError(CODE_SERVER_ERROR, 'Prepare failed: ' . htmlspecialchars($conn->error));
}

$stmt->bind_param("ssss", $data['e_id'], $data['u_id'], $data['text'], $data['rating']);
$stmt->execute();

if ($stmt->affected_rows > 0) {
    returnJson(['message' => 'Comment added successfully']);
} else {
    returnError(CODE_SERVER_ERROR, 'Failed to add comment');
}

$stmt->close();
$conn->close();
?>