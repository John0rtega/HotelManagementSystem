<?php

if (isset($_COOKIE["login"])) { //if logged in
    echo "Login unsuccessful. <br> You are already logged in.";
} else {

    include("dbconfig.php");

    $login = "";
    $password = "";

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Get the form inputs
        $login = $_POST['username'] ?? '';
        $password = $_POST['password'] ?? '';
    }


    // if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    //     // Get the form inputs
    //     $login = $_GET['username'] ?? '';
    //     $password = $_GET['password'] ?? '';
    // }


    $con = mysqli_connect($servername, $username, $password, $dbname) or die("<br>Cannot connect to DB\n");

    $sql = "SELECT * FROM 2024F_kaisemax.hotelUser ";
    $sql = $sql . "WHERE username='$login' AND password='$password'";

    $result = mysqli_query($con, $sql);

    $num = mysqli_num_rows($result);

    $name = '';

    if ($result) { //has result
        while ($row = mysqli_fetch_assoc($result)) {
            $name = $row['username'];
        }
    }


    if ($num > 0) {
        //setcookie("login", $login . " " . time() + 3600);
        $value = $login . " " . $name . " " . (time() + 3600);
        setcookie("login", $value, time() + 3600);

        echo "Login successful.<br>";
        echo "Welcome, " . $name;
    } else {
        echo "Login failed. Username or password is incorrect.\n";
    }
}

?>