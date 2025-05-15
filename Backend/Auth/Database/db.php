<?php
// require_once __DIR__ . '/../../vendor/autoload.php';
// $dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../../');
// $dotenv->load();

// $host = $_ENV['DB_HOST'];
// $username = $_ENV['DB_USER'];
// $db_pass = $_ENV['DB_PASSWORD'];
// $db_name = $_ENV['DB_NAME'];
// $conn = "";

$host = "localhost";
$username = "root";
$db_pass = "";
$db_name = "email_scraper";
$conn = "";

try {
    $conn = mysqli_connect($host, $username, $db_pass, $db_name);
} catch (mysqli_sql_exception) {
    # Just for testing now
    # echo "Could not connect to database.";
}

if ($conn) {
    # Just for testing as well
    # echo "Connected to database";
}
