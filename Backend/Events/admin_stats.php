<?php
session_start();
include '../Auth/Database/db.php';

if (!isset($_SESSION['user_role']) || $_SESSION['user_role'] !== 'Admin') {
    http_response_code(403);
    echo "Acces interzis.";
    exit();
}

$sql = "
    SELECT 
        E.message_id,
        E.meeting_title,
        COUNT(V.id) AS total_votes,
        SUM(V.interested) AS interested_votes
    FROM scrape_results E
    LEFT JOIN event_votes V ON E.message_id = V.event_id
    GROUP BY E.message_id, E.meeting_title
    ORDER BY E.meeting_day DESC
";

$result = $conn->query($sql);
$stats = [];

while ($row = $result->fetch_assoc()) {
    $stats[] = $row;
}

header('Content-Type: application/json');
echo json_encode($stats);
