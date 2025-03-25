<?php
require_once '../auth.php';
require_once 'db.php';

if ($_SESSION['user_role'] !== 'Admin') {
    echo "Access denied!";
    exit();
}

$sql = "SELECT id, username, email, role FROM users WHERE id != ?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $_SESSION['user_id']);
$stmt->execute();

$result = $stmt->get_result();

echo "<table>
        <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Action</th>
        </tr>";

while ($row = $result->fetch_assoc()) {
    echo "<tr>
            <td>" . htmlspecialchars($row['username']) . "</td>
            <td>" . htmlspecialchars($row['email']) . "</td>
            <td>" . htmlspecialchars($row['role']) . "</td>
            <td>
                <form action='delete_user.php' method='post' onsubmit='return confirm(\"Are you sure you want to delete this user?\");'>
                    <input type='hidden' name='user_id' value='" . $row['id'] . "'>
                    <button type='submit' style='background-color: red; color: white; border: none; padding: 5px;'>Delete</button>
                </form>
            </td>
          </tr>";
}

echo "</table>";

$stmt->close();
?>
