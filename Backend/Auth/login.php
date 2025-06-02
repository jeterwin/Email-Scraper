<?php

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");

session_start();
include 'Database/db.php';

function login_user($conn, $username, $password)
{
    # Check if username, password, email, role are set
    $stmt = $conn->prepare("SELECT ID, username, password, role FROM Users WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $stmt->store_result();
    # Check if username in database
    if ($stmt->num_rows > 0) {
        $userId = "";
        $hashedPassword = "";
        $userRole = "";

        $stmt->bind_result($userId, $username, $hashedPassword, $userRole);
        $stmt->fetch();

        if (password_verify($password, $hashedPassword)) {
            $_SESSION['user_id'] = $userId;
            $_SESSION['username'] = $username;
            $_SESSION['user_role'] = $userRole;

            return "Success:$userRole";
        } else {
            return "The password you provided is not correct";
        }
    } else {
        return "No user found with that username";
    }
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    # isset verifies empty string as well, so check if the string is actually empty.
    if (!empty($_POST["username"]) && !empty($_POST["password"])) {
        $username = $_POST["username"];
        $password = $_POST["password"];

        $message = login_user($conn, $username, $password);
        echo $message;
    } else {
        echo "Username or password not filled.";
    }
}
