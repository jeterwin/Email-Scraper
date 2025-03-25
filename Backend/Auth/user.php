<?php
require_once 'auth.php';
require_once './Database/db.php';
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>User Dashboard</title>
</head>
<body>

<h2>User Dashboard</h2>
<p>Welcome, <strong><?php echo $_SESSION['username']; ?></strong> (User)</p>

<a href="logout.php">Logout</a>
</body>
</html>
