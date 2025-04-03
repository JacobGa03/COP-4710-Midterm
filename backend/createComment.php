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

$stmt->bind_param("sssi", $data['e_id'], $data['u_id'], $data['text'], $data['rating']);

if ($stmt->execute() === false) {
    error_log('Failed to Create Event' . $stmt->error);
    returnError(CODE_SERVER_ERROR, 'Failed to Create Comment: ' . $stmt->error);
} else {
    returnJson(['e_id' => $data['e_id'], 'text' => $data['text'], 'rating' => $data['rating']]);
}

$stmt->close();
$conn->close();
