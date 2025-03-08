<?php
    require "index.php";
    //takes in stu_id:string, name:string, description:string, university:string
    $data = getRequestInfo();
    $stu_id = $data['stu_id'];
    $name = $data['name'];
    $description = $data['description'];
    $university = $data['university'];
    

    $conn = getDbConnection();
    if ($conn->connect_error) {
        returnError(CODE_SERVER_ERROR, 'Could not connect to the database');
    }
    //add a possible check for name so they do not have multiple rsos with the same name
    else{
        $stmt = $conn->prepare("INSERT INTO RSO(rso_id, admin_id, name, associated_university,status,description) VALUES(UUID(),?,?,?,'inactive',?)");
        $stmt->bind_param("ssss",$stu_id, $name,$university,$description);
        $stmt->execute();
        $stmt->close();

        //get 
        $result = $conn->query("SELECT rso_id FROM RSO WHERE admin_id = '$stu_id'");
        $row = $result->fetch_assoc();
        $rso_id = $row['rso_id'];

        $stmt = $conn->prepare("INSERT INTO RSO_Member(rso_id, stu_id) VALUES(?,?)");
        $stmt->bind_param("ss",$rso_id, $stu_id); 
        $stmt->execute();
        $stmt->close();
        returnJson(['rso_id' => $rso_id, 'admin_id' => $stu_id, 'name' => $name, 'university' => $university]);
    }

?>