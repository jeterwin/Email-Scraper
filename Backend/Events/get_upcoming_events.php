<?php
session_start();
include '../Auth/Database/db.php';

$stmt = $conn->prepare("SELECT * FROM scrape_results ORDER BY meeting_time ASC");

if (!$stmt) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Failed to prepare statement.']);
    exit;
}

$stmt->execute();
$result = $stmt->get_result();

$events = [];
while ($row = $result->fetch_assoc()) {
    $events[] = $row;
}

header('Content-Type: application/json');
echo json_encode($events);
