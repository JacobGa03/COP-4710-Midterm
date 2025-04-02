<?php
require 'index.php';

$data = getRequestInfo();

// Validate input: Ensure the comment ID (`c_id`) is provided, and at least one field to update (`text` or `rating`) is included
if (empty($data['c_id']) || (empty($data['text']) && empty($data['rating']))) {
    returnError(CODE_BAD_REQUEST, 'Missing required fields');
}

$conn = getDbConnection();
if ($conn->connect_error) {
    returnError(CODE_SERVER_ERROR, 'Could not connect to the database');
}

// Query to update the comment
$query = "
    UPDATE Comments 
    SET 
        text = COALESCE(?, text), 
        rating = COALESCE(?, rating) 
    WHERE 
        c_id = ?
";

$stmt = $conn->prepare($query);
if ($stmt === false) {
    returnError(CODE_SERVER_ERROR, 'Prepare failed: ' . htmlspecialchars($conn->error));
}

// Bind the parameters to the query
$stmt->bind_param("sis", $data['text'], $data['rating'], $data['c_id']);
$stmt->execute();

// Check if the comment was updated
if ($stmt->affected_rows > 0) {
    returnJson(['message' => 'Comment updated successfully']);
} else {
    returnError(CODE_NOT_FOUND, 'Comment not found or no changes made');
}

$stmt->close();
$conn->close();
?>