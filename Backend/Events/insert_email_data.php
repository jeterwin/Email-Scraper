<?php
require_once '../Auth/auth.php';
require_once '../Auth/Database/db.php';

$requiredFields = ['message_id', 'sender', 'subject', 'send_date', 'meeting_title', 'meeting_location', 'meeting_date', 'meeting_time'];
foreach ($requiredFields as $field) {
    if (!isset($_POST[$field])) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => "Missing required field: $field"]);
        exit;
    }
}

$message_id       = $_POST['message_id'];
$sender           = $_POST['sender'];
$subject          = $_POST['subject'];
$send_date        = $_POST['send_date']; // Expected: YYYY-MM-DD
$meeting_title    = $_POST['meeting_title'];
$meeting_location = $_POST['meeting_location'];
$meeting_date     = $_POST['meeting_date'];
$meeting_time     = $_POST['meeting_time'];

$cc  = isset($_POST['cc']) ? $_POST['cc'] : null;
$bcc = isset($_POST['bcc']) ? $_POST['bcc'] : null;

if (!DateTime::createFromFormat('Y-m-d', $send_date)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Invalid date format for send_date. Expected YYYY-MM-DD.']);
    exit;
}

$datetime_string = $meeting_date . ' ' . $meeting_time;
$meeting_datetime = DateTime::createFromFormat('Y-m-d H:i', $datetime_string);

if (!$meeting_datetime) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Invalid date/time combination for meeting_datetime. Expected format: YYYY-MM-DD HH:MM']);
    exit;
}

$meeting_datetime_formatted = $meeting_datetime->format('Y-m-d H:i:s');

$stmt = $conn->prepare("INSERT INTO scrape_results (message_id, sender, subject, send_date, meeting_title, meeting_location, meeting_time, cc, bcc)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
if (!$stmt) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Failed to prepare statement.']);
    exit;
}

$stmt->bind_param("sssssssss", $message_id, $sender, $subject, $send_date, $meeting_title, $meeting_location, $meeting_datetime_formatted, $cc, $bcc);

if ($stmt->execute()) {
    echo json_encode(['status' => 'success', 'message' => 'Record inserted successfully.']);
} else {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Failed to insert record: ' . $stmt->error]);
}

$stmt->close();
?>
