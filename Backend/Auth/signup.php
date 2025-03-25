<?php
include './Database/db.php';

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
    # Username length < 20
    if (strlen($username) > 20) {
        echo "Your username must not not exceed 20 characters.";
        return false;
        # Email length < 40
    } else if (strlen($email) > 40) {
        echo "Your email must not exceed 40 characters.";
        return false;
    }

    # TODO Check if the username / email have entries already

    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

    $stmt = $conn->prepare("INSERT INTO Users(username, password, email, role) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssss", $username, $hashedPassword, $email, $role);

    $success = $stmt->execute();

    if ($success) {
        echo "User registered successfully!";
    } else {
        echo "Something failed";
    }

    $stmt->close();
    return $success;
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    if ($_POST["username"] != "" && $_POST["password"] != "" && $_POST["email"] != "" && $_POST["role"] != "") {
        $username = $_POST["username"];
        $password = $_POST["password"];
        $email = $_POST["email"];
        $role = $_POST["role"];

        if (register_user($conn, $username, $password, $email, $role)) {
            echo "Registered new user";
        } else {
            echo "Could not register user";
        }
    } else {
        echo "Username, password or email fields not filled.";
    }
}
