<?php
require_once 'auth.php';
require_once './Database/db.php';

// Check if the user is logged in and is an admin
if (!isset($_SESSION['user_id']) || $_SESSION['user_role'] !== 'admin') {
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
            border: 1px solid black;
            padding: 10px;
            text-align: left;
        }
        th {
            background-color: #ddd;
            cursor: pointer;
        }
        .highlight {
            background-color: #d1ffd1;
            font-weight: bold;
        }
    </style>
</head>
<body>

<h2>Admin Dashboard</h2>
<p>Welcome, <strong><?php echo $_SESSION['username']; ?></strong> (Admin)</p>

<button onclick="fetchUsers()">Show Users</button>
<a href="logout.php">Logout</a>

<div id="usersTable"></div>

<button onclick="fetchData()">Show Meetings</button>

<label>Sort by:</label>
<select id="sortBy">
    <option value="meeting_time">Meeting Time</option>
    <option value="interested">Interested</option>
</select>

<div id="data-container"></div>

<script>
function fetchUsers() {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "./Database/fetch_users.php", true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                document.getElementById("usersTable").innerHTML = xhr.responseText;
            }
        };
        xhr.send();
    }

    function fetchData() {
        let sortBy = document.getElementById("sortBy").value;
        
        let xhr = new XMLHttpRequest();
        xhr.open("GET", "./Database/fetch_scrape_results.php?sortBy=" + sortBy, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                document.getElementById("data-container").innerHTML = xhr.responseText;
            }
        };
        xhr.send();
    }
</script>

</body>
</html>
