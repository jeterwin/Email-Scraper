<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'db.php';

$sortBy = $_GET['sortBy'] ?? 'meeting_time';

$sql = "SELECT * FROM scrape_results";
$result = $conn->query($sql);

$data = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $data[] = [
            'message_ID' => isset($row['message_ID']) ? $row['message_ID'] : null,
            'sender' => isset($row['sender']) ? $row['sender'] : 'N/A',
            'subject' => isset($row['subject']) ? $row['subject'] : 'No subject',
            'send_date' => isset($row['send_date']) ? $row['send_date'] : 'N/A',
            'meeting_title' => isset($row['meeting_title']) ? $row['meeting_title'] : 'No title',
            'meeting_location' => isset($row['meeting_location']) ? $row['meeting_location'] : 'No location',
            'meeting_time' => isset($row['meeting_time']) ? $row['meeting_time'] : 'N/A',
            'cc' => !empty($row['cc']) ? $row['cc'] : 'No CC',
            'bcc' => !empty($row['bcc']) ? $row['bcc'] : 'No BCC',
            'interested' => isset($row['interested']) ? $row['interested'] : false
        ];
    }
    header('Content-Type: application/json');
    echo json_encode($data);
} else {
    echo json_encode(['message' => 'No meetings found.']);
}

if ($sortBy === 'interested') {
    usort($meetings, function($a, $b) {
        return $b['interested'] <=> $a['interested'];
    });
} else {
    usort($meetings, function($a, $b) {
        return strcmp($a['meeting_time'], $b['meeting_time']);
    });
}

echo "<table>";
echo "<tr><th>Day</th><th>Meeting Time</th><th>Topic</th><th>Interested</th></tr>";
foreach ($meetings as $meeting) {
    $highlight = $meeting['interested'] > 0 ? 'class="highlight"' : '';
    echo "<tr $highlight>";
    echo "<td>{$meeting['meeting_day']}</td>";
    echo "<td>{$meeting['meeting_time']}</td>";
    echo "<td>{$meeting['subject']}</td>";
    echo "<td>{$meeting['interested']}</td>";
    echo "</tr>";
}
echo "</table>";
?>
