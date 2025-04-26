<?php
session_start();
include './Database/db.php';

function login_user($conn, $username, $password)
{
    # Check if username, password, email are set
    $stmt = $conn->prepare("SELECT ID, username, password, role FROM Users WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $stmt->store_result();
    # Check if username in database
    if ($stmt->num_rows > 0) {
        $userId = "";
        $hashedPassword = "";
        $role = "";

        $stmt->bind_result($userId, $username, $hashedPassword, $role);
        $stmt->fetch();

        if (password_verify($password, $hashedPassword)) {
            $_SESSION['user_id'] = $userId;
            $_SESSION['username'] = $username;
            $_SESSION['user_role'] = $role;

            echo "Succesfully logged in!";

            # If the signed in person's role is admin, go to admin dashboard, otherwise go to user dashboard
            header($_SESSION['user_role'] === "Admin" ? "Location: admin.php" : "Location: user.php");
            exit();
        } else {
            echo "The password you provided is not correct";
        }
    } else {
        echo "No user found with that username";
    }
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    # isset verifies empty string as well, so check if the string is actually empty.
    if ($_POST["username"] != "" && $_POST["password"] != "") {
        $username = $_POST["username"];
        $password = $_POST["password"];

        if (login_user($conn, $username, $password)) {
            echo "Successfully logged in!";
        }
    } else {
        echo "Username or password not filled.";
    }
}
