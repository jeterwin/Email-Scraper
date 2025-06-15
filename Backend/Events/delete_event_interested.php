<?php
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

$checkStmt = $conn->prepare("SELECT 1 FROM scrape_results WHERE message_ID = ?");
$checkStmt->bind_param("s", $event_id);
$checkStmt->execute();
$checkStmt->store_result();

if ($checkStmt->num_rows === 0) {
    $checkStmt->close();
    echo "Event not found.";
    exit();
}
$checkStmt->close();

$deleteStmt = $conn->prepare("DELETE FROM event_votes WHERE event_ID = ?");
$deleteStmt->bind_param("s", $event_id);

if ($deleteStmt->execute()) {
    echo "Votes for the event deleted successfully.";
} else {
    echo "Failed to delete votes.";
}
$deleteStmt->close();
?>
