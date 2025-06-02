<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require_once 'auth.php';
require_once './Database/db.php';

if(isset($_POST['user_id'])) {
    $user_id = $_POST['user_id'];

    $stmt = $conn->prepare('SELECT * FROM Users WHERE ID = ?');
    $stmt->bind_param('i', $user_id);
    $stmt->execute();
    $stmt->store_result();

    if($stmt->num_rows > 0) {
        if($user_id == $_SESSION['user_id']) {
            echo 'You cannot delete yourself';
            exit();
        }

        $stmt = $conn->prepare('DELETE FROM Users WHERE ID = ?');
        $stmt->bind_param('i', $user_id);

        if($stmt->execute()) {
            echo 'User deleted successfully';
        } else {
            echo 'Could not delete user';
        }
    } else {
        echo "Could not find user with that ID.";
    }
    
    $stmt->close();
} else {
    echo 'Something went wrong.';
}
?>