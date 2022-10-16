CREATE TABLE tasks (
    id INT PRIMARY KEY, -- 1-x 
    title VARCHAR(500), --task they need to do
    dates DATETIME, -- time they entered it
    dueDate DATETIME, -- due date
    timeNeeded INT, --estimated time needed
    vals FLOAT(10, 10), --alorithm value
)