<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

session_start();
include './Database/db.php';

function promote_to_admin($conn, $targetUserId) {
    // Check if current user is logged in and is an admin
    if (!isset($_SESSION['user_id']) || $_SESSION['user_role'] !== 'admin') {
        http_response_code(403);
        echo "Access denied. Only admins can perform this action.";
        exit();
    }

    // Prevent promoting self (optional)
    if ($_SESSION['user_id'] == $targetUserId) {
        echo "You cannot promote yourself.";
        exit();
    }

    $stmt = $conn->prepare("UPDATE Users SET role = 'admin' WHERE ID = ?");
    $stmt->bind_param("i", $targetUserId);

    if ($stmt->execute()) {
        echo "User successfully promoted to admin.";
    } else {
        echo "Error promoting user: " . $stmt->error;
    }

    $stmt->close();
}

if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST['user_id'])) {
    $userId = intval($_POST['user_id']);
    promote_to_admin($conn, $userId);
} else {
    echo "Invalid request.";
}
