let singleRowInsert = () => {
  
    let query = `INSERT INTO tasks 
        (email, id, this_id, title, dates, dueDate, timeNeeded, vals) VALUES (?, ?, ?, ?, ?, ?, ?);`;
  
    // Value to be inserted
    let title = "";
    let dates = "";
    let dueDate = "";
    let timeNeeded = "";
    let vals = "";
    let email = "";
    let id = "";
    let this_id = "";
  
    // Creating queries
    con.query(query, [email, id, this_id,
        title, dates, dueDate, timeNeeded, vals], (err, rows) => {
        if (err) throw err;
        console.log("Row inserted with id = "
            + rows.id);
    });
};

