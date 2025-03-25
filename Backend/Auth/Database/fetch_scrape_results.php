<?php
require_once 'db.php';

$sortBy = isset($_GET['sortBy']) ? $_GET['sortBy'] : 'meeting_time';

$allowedSort = ['meeting_time', 'interested'];
if (!in_array($sortBy, $allowedSort)) {
    $sortBy = 'meeting_time';
}

$query = "SELECT * FROM scrape_results ORDER BY $sortBy DESC";
$result = $conn->query($query);

if ($result->num_rows > 0) {
    echo "<table>
            <tr>
                <th>Message ID</th>
                <th>Sender</th>
                <th>Subject</th>
                <th>Send Date</th>
                <th>Meeting Title</th>
                <th>Location</th>
                <th>Time</th>
                <th>Day</th>
                <th>CC</th>
                <th>Interested</th>
            </tr>";

    while ($row = $result->fetch_assoc()) {
        $interestedClass = $row['interested'] ? "highlight" : "";
        echo "<tr class='$interestedClass'>
                <td>{$row['message_id']}</td>
                <td>{$row['sender']}</td>
                <td>{$row['subject']}</td>
                <td>{$row['send_date']}</td>
                <td>{$row['meeting_title']}</td>
                <td>{$row['meeting_location']}</td>
                <td>{$row['meeting_time']}</td>
                <td>{$row['meeting_day']}</td>
                <td>{$row['cc']}</td>
                <td>" . ($row['interested'] ? "✔ Yes" : "✖ No") . "</td>
            </tr>";
    }
    echo "</table>";
} else {
    echo "<p>No meetings found.</p>";
}

$conn->close();
?>
