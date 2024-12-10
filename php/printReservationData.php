<?php

if (!isset($_COOKIE["login"])) { //if logged in
    echo "Error: You are not logged in.";
}
else{

    include("dbconfig.php");

    $con = mysqli_connect($db_hostname,$db_username,$db_password,$db_dbname) or die("<br>Cannot connect to DB\n");

    $sql="SELECT * FROM 2024F_kaisemax.hotelReservationsData;";
    
    $result = mysqli_query($con, $sql);

    $num = mysqli_num_rows($result);
    
    
    $data = [];
    
    if ($num > 0) {
        if ($result) { // has result
            while ($row = mysqli_fetch_assoc($result)) {
                $data[] = [
                    'reservation_id' => $row['reservation_id'],
                    'guestName' => $row['guestName'],
                    'email' => $row['email'],
                    'phone' => $row['phone'],
                    'roomType' => $row['roomType'],
                    'roomNumber' => $row['roomNumber'],
                    'checkIn' => $row['checkIn'],
                    'checkOut' => $row['checkOut'],
                    'guests' => $row['guests'],
                    'status' => $row['status']
                ];
            }
        }

        echo json_encode($data, JSON_PRETTY_PRINT);

    }
    
    
    else{
        echo"Error: There are no reservations found";
    }




}

?>