<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

session_start();
include '../Auth/Database/db.php';

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo "Unauthorized";
    exit();
}

if (!isset($_POST['event_id'])) {
    http_response_code(400);
    echo "Missing event ID";
    exit();
}

$event_id = $_POST['event_id'];

$stmt = $conn->prepare("SELECT meeting_time FROM scrape_results WHERE message_id = ?");
$stmt->bind_param("s", $event_id);
$stmt->execute();
$stmt->bind_result($meeting_time);

if (!$stmt->fetch()) {
    $stmt->close();
    echo "Event not found.";
    exit();
}
$stmt->close();

// Delete the event
$stmt = $conn->prepare("DELETE FROM scrape_results WHERE message_id = ?");
$stmt->bind_param("s", $event_id);

if ($stmt->execute()) {
    echo "Event deleted successfully.";
} else {
    echo "Failed to delete event.";
}
$stmt->close();
?>
