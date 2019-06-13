<?php
class DAO
{
    private static $dbHost = "localhost";
    private static $dbName = "obv";
    private static $dbUser = "rita";
    private static $dbPass = "rita";
    private static $sharedPDO;

    protected $pdo;

    public function __construct()
    {
        if (empty(self::$sharedPDO)) {
            self::$sharedPDO = new PDO("mysql:host=" . self::$dbHost . ";dbname=" . self::$dbName, self::$dbUser, self::$dbPass);
            self::$sharedPDO->exec("SET CHARACTER SET utf8");
            self::$sharedPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            self::$sharedPDO->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
        }
        $this->pdo = &self::$sharedPDO;
    }
    public function insert($story, $date)
    {
        $sql = "INSERT INTO `stories` (`story`, `date`) VALUES (:story, :date)";
        $statement = $this->pdo->prepare($sql);
        $statement->bindValue(':story', $story);
        $statement->bindValue(':date', $date);
        if ($statement->execute()) {
            return 1;
        } else {
            return 0;
        }
    }

}
