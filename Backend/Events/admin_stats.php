<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");


if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

session_start();
include '../Auth/Database/db.php';

if (!isset($_SESSION['user_role']) || $_SESSION['user_role'] !== 'admin') {
    http_response_code(403);
    echo "Acces interzis.";
    exit();
}

$sql = "
    SELECT
        E.message_ID,
        E.meeting_title,
        COUNT(V.user_ID) AS total_votes,
        SUM(IFNULL(V.interested, 0)) AS interested_votes
    FROM scrape_results E
    LEFT JOIN event_votes V ON E.message_ID = V.event_ID
    GROUP BY E.message_ID, E.meeting_title
    ORDER BY E.meeting_time DESC
";

$result = $conn->query($sql);
$stats = [];

while ($row = $result->fetch_assoc()) {
    $stats[] = $row;
}

header('Content-Type: application/json');
echo json_encode($stats);

?>