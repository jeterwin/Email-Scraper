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

$sql = "SELECT COUNT(*) AS total_accounts FROM users";
$result = $conn->query($sql);
$row = $result->fetch_assoc();

header('Content-Type: application/json');
echo json_encode(['total_accounts' => (int)$row['total_accounts']]);
