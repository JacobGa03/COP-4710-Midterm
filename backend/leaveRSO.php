<?php
require 'index.php';

$data = getRequestInfo();
$stu_id = $data['stu_id'];
$rso_id = $data['rso_id'];

$conn = getDbConnection();
if ($conn->connect_error) {
    returnError(CODE_SERVER_ERROR, 'Could not connect to the database');
} else {
    // Check if the student is a member of the RSO
    $stmt = $conn->prepare("SELECT * FROM RSO_Member WHERE stu_id = ? AND rso_id = ?");
    $stmt->bind_param("ss", $stu_id, $rso_id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($row = $result->fetch_assoc()) {
        // If the student is a member, delete the record
        $stmt = $conn->prepare("DELETE FROM RSO_Member WHERE stu_id = ? AND rso_id = ?");
        $stmt->bind_param("ss", $stu_id, $rso_id);
        $stmt->execute();

        returnJson(['message' => 'Successfully left the RSO', 'stu_id' => $stu_id, 'rso_id' => $rso_id]);
    } else {
        // If the student is not a member, return an error
        returnError(CODE_NOT_FOUND, 'User is not a member of the RSO');
    }
    $stmt->close();
    $conn->close();
}
?>