<?php
require 'index.php'; // Need this so we have base functionalities to make API calls

$data = getRequestInfo();
$email = $data['email'];
$password = $data['password'];
$university = $data['university'];
$role = $data['role'];
$name = $data['name'];

// * Take in the 'email' (String), 'password' (SHA256 hashed), 'university' (String), and 'role' (String).
// * Returned is the new information of the user. All important id's will be returned to ensure entities
// * like Universities are easily queryable by the frontend.

$conn = getDbConnection();

if ($conn->connect_error) {
    returnError(CODE_SERVER_ERROR, 'Could not connect to the database');
} else {
    $uni_id = getUni($conn, $university);

    // MySQL already has a check for a unique email, so simply trying an
    // insert and catching an error for duplicates will be enough.
    if ($role == 'student') {
        $stmt = $conn->prepare("INSERT INTO Students (stu_id, email, password, university, name) VALUES(UUID(),?,?,?,?)");
        $stmt->bind_param("ssss", $email, $password, $uni_id, $name);
        if ($stmt->execute()) {
            // Grab the new uuid of the user
            $newStmt = $conn->prepare("SELECT stu_id from Students where email = ?");
            $newStmt->bind_param("s", $email);
            $newStmt->execute();
            $newResult = $newStmt->get_result();
            $newRow = $newResult->fetch_assoc();

            returnJson(['stu_id' => $newRow['stu_id'], 'email' => $email, 'u_id' => $uni_id, 'name' => $name]);
        } else {
            if ($conn->errno == 1062) { // 1062 is the error code for duplicate entry
                returnError(CODE_CONFLICT, 'User already exists');
            } else {
                returnError(CODE_SERVER_ERROR, 'Database error: ' . $conn->error);
            }
        }
        $stmt->close();
        $conn->close();
    }
    // Create a super admin 
    else {
        $stmt = $conn->prepare("INSERT INTO Super_Admins (sa_id, email, password, university, name) VALUES(UUID(),?,?,?,?)");
        $stmt->bind_param("ssss", $email, $password, $university, $name);
        if ($stmt->execute()) {
            // Get the UUID of the new user
            $newStmt = $conn->prepare("SELECT sa_id from Super_Admins where email = ?");
            $newStmt->bind_param("s", $email);
            $newStmt->execute();
            $newResult = $newStmt->get_result();
            $newRow = $newResult->fetch_assoc();
            returnJson(['sa_id' => $newRow['sa_id'], 'email' => $email, 'u_id' => $uni_id, 'name' => $name]);
        } else {
            if ($conn->errno == 1062) { // 1062 is the error code for duplicate entry
                returnError(CODE_CONFLICT, 'User already exists');
            } else {
                returnError(CODE_SERVER_ERROR, 'Database error: ' . $conn->error);
            }
        }
        $stmt->close();
        $conn->close();
    }
}
// * To get the university Id, call this function as a work around
// * since CURL couldn't be used (for some reason). This returns the 
// * university uuid for the university the users is registering with.
function getUni($conn, $university)
{

    if ($conn->connect_error) {
        returnError(CODE_SERVER_ERROR, 'Could not connect to the database');
    } else {
        $stmt = $conn->prepare("SELECT * FROM University WHERE name = ?");
        $stmt->bind_param("s", $university);
        $stmt->execute();
        $result = $stmt->get_result();

        // Return the university Id
        if ($row = $result->fetch_assoc()) {
            return $row['u_id'];
        } else {
            // Add the new university into the database
            $insertStmt = $conn->prepare("INSERT INTO University (u_id, name) VALUES (UUID(), ?)");
            $insertStmt->bind_param("s", $university);
            $insertStmt->execute();
            // Grab the newly inserted University to retrieve its UUID
            $newStmt = $conn->prepare("SELECT * FROM University WHERE name = ?");
            $newStmt->bind_param("s", $university);
            $newStmt->execute();
            $newResult = $newStmt->get_result();

            // Return it!
            if ($newRow = $newResult->fetch_assoc()) {
                return $newRow['u_id'];
            } else {
                returnError(CODE_SERVER_ERROR, 'Could not insert the university');
            }
        }
    }
}
