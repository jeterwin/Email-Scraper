<?php

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");

include 'Database/db.php';

function register_user($conn, $username, $password, $email, $role)
{
    # Error checking here, duplicate email, username
    # Uncaught mysqli_sql_exception: Duplicate entry 'Kirichner Erwin' for key 'Username'
    # Uncaught mysqli_sql_exception: Duplicate entry 'test@gmail.com' for key 'Email'
    # Verify if the email is in correct format
    if(!preg_match('/^[^@\s]+@[^@\s]+\.[^@\s]+$/', $email)) {
        echo "Invalid email address!";
        return false;
    }

    $username_length = strlen($username);
    # Username length must be between [7, 20]
    if ($username_length > 20 || $username_length < 6) {
        echo "Your username must be between 6 and 20 characters long. ";
        return false;
        # Email length < 40
    } else if (strlen($email) > 40) {
        echo "Your email must not exceed 40 characters. ";
        return false;
    }

    $stmt = $conn->prepare("SELECT username, email FROM users WHERE username = ? OR email = ?");
    $stmt->bind_param("ss", $username, $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            if($row["username"] === $username) {
                echo "Username already taken! ";
                return false;
            }
            if($row["email"] === $email) {
                echo "Email already taken! ";
                return false;
            }
        }
    }

    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

    $stmt = $conn->prepare("INSERT INTO users(username, password, email, role) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssss", $username, $hashedPassword, $email, $role);

    $success = $stmt->execute();


    if ($success) {
        echo "User registered successfully!\n";
    } else {
        echo "Something failed\n";
    }

    $stmt->close();
    return $success;
}


if ($_SERVER["REQUEST_METHOD"] === "POST") {
    if ($_POST["username"] != "" && $_POST["password"] != "" && $_POST["email"] != "") {
        $username = $_POST["username"];
        $password = $_POST["password"];
        $email = $_POST["email"];

        if (register_user($conn, $username, $password, $email, 'user')) {
            echo "Registered new user\n";
        } else {
            echo "Could not register user\n";
        }
    } else {
        echo "Username, password or email fields not filled.\n";
    }
}
