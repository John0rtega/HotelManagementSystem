<?php

if (isset($_COOKIE["login"])) { //if logged in
    echo "Register unsuccessful. <br> You are already logged in.";
}
else{

    include("dbconfig.php");

    $login="";
    $password ="";
    $email ="";
    $dob ="";


    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Get the form inputs
        $login = $_POST['username'] ?? '';
        $password = $_POST['password'] ?? '';
        $email = $_POST['email'] ?? '';
        $dob = $_POST['dob'] ?? '';
    }

    $con = mysqli_connect($db_hostname,$db_username,$db_password,$db_dbname) or die("<br>Cannot connect to DB\n");

    $sql="SELECT * FROM 2024F_kaisemax.hotelUser ";
    $sql=$sql . "WHERE username='$login'";

    $result = mysqli_query($con, $sql);

    $num = mysqli_num_rows($result);
    
    $name = '';

    if ($result) { //has result
        while ($row = mysqli_fetch_assoc($result)) {
            $name = $row['username'];
        }
    }


    if ($num > 0){
        echo "Username already exists, please choose another.<br>";
    }
    else{
        
        $sql = "INSERT INTO 2024F_kaisemax.hotelUser (username, password, email, dateOfBirth) VALUES ('$login', '$password', '$email', '$dob')";
        
        if (mysqli_query($con, $sql)) {
            echo "Registration successful.";
        } else {
            echo "Error: " . mysqli_error($con);
        }


    }
}

?>