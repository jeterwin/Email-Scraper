<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once 'db.php';

$sortBy = $_GET['sortBy'] ?? 'meeting_time';
$limit = isset($_GET['limit']) ? (int) $_GET['limit'] : null;

$allowedSortFields = ['meeting_time', 'interested', 'send_date'];
if (!in_array($sortBy, $allowedSortFields)) {
    $sortBy = 'meeting_time';
}

$sql = "SELECT * FROM scrape_results ORDER BY $sortBy ASC";
if ($limit) {
    $sql .= " LIMIT " . $limit;
}

$result = $conn->query($sql);
$meetings = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $meetings[] = [
            'message_ID' => isset($row['message_ID']) ? $row['message_ID'] : null,
            'sender' => isset($row['sender']) ? $row['sender'] : 'N/A',
            'subject' => isset($row['subject']) ? $row['subject'] : 'No subject',
            'send_date' => isset($row['send_date']) ? $row['send_date'] : 'N/A',
            'meeting_title' => isset($row['meeting_title']) ? $row['meeting_title'] : 'No title',
            'meeting_location' => isset($row['meeting_location']) ? $row['meeting_location'] : 'No location',
            'meeting_time' => isset($row['meeting_time']) ? $row['meeting_time'] : 'N/A',
            'cc' => !empty($row['cc']) ? $row['cc'] : '-',
            'bcc' => !empty($row['bcc']) ? $row['bcc'] : '-',
        ];
    }

        echo json_encode($meetings);
    } else {
        echo json_encode(['message' => 'No meetings found.']);
    }
?>
