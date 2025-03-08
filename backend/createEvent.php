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

//get connection to the database
$conn = getDbConnection();
if ($conn->connect_error) {
    returnError(CODE_SERVER_ERROR, 'Could not connect to the database');
}
//will need to add a check for time and location 
else{
    $stmt = $conn->prepare("INSERT INTO Events (e_id, contact_info, name, description,time, category, location) VALUES(UUID(),?,?,?,?,?,?)");
    $stmt->bind_param("ssssss", $contact, $name, $description, $time, $category, $location);
    // Execute the statement
    if ($stmt->execute() === false) {
        returnError(CODE_SERVER_ERROR, 'Execute failed: ' . $stmt->error);
    } else {
        // Commit the transaction
        $conn->commit();
        returnJson(['e_id' => $conn->insert_id, 'contact_info' => $contact, 'name' => $name, 'description' => $description, 'category' => $category, 'location' => $location]);
    }
    $stmt->close();
}
$conn->close();

?>