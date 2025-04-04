<?php
require "index.php";

$data = getRequestInfo();
$admin_id = $data['admin_id'];
$name = $data['name'];
$university = $data['university'];
$category = $data['category'];
$description = $data['description'];

$conn = getDbConnection();
if ($conn->connect_error) {
    returnError(CODE_SERVER_ERROR, 'Could not connect to the database');
}
//add a possible check for name so they do not have multiple rsos with the same name
else {
    $stmt = $conn->prepare("INSERT INTO RSO(rso_id, admin_id, name, associated_university, category, description) VALUES(UUID(),?,?,?,?,?)");
    $stmt->bind_param("sssss", $admin_id, $name, $university, $category, $description);
    $stmt->execute();
    $stmt->close();

    // Get the RSO's UUID
    $result = $conn->query("SELECT rso_id FROM RSO WHERE admin_id = '$admin_id'");
    $row = $result->fetch_assoc();
    $rso_id = $row['rso_id'];

    // TODO: Lets assume RSO admin isn't in this 'RSO_Member' table
    // $stmt = $conn->prepare("INSERT INTO RSO_Member(rso_id, stu_id) VALUES(?,?)");
    // $stmt->bind_param("ss", $rso_id, $admin_id);
    // $stmt->execute();
    // $stmt->close();
    returnJson(['rso_id' => $rso_id, 'admin_id' => $admin_id, 'name' => $name, 'university' => $university]);
}
