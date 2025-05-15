<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'db.php';

$sortBy = isset($_GET['sortBy']) ? $_GET['sortBy'] : 'meeting_time';

$allowedSort = ['meeting_time', 'interested'];
if (!in_array($sortBy, $allowedSort)) {
    $sortBy = 'meeting_time';
}

$query = "SELECT * FROM scrape_results ORDER BY $sortBy DESC";
$result = $conn->query($query);

$data = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        // Provide default values if some fields are missing
        $data[] = [
            'message_ID' => isset($row['message_ID']) ? $row['message_ID'] : null,
            'sender' => isset($row['sender']) ? $row['sender'] : 'N/A', // You can change the default value as needed
            'subject' => isset($row['subject']) ? $row['subject'] : 'No subject',
            'send_date' => isset($row['send_date']) ? $row['send_date'] : 'N/A', // Change default as needed
            'meeting_title' => isset($row['meeting_title']) ? $row['meeting_title'] : 'No title',
            'meeting_location' => isset($row['meeting_location']) ? $row['meeting_location'] : 'No location',
            'meeting_time' => isset($row['meeting_time']) ? $row['meeting_time'] : 'N/A', // Change default as needed
            'meeting_date' => isset($row['meeting_date']) ? $row['meeting_date'] : 'N/A', // Change default as needed
            'cc' => !empty($row['cc']) ? $row['cc'] : 'No CC', // Change default as needed
            'interested' => isset($row['interested']) ? $row['interested'] : false // Default null if no value
        ];
    }
    header('Content-Type: application/json');
    echo json_encode($data);
} else {
    echo json_encode(['message' => 'No meetings found.']);
}

$conn->close();
?>
