<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

session_start();
include '../Auth/Database/db.php';

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit();
}

$user_id = $_SESSION['user_id'];

// $stmt = $conn->prepare("SELECT event_ID, interested FROM event_votes WHERE user_ID = ?");
$stmt = $conn->prepare("
    SELECT sr.message_ID, sr.meeting_title, sr.sender, sr.send_date, sr.meeting_location, sr.meeting_time, sr.cc, sr.bcc
    FROM event_votes ev
    JOIN scrape_results sr ON ev.event_ID = sr.message_ID
    WHERE ev.user_ID = ? AND ev.interested = 1
    ORDER BY sr.meeting_time ASC
");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

$votes = [];
// while ($row = $result->fetch_assoc()) {
//     $votes[$row['event_ID']] = (bool)$row['interested'];
// }
while ($row = $result->fetch_assoc()) {
    $votes[] = $row;
}
$stmt->close();

echo json_encode($votes);
