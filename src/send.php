<?php

$content = trim(file_get_contents("php://input"));
$data = json_decode($content, true);

// echo 'bericht goed ontvangen';

$story = $data['message'];
$date = date("Y-m-d h:i:s");

echo $story;
echo $date;

require_once __DIR__ . '/php/dao.php';

$dao = new DAO();
$input = $dao->insert($story, $date);
echo $input;
