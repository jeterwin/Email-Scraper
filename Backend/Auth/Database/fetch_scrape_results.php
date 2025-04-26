<?php
require_once 'db.php';

$sortBy = $_GET['sortBy'] ?? 'meeting_time';

$sql = "SELECT * FROM scrape_results";
$result = $conn->query($sql);

$meetings = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $meetings[] = $row;
    }
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
