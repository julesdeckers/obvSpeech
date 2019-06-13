<?php

// $dbHost = "localhost";
// $dbName = "obv";
// $dbUser = "rita";
// $dbPass = "rita";

// $con = mysqli_connect('localhost', 'rita', 'rita');
// if (!$con) {
//     die('Could not connect: ' . mysqli_error($con));
// }

// if (!mysqli_select_db($con, 'obv')) {
//     echo 'Database Not Selected';
// }

// $story = $_POST['story'];
// $date = $_POST['date'];

$pdo;

function __construct()
{
    if (empty($sharedPDO)) {
        $sharedPDO = new PDO("mysql:host=localhost" . ";dbname=obv", "rita", "rita");
        $sharedPDO->exec("SET CHARACTER SET utf8");
        $sharedPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $sharedPDO->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
    }
    $this->pdo = &$sharedPDO;
}

$sql = "INSERT INTO `stories` (story, date) VALUES (`test`, `test`)";
$statement = $this->pdo->prepare($sql);
$statement->execute();
mysqli_close($con);
