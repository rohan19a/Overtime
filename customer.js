const { query } = require("express");

signup = (req, res) => {
    email = this.email;
    password = this.password;

    
    queryReq = con.query("SELECT id from tbl_user WHERE email = ?", email)
    if (queryReq !== null) {
        let query = `INSERT INTO tbl_user 
        (email, password) VALUES (?, ?);`;
        db_con.query(query, [email, 
            password], (err, rows) => {
                if (err) throw err;
                console.log("Row inserted with id = "
                    + rows.insertId);
            });
        
    } else {
        console.log("user already exists");
    }
}

login = (req, res) => {
    emails = null;
    password = null;
    id = null;

    query = (`SELECT password tbl_user where email = ?`, emails);
    if (query !== null && query == password) {
        console.log("sucess");
    }

}
