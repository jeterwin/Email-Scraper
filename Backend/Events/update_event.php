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
$new_date = isset($_POST['meeting_time']) ? $_POST['meeting_time'] : null;
$new_location = isset($_POST['meeting_location']) ? $_POST['meeting_location'] : null;

if (is_null($new_date) && is_null($new_location)) {
    http_response_code(400);
    echo "No update parameters provided.";
    exit();
}

// Firstly, check if the event exists
$stmt = $conn->prepare("SELECT 1 FROM scrape_results WHERE message_id = ?");
$stmt->bind_param("s", $event_id);
$stmt->execute();
$result = $stmt->get_result();
if ($result->num_rows === 0) {
    $stmt->close();
    echo "Event not found.";
    exit();
}
$stmt->close();

$fields = [];
$params = [];
$types = "";

if (!is_null($new_date)) {
    $fields[] = "meeting_time = ?";
    $params[] = $new_date;
    $types .= "s";
}
if (!is_null($new_location)) {
    $fields[] = "meeting_location = ?";
    $params[] = $new_location;
    $types .= "s";
}

$params[] = $event_id;
$types .= "s";

$sql = "UPDATE scrape_results SET " . implode(", ", $fields) . " WHERE message_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param($types, ...$params);

if ($stmt->execute()) {
    echo "Event updated successfully.";
} else {
    echo "Failed to update event.";
}

$stmt->close();
?>
