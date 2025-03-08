<?php
include 'index.php';
//get data
$data = getRequestInfo();

$contact = $data['contact_info'];
$name = $data['name'];
$description = $data['description'];
$category = $data['category'];
$location = $data['location'];
$time = $data['time'];
$visibility = $data['visibility'];
$university = $data['u_id'];

//get connection to the database
$conn = getDbConnection();
if ($conn->connect_error) {
    returnError(CODE_SERVER_ERROR, 'Could not connect to the database');
}
//will need to add a check for time and location 
else {
    $stmt = $conn->prepare("INSERT INTO Events (e_id, u_id, contact_info, name, description, time, category, location) VALUES(UUID(),?,?,?,?,?,?,?,?)");
    $stmt->bind_param("ssssss", $university, $contact, $name, $description, $time, $category, $location);
    // Execute the statement
    if ($stmt->execute() === false) {
        returnError(CODE_SERVER_ERROR, 'Execute failed: ' . $stmt->error);
    } else {
        // Get the events 'e_id'
        $newStmt = $conn->prepare("SELECT e_id FROM Events WHERE u_id = ? AND time = ? AND location = ?");
        $newStmt->bind_param("sss", $university, $time, $location);
        $newStmt->execute();
        $newResult = $newStmt->get_result();
        $newRow = $newResult->fetch_assoc();

        // TODO: Determine efficient way to store the events (ie. where to store public, private, RSO) to make retrieval easy
        // Return the result
        returnJson(['e_id' => $newRow['e_id'], 'contact_info' => $contact, 'name' => $name, 'description' => $description, 'category' => $category, 'location' => $location, 'time' => $time, 'visibility' => $visibility]);
    }
}
$stmt->close();
$conn->close();
