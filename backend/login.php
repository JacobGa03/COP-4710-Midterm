<?php
require 'index.php'; // Need this so we have base functionalities to make API calls

//get JSON data 
$data = getRequestInfo();

// * Take in the users credentials email (String), and password (SHA256) 
// * and return all related user information. 'u_id' represents the University
// * the user is associated with. Along with this an array of RSOs should be returned
// * indicating which RSOs the user is a part of.

//get connection to the database
$conn = getDbConnection();
if ($conn->connect_error) {
    returnError(CODE_SERVER_ERROR, 'Could not connect to the database');
} else {
    // Prepare sql statement
    $stmt = $conn->prepare("SELECT stu_id,university,email,name FROM Students WHERE email =? AND password =?");
    $stmt->bind_param("ss", $data['email'], $data['password']);
    $stmt->execute();
    $result = $stmt->get_result();

    // User is a student
    if ($row = $result->fetch_assoc()) {
        $rso_member = getRSOMembership($conn, $row['stu_id']);
        $rso_admin =  getRSOAdmin($conn, $row['stu_id']);
        returnJson(['stu_id' => $row['stu_id'], 'u_id' => $row['university'], 'email' => $row['email'], 'name' => $row['name'], 'rso_member' => $rso_member, 'rso_admin' => $rso_admin]);
    }
    // User is a super admin
    else {
        $stmt = $conn->prepare("SELECT sa_id,university,email,name FROM Super_Admins WHERE email =? AND password =?");
        $stmt->bind_param("ss", $data['email'], $data['password']);
        $stmt->execute();
        $result = $stmt->get_result();
        if ($row = $result->fetch_assoc()) {
            returnJson(['sa_id' => $row['sa_id'], 'university' => $row['university'], 'email' => $row['email'], 'name' => $row['name']]);
        } else {
            returnError(CODE_NOT_FOUND, 'User not found');
        }
    }
    $stmt->close();
    $conn->close();
}

// Get the RSO's of which the user is a member of 
function getRSOMembership($conn, $stu_id)
{
    $stmt = $conn->prepare("SELECT rso_id FROM RSO_Member WHERE stu_id = ?");
    $stmt->bind_param("s", $stu_id);
    $stmt->execute();

    $res = "";

    // Loop through the results
    $result = $stmt->get_result();
    if ($result->num_rows > 0) {
        $res .= "[";
        // Grab each row from the search result
        while ($row = $result->fetch_assoc()) {
            $res .= $row["rso_id"] . ", ";
        }
        $res .= "]";
    }
    // The user isn't apart of any RSOs 
    else {
        $res = "[]";
    }

    return $res;
}

// Get all of the RSO's which the user is an admin of
function getRSOAdmin($conn, $stu_id)
{
    $stmt = $conn->prepare("SELECT rso_id FROM RSO WHERE admin_id = ?");
    $stmt->bind_param("s", $stu_id);
    $stmt->execute();

    $res = "";

    $result = $stmt->get_result();
    if ($result->num_rows > 0) {
        $res .= "[";
        while ($row = $result->fetch_assoc()) {
            $res .= $row["rso_id"] . ", ";
        }
        $res .= "]";
    } else {
        $res = "[]";
    }

    return $res;
}
