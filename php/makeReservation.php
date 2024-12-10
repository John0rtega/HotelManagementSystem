<?php

if (!isset($_COOKIE["login"])) { //if logged in
    echo "Error: You are not logged in.";
}
else{

    include("dbconfig.php");

    $guestName = "";
    $email = "";
    $phone = "";
    $roomType = "";
    $roomNumber = "";
    $checkIn = "";
    $checkOut = "";
    $guests = "";
    $status = "";


    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Get the form inputs
        $guestName =  $_POST['guestName'] ?? '';
        $email =  $_POST['email'] ?? '';
        $phone =  $_POST['phone'] ?? '';
        $roomType =  $_POST['roomType'] ?? '';
        $roomNumber =  $_POST['roomNumber'] ?? '';
        $checkIn =  $_POST['checkIn'] ?? '';
        $checkOut =  $_POST['checkOut'] ?? '';
        $guests =  $_POST['guests'] ?? '';
        $status =  $_POST['status'] ?? '';

    }


    // if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    //     // Get the form inputs
    //     $guestName =  $_GET['guestName'] ?? '';
    //     $email =  $_GET['email'] ?? '';
    //     $phone =  $_GET['phone'] ?? '';
    //     $roomType =  $_GET['roomType'] ?? '';
    //     $roomNumber =  $_GET['roomNumber'] ?? '';
    //     $checkIn =  $_GET['checkIn'] ?? '';
    //     $checkOut =  $_GET['checkOut'] ?? '';
    //     $guests =  $_GET['guests'] ?? '';
    //     $status =  $_GET['status'] ?? '';

    // }


    $con = mysqli_connect($db_hostname,$db_username,$db_password,$db_dbname) or die("<br>Cannot connect to DB\n");

    $sql = "INSERT INTO 2024F_kaisemax.hotelReservationsData (guestName, email, phone, roomType, roomNumber, checkIn, checkOut, guests, status) VALUES ('$guestName', '$email', '$phone', '$roomType', '$roomNumber', '$checkIn', '$checkOut', '$guests', '$status')";

    // Execute the query
    if (mysqli_query($con, $sql)) {
        echo "Reservation successfully inserted.";
    } else {
        echo "Error: submission unsuccessful";
    }


}
    

?>