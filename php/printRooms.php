<?php

if (!isset($_COOKIE["login"])) { //if logged in
    echo "Error: You are not logged in.";
}
else{

    include("dbconfig.php");

    $con = mysqli_connect($db_hostname,$db_username,$db_password,$db_dbname) or die("<br>Cannot connect to DB\n");

    $sql="SELECT * FROM 2024F_kaisemax.hotelRoom;";
    
    $result = mysqli_query($con, $sql);

    $num = mysqli_num_rows($result);
    
    
    $data = [];
    
    if ($num > 0) {
        if ($result) { // has result
            while ($row = mysqli_fetch_assoc($result)) {
                $data[] = [
                    'roomid' => $row['roomid'],
                    'floor' => $row['floor'],
                    'assigned' => $row['assigned'],
                    'status' => $row['status'],
                    'type' => $row['type']
                ];
            }
        }

        echo json_encode($data, JSON_PRETTY_PRINT);

    }
    
    
    else{
        echo"Error: There are no rooms found";
    }




}

?>