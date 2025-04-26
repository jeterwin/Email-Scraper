<?php
session_start();
if (!isset($_SESSION['user_id']) || $_SESSION['user_id'] === "") {
    # fix this to work from any place, apparently it's just relative
    header("Location: /Backend/Auth/logout.php");
}
