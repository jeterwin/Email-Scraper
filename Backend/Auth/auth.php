<?php
session_start();
$currentScript = basename($_SERVER['PHP_SELF']);
if ($currentScript !== 'logout.php') {
    if (!isset($_SESSION['user_id']) || $_SESSION['user_id'] === "") {
        header("Location: /Backend/Auth/logout.php");
        exit();
    }
}
