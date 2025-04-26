<?php
session_start();
include '../Auth/Database/db.php';

$today = date("Y-m-d");

// GOTTA CHANGE MEETING_DAY LATER
$stmt = $conn->prepare("SELECT * FROM scrape_results WHERE meeting_day >= ? ORDER BY meeting_day ASC");
$stmt->bind_param("s", $today);
$stmt->execute();
$result = $stmt->get_result();

$events = [];
while ($row = $result->fetch_assoc()) {
    $events[] = $row;
}

header('Content-Type: application/json');
echo json_encode($events);
