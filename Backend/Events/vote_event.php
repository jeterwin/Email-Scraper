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

$user_id = $_SESSION['user_id'];
$event_id = $_POST['event_id'];
$interested = filter_var($_POST['interested'], FILTER_VALIDATE_BOOLEAN) ? 1 : 0;

echo "user_id: $user_id, event_id: $event_id, interested: $interested \n";



$stmt = $conn->prepare("SELECT meeting_time FROM scrape_results WHERE message_ID = ?");
$stmt->bind_param("s", $event_id);
$stmt->execute();
$stmt->bind_result($event_day);
$stmt->fetch();
$stmt->close();

if (strtotime($event_day) < strtotime(date("Y-m-d"))) {
    echo strtotime($event_day) . ', ' . strtotime(date("Y-m-d"));
    echo "Evenimentul a avut deja loc!";
    exit();
}

$stmt = $conn->prepare("INSERT INTO event_votes(user_ID, event_ID, interested) VALUES (?, ?, ?)
                            ON DUPLICATE KEY UPDATE interested = VALUES(interested)");
$stmt->bind_param("isi", $user_id, $event_id, $interested);
$stmt->execute();
$stmt->close();

echo "Registered vote.";
