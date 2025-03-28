<?php
include 'index.php';
//get data
$data = getRequestInfo();

$contact = $data['contact_info'];
$name = $data['name'];
$description = $data['description'];
$category = $data['category'];
$location = $data['location'];
$visibility = $data['visibility'];
$university = $data['u_id'];
$start = $data['start_time'];
$end = $data['end_time'];
// * If the user is entering an RSO event, then this will be present.
$rso_id = $data['rso_id'];

// Get connection to the database
$conn = getDbConnection();
if ($conn->connect_error) {
    returnError(CODE_SERVER_ERROR, 'Could not connect to the database');
}
// Will need to add a check for time and location 
else {
    // Grab the corresponding location id of the event
    $loc_id = getLocation($conn, $location);

    // If the user is creating an RSO event, ensure the RSO is active
    if ($visibility == 'rso') {
        // Find the RSO
        $newStmt = $conn->prepare("SELECT rso_id, status FROM RSO WHERE rso_id = ?");
        $newStmt->bind_param("s", $rso_id);
        if ($newStmt->execute() === false) {
            returnError(CODE_SERVER_ERROR, 'Failed to Retrieve Associated RSO' . $stmt->error);
        }
        $newestResult = $newStmt->get_result();
        $newRow = $newestResult->fetch_assoc();

        // Only active RSOs may create events
        if ($newRow['status'] == 'inactive') {
            returnError(CODE_SERVER_ERROR, 'Only Active RSOs May Create Events' . $stmt->error);
        }
    }


    // Bind our parameters and insert the event into the base 'Event' class
    $stmt = $conn->prepare("INSERT INTO Events (e_id,  contact_info, name, description, start_time, end_time, category, location) VALUES(UUID(),?,?,?,?,?,?,?)");
    $stmt->bind_param("sssssss", $contact, $name, $description, $start, $end, $category, $loc_id);

    // Execute the statement
    if ($stmt->execute() === false) {
        returnError(CODE_SERVER_ERROR, 'Execute failed: ' . $stmt->error);
    }
    // Now, insert the events into either PUBLIC, PRIVATE, or RSO 
    else {
        // Get the events 'e_id' so we can insert the event into the child class
        $newStmt = $conn->prepare("SELECT e_id  FROM Events WHERE start_time = ? AND end_time = ? AND location = ?");
        $newStmt->bind_param("sss", $start, $end, $loc_id);
        $newStmt->execute();
        $newResult = $newStmt->get_result();
        $newRow = $newResult->fetch_assoc();
        $e_id = $newRow['e_id'];

        // Insert the new event
        if ($visibility == 'public') {
            $newStmt = $conn->prepare("INSERT INTO Public_Event (e_id) VALUES (?)");
            $newStmt->bind_param("s", $e_id);
            // Check for successful completion
            if ($newStmt->execute() === false) {
                returnError(CODE_SERVER_ERROR, 'Failed to Create Public Event' . $stmt->error);
            }
        } else if ($visibility == 'private') {
            $newStmt = $conn->prepare("INSERT INTO Private_Event (e_id, associated_uni) VALUES (?, ?)");
            $newStmt->bind_param("ss", $e_id, $university);
            // Check for successful completion
            if ($newStmt->execute() === false) {
                returnError(CODE_SERVER_ERROR, 'Failed to Create Private Event' . $stmt->error);
            }
        } else if ($visibility == 'rso') {
            $newStmt = $conn->prepare("INSERT INTO RSO_Event (e_id, related_RSO, associated_uni) VALUES (?, ?, ?)");
            $newStmt->bind_param("sss", $e_id, $rso_id, $university);
            // Check for successful completion
            if ($newStmt->execute() === false) {
                returnError(CODE_SERVER_ERROR, 'Failed to Create RSO Event' . $stmt->error);
            }
        }

        // Upon successful execution, return pertinent information
        returnJson(['e_id' => $newRow['e_id'], 'contact_info' => $contact, 'name' => $name, 'description' => $description, 'category' => $category, 'location' => $location, 'visibility' => $visibility]);
    }

    $stmt->close();
    $conn->close();
}

function getLocation($conn, $location)
{
    // $locationData = json_decode($location, true);
    $locationData = $location;

    if ($locationData === null) {
        returnError(CODE_SERVER_ERROR, "Invalid Location JSON");
    }

    $name = $locationData['name'];
    $lat = $locationData['lat'];
    $lng = $locationData['lng'];

    // Get the loc id from the database
    $stmt = $conn->prepare("SELECT * FROM At_Location WHERE address = ? AND latitude = ? AND  longitude = ?");
    $stmt->bind_param("sdd", $name, $lat, $lng);
    $stmt->execute();
    $result = $stmt->get_result();

    // Return the university Id
    if ($row = $result->fetch_assoc()) {
        return $row['l_id'];
    } else {

        // Add the new location into the database
        $insertStmt = $conn->prepare("INSERT INTO At_Location (l_id, address, latitude, longitude) VALUES (UUID(), ?, ?, ?)");
        $insertStmt->bind_param("sdd", $name, $lat, $lng);
        $insertStmt->execute();

        // Grab the newly inserted University to retrieve its UUID
        $newStmt = $conn->prepare("SELECT * FROM At_Location WHERE address = ? AND latitude = ? AND  longitude = ?");
        $newStmt->bind_param("sdd", $name, $lat, $lng);
        $newStmt->execute();
        $newResult = $newStmt->get_result();

        // Return it!
        if ($newRow = $newResult->fetch_assoc()) {
            return $newRow['l_id'];
        } else {
            returnError(CODE_SERVER_ERROR, 'Could not insert the Location');
        }
    }
}
