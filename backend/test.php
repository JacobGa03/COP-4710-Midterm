<?php
require 'index.php'; // Need this so we have base functionalities to make API calls

try{
    // Get the time in EST
    date_default_timezone_set('America/New_York'); // Set the timezone to EST
    $current_time = new DateTimeImmutable(); // Get the current time
    $current_time_string = $current_time->format(DateTimeInterface::ATOM); // Format the time
    // Format a response in JSON
    $response = [
        'current_time' => "The current time in EST is $current_time_string"
    ];
    returnJson($response);
}catch(mysqli_sql_exception $ex){
    // Some server error
    returnError(CODE_SERVER_ERROR, $ex->getMessage());
}?>