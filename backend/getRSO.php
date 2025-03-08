<?php
require 'index.php';

//takes in a stu_id:string
$data = getRequestInfo();
$stu_id = $data['stu_id'];

$conn = getDbConnection();
if($conn->connect_error){
    returnError(CODE_SERVER_ERROR, 'Could not connect to the database');
}
else{
        $stmt = $conn->prepare("SELECT * FROM RSO WHERE admin_id = ?");
        $stmt->bind_param("s", $stu_id);
        $stmt->execute();
        $result = $stmt->get_result();
        $rsoResults = "";
        $rsoCount = 0;
        while($row = $result->fetch_assoc()){
            if($rsoCount > 0){
                $rsoResults .= ",";
            }
            $rsoCount++;
            $rsoResults .= '{"rso_id": "' . $row['rso_id'] . '", "name": "' . $row['name'] . '", "member_count": "' . $row['member_count'] . '"}';
        }
        if($rsoCount == 0){
            returnError(CODE_NOT_FOUND, 'No RSOs found');
        }
        else{
            returnJsonString($rsoResults);
        }
    }
?>