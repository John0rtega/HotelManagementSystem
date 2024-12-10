<?php

    if (isset($_COOKIE["login"])) { //if logged in
        $login = $_COOKIE["login"];
        
        setcookie("login", "", time() - 3600);

        echo 'Logout successful.';
    }
    else { //if not logged in
        echo "Logout unsuccessful. <br> You are not logged in.";
    }

?>