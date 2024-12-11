<?php
// updateReservation.php
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
    $guestName = $_POST['guest_name'];
    $email = $_POST['email'];
    $phone = $_POST['phone'];
    $roomType = $_POST['room_type'];
    $roomNumber = $_POST['room_number'];
    $guests = $_POST['guests'];
    $checkIn = $_POST['check_in'];
    $checkOut = $_POST['check_out'];

    // Prepare and execute the update statement
    $stmt = $conn->prepare("UPDATE reservations SET guestName = ?, email = ?, phone = ?, roomType = ?, roomNumber = ?, guests = ?, checkIn = ?, checkOut = ? WHERE reservation_id = ?");
    $stmt->bind_param("ssssiissi", $guestName, $email, $phone, $roomType, $roomNumber, $guests, $checkIn, $checkOut, $reservationId);

    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'error' => $stmt->error]);
    }

    $stmt->close();
}
$conn->close();
?>