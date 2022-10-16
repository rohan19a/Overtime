databases DATABASE.

CREATE TABLE tasks (
    `email` varchar(128) NOT NULL,
    `id` bigint NOT NULL AUTO_INCREMENT,
    this_id INT PRIMARY KEY, -- 1-x 
    title VARCHAR(500), --task they need to do
    dates DATETIME, -- time they entered it
    dueDate DATETIME, -- due date
    timeNeeded INT, --estimated time needed
    vals FLOAT(10, 10), --alorithm value
)

DROP TABLE IF EXISTS `tbl_user`;
CREATE TABLE `tbl_user` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `email` varchar(128) NOT NULL,
  `password` varchar(60) NOT NULL,
  `mobile_number` varchar(15) NOT NULL,
  `login_type` enum('S','F','G') NOT NULL,
  `login_status` enum('Offline','Online') NOT NULL,
  `is_active` enum('1','0') NOT NULL,
  `is_deleted` enum('0','1') NOT NULL,
  `insertdate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=64 DEFAULT CHARSET=utf8;
