<?php

if (isset($_COOKIE["login"])) { //if logged in
    
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

    $sql = "SELECT * FROM 2024F_kaisemax.hotelUser ";
    $sql .= "WHERE username='$login' AND password='$password' AND email='$email' AND dateOfBirth='$dob'";
    

    $result = mysqli_query($con, $sql);

    $num = mysqli_num_rows($result);

    $result = mysqli_query($con, $sql);
    
 
    $id = '';

    if ($result) { //has result
        while ($row = mysqli_fetch_assoc($result)) {
            $id = $row['userID'];
        }
    }


    if ($num > 0){
        
        $sql = "DELETE FROM 2024F_kaisemax.hotelUser WHERE userID = $id";

        if (mysqli_query($con, $sql)) {
            include("logout.php");
            echo"<br>";
            echo "Account deleted successfully.";
        } else {
            echo "Error: " . mysqli_error($con);
        }

    }
    else{
        echo "Account deletion unsuccessful. <br> Details not found.\n";
    }



}
else{

    echo "Account deletion unsuccessful. <br> You must be logged in.";



}

?>