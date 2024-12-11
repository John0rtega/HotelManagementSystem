<?php
// deleteReservation.php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header('Content-Type: application/json');
include 'dbconfig.php'; // Include your database connection

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $reservationId = $_POST['reservation_id'];

    // Prepare and execute the delete statement
    $stmt = $conn->prepare("DELETE FROM 2024F_kaisemax.hotelReservationsData WHERE reservation_id = ?");
    $stmt->bind_param("i", $reservationId);

    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'error' => $stmt->error]);
    }

    $stmt->close();
}
$conn->close();
?>