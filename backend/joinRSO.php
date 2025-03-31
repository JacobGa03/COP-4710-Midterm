<?php
require 'index.php';
$data = getRequestInfo();
$stu_id = $data['stu_id'];
$rso_id = $data['rso_id'];


$conn = getDbConnection();
if ($conn->connect_error) {
    returnError(CODE_SERVER_ERROR, 'Could not connect to the database');
} else {
    $stmt = $conn->prepare("SELECT * FROM RSO_Member WHERE stu_id = ? AND rso_id = ?");
    $stmt->bind_param("ss", $rso_id, $stu_id);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($row = $result->fetch_assoc()) {
        returnError(CODE_CONFLICT, 'User already in RSO');
    } else {
        $stmt = $conn->prepare("INSERT INTO RSO_Member (rso_id,stu_id) VALUES(?,?)");
        $stmt->bind_param("ss", $rso_id, $stu_id);
        $stmt->execute();

        returnJson(['stu_id' => $stu_id, 'rso_id' => $rso_id]);
    }
    $stmt->close();
    $conn->close();
}
