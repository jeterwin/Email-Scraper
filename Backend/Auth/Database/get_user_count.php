<?php
session_start();
include '../Auth/Database/db.php';

if (!isset($_SESSION['user_role']) || $_SESSION['user_role'] !== 'admin') {
    http_response_code(403);
    echo "Acces interzis.";
    exit();
}

$sql = "SELECT COUNT(*) AS user_count FROM users WHERE role = 'user'";
$result = $conn->query($sql);
$row = $result->fetch_assoc();

header('Content-Type: application/json');
echo json_encode(['user_count' => (int)$row['user_count']]);
