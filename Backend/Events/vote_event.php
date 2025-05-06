<?php
session_start();
include '../Auth/Database/db.php';

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo "Unauthorized";
    exit();
}

$user_id = $_SESSION['user_id'];
$event_id = $_POST['event_id'];
$interested = $_POST['interested'];

$stmt = $conn->prepare("SELECT meeting_day FROM scrape_results WHERE message_id = ?");
$stmt->bind_param("i", $event_id);
$stmt->execute();
$stmt->bind_result($event_day);
$stmt->fetch();
$stmt->close();

if (strtotime($event_day) < strtotime(date("Y-m-d"))) {
    echo "Evenimentul a avut deja loc!";
    exit();
}

$stmt = $conn->prepare("INSERT INTO event_votes(user_id, event_id, interested) VALUES (?, ?, ?)
                        ON DUPLICATE KEY UPDATE interested = ?");
$stmt->bind_param("iiii", $user_id, $event_id, $interested, $interested);
$stmt->execute();
$stmt->close();

echo "Registered vote.";
