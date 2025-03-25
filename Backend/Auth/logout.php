<?php
include_once 'auth.php';

if(session_status() === PHP_SESSION_ACTIVE) {
    $_SESSION = [];

    session_destroy();

    header('Location: ../Main/index.php');
    exit();
}
?>