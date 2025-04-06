<?php
require "index.php";

$data = getRequestInfo();
$admin_id = $data['admin_id'];
$name = $data['name'];
$university = $data['university'];
$category = $data['category'];
$description = $data['description'];
$members = $data['members'];
$members_added = [];

$conn = getDbConnection();
if ($conn->connect_error) {
    returnError(CODE_SERVER_ERROR, 'Could not connect to the database');
}
//add a possible check for name so they do not have multiple RSOs with the same name
else {
    $stmt = $conn->prepare("INSERT INTO RSO(rso_id, admin_id, name, associated_university, category, description) VALUES(UUID(),?,?,?,?,?)");
    $stmt->bind_param("sssss", $admin_id, $name, $university, $category, $description);
    $stmt->execute();
    $stmt->close();

    // Get the RSO's UUID
    // ! Need to make sure we get the last created RSO, since a single user might be an Admin of multiple RSOs
    $result = $conn->query("SELECT rso_id FROM RSO WHERE admin_id = '$admin_id' AND name = '$name' AND associated_university = '$university'");
    $row = $result->fetch_assoc();
    $rso_id = $row['rso_id'];

    // Next attempt to add all of the members attached 
    foreach ($members as $member_email) {
        // Grab the stu_id based off of the email
        $id = getStudentId($conn, $member_email, $university);

        // ! If the id matches admin_id, then we want to skip over this
        // ! since we don't need to add the admin id to RSO_Member
        if ($id != $admin_id && $id != null) {
            $members_added[] = $member_email;
            addRSOMember($conn, $rso_id, $id);
        }
    }

    returnJson(['rso_id' => $rso_id, 'admin_id' => $admin_id, 'name' => $name, 'university' => $university, 'members_added' => $members_added]);
}

function getStudentId($conn, $email, $university)
{
    $stmt = $conn->prepare("SELECT stu_id FROM Students WHERE email = ? AND university = ?");
    $stmt->bind_param("ss", $email, $university);
    if ($stmt->execute() === true) {
        $result = $stmt->get_result();
        $row = $result->fetch_assoc();
        return $row['stu_id'];
    }
    return null;
}

function addRSOMember($conn, $rso_id, $stu_id)
{
    $stmt = $conn->prepare("INSERT INTO RSO_Member (rso_id,stu_id) VALUES(?,?)");
    $stmt->bind_param("ss", $rso_id, $stu_id);
    $stmt->execute();
    // * There shouldn't need check for failure to insert since
    // * we know the student and RSO exists
}
