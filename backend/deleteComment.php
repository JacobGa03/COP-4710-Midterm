<?php
require 'index.php';

$data = getRequestInfo();

// Validate input: Ensure the comment ID (`c_id`) is provided
if (empty($data['c_id'])) {
    returnError(CODE_BAD_REQUEST, 'Missing comment ID');
}

$conn = getDbConnection();
if ($conn->connect_error) {
    returnError(CODE_SERVER_ERROR, 'Could not connect to the database');
}

// Query to delete the comment
$query = "DELETE FROM Comments WHERE c_id = ?";

$stmt = $conn->prepare($query);
if ($stmt === false) {
    returnError(CODE_SERVER_ERROR, 'Prepare failed: ' . htmlspecialchars($conn->error));
}

// Bind the comment ID to the query
$stmt->bind_param("s", $data['c_id']);
$stmt->execute();

// Check if the comment was deleted
if ($stmt->affected_rows > 0) {
    returnJson(['message' => 'Comment deleted successfully']);
} else {
    returnError(CODE_NOT_FOUND, 'Comment not found');
}

$stmt->close();
$conn->close();
?>