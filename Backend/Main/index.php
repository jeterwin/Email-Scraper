<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <form action="/Auth/signup.php" method="post">
        <label>Username:</label><br>
        <input type="text" name="username">

        <label>Password:</label>
        <input type="password" name="password">

        <label>Email:</label>
        <input type="text" name="email">

        <label>Choose a role for the user from this list:
            <input list="browsers" name="role" /></label>
        <datalist id="browsers">
            <option value="User">
            <option value="Admin">
        </datalist>

        <input type="submit" value="Register">
    </form>
    <br>
    <br>
    <form action="/Auth/login.php" method="post">
        <label>Username:</label><br>
        <input type="text" name="username">

        <label>Password:</label>
        <input type="password" name="password">

        <input type="submit" value="Log in">
    </form>
</body>

</html>