<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
// $servername = "db";
// $username = "myuser";
// $password = "mypassword";
// $database = "mydatabase";

// Database properties - these may be best to get from
// a properties file or similar rather placing here.
define('DB_HOST', 'db');
define('DB_USER', 'myuser');
define('DB_PASS', 'mypassword');
define('DB_NAME', 'mydatabase');

// Common HTTP Response Codes - feel free to add more.
// If something goes wrong, please return an error code so 
// the frontend can decipher what went wrong and display it.
// https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
define('CODE_BAD_REQUEST', 400);
define('CODE_NOT_FOUND', 404);
define('CODE_CONFLICT', 409);
define('CODE_SERVER_ERROR', 500);

// Create MySQL connection
// $conn = new mysqli($servername, $username, $password, $database);

// // Check connection
// if ($conn->connect_error) {
//     die("Connection failed: " . $conn->connect_error);
// }
// echo "Connected successfully";

/* Get a MySQLi connection to our database. */
function getDbConnection() : mysqli {
  try {
  $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
  return $conn;
  } catch(mysqli_sql_exception $ex) {
    returnError(CODE_SERVER_ERROR, 'getDbConnection() failed ' . $ex->getMessage());
  }
}

/* Serialize $out_data as JSON and send it in the body of the response.
 * Calling this function will end the PHP script.
 */
function returnJson(array $out_data) {
  $out_string = json_encode($out_data);
  header('Content-Type: application/json');
  echo $out_string;
  exit();
}

/* Take in a string that represents an array of JSON objects
*  and send it in the body of the response.
*  Needed for when we build an "array" of JSON objects
*  that needs to be returned to the front end.
*  Calling this ends the PHP script.
*/ 
function returnJsonString(string $searchResults ){
  header('Content-Type: application/json');
  echo('{"Results":[' . $searchResults . '],"error":""}');
  exit();
}

/*
 * Sets the HTTP response code and sends a JSON object with
 * a single error value as the response. Exits the PHP script.
 */
function returnError(int $code, string $message) {
  http_response_code($code); 
  returnJson(['error' => $message]);
}

//Get JSON data from the request body
function getRequestInfo(){
		return json_decode(file_get_contents('php://input'), true);
}