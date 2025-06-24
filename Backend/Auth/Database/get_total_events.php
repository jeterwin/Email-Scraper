<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");


if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

session_start();
include 'db.php';

if (!isset($_SESSION['user_role']) || $_SESSION['user_role'] !== 'admin') {
    http_response_code(403);
    echo "Acces interzis.";
    exit();
}

$sql = "SELECT COUNT(*) AS event_count FROM scrape_results WHERE meeting_time > NOW()";
$result = $conn->query($sql);
$row = $result->fetch_assoc();

header('Content-Type: application/json');
echo json_encode(['event_count' => (int)$row['event_count']]);
