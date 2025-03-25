<?php
require_once 'auth.php';
require_once './Database/db.php';

// Check if the user is logged in and is an admin
if (!isset($_SESSION['user_id']) || $_SESSION['user_role'] !== 'Admin') {
    echo "Access denied!";
    exit();
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard</title>
    <style>
        button {
            padding: 10px;
            background-color: blue;
            color: white;
            border: none;
            cursor: pointer;
        }
        button:hover {
            background-color: darkblue;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        th, td {
            padding: 8px;
            text-align: left;
            border: 1px solid #ddd;
        }
        th {
            background-color: #f2f2f2;
        }
    </style>
</head>
<body>

<h2>Admin Dashboard</h2>
<p>Welcome, <strong><?php echo $_SESSION['username']; ?></strong> (Admin)</p>

<button onclick="fetchUsers()">Show Users</button>
<a href="logout.php">Logout</a>

<div id="usersTable"></div>

<script>
function fetchUsers() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "Database/fetch_users.php", true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            document.getElementById("usersTable").innerHTML = xhr.responseText;
        }
    };
    xhr.send();
}
</script>

</body>
</html>
