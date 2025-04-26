<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <form action="../Auth/signup.php" method="post">
        <h3>Register</h3><br>
        <label>Username:</label><br>
        <input type="text" name="username"><br>

        <label>Password:</label><br>
        <input type="password" name="password"><br>

        <label>Email:</label><br>
        <input type="text" name="email"><br>

        <label>Choose a role for the user from this list:<br>
            <input list="browsers" name="role" /></label><br>
        <datalist id="browsers">
            <option value="User">
            <option value="Admin">
        </datalist>

        <input type="submit" value="Register">
    </form>
    <br>
    <br>
    <form action="../Auth/login.php" method="post">
        <h3>Login</h3>
        <label>Username:</label><br>
        <input type="text" name="username"><br>

        <label>Password:</label><br>
        <input type="password" name="password">

        <input type="submit" value="Log in"><br>
    </form>
</body>

</html>