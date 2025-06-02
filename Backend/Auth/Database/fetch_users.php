<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require_once '../auth.php';
require_once 'db.php';

if ($_SESSION['user_role'] !== 'admin') {
    echo "Access denied!";
    exit();
}

$sql = "SELECT id, username, email, role FROM users WHERE id != ?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $_SESSION['user_id']);
$stmt->execute();

$result = $stmt->get_result();

$users = [];

while ($row = $result->fetch_assoc()) {
    $users[] = $row;
}

$stmt->close();

header('Content-Type: application/json');
echo json_encode($users);
?>
