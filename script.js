var pageNum = 0;

function Add(Item) {
    con.query("INSERT INTO tasks VALUES(this.name, this.progress, this.timeToEnd, this.deadline, this.time)"); 
}

function getInfo() {
    var x = document.getElementById("myForm").elements[0].value;
    document.getElementById("demo").innerHTML = x;
    console.log(x);
  }

function openForm() {
    document.getElementById("myForm").style.display = "block";
  }
  
function closeForm() {
    document.getElementById("myForm").style.display = "none";
}

let s = 1;
document.getElementById("name").innerHTML = s;

function previous() {
    if (pageNum >= 1) {
        pageNum -= 1;
    }
    console.log(pageNum);
}

function next() {
    pageNum = pageNum + 1;
    console.log(pageNum);
}

function getTitle(id) {
    query = con.query("SELECT title from tasks where id = ?", id);
    con.query(query, [id], (err, rows) => {
        if (err) throw err;
    });
}

function getX(x, id) {
    query = con.query("SELECT x from tasks where id = ?", id);
    con.query(query, [id], (err, rows) => {
        if (err) throw err;
    });
}

//QbC3LxWEyCLoJS9k8nwjbQ
//roach password



//D : Due date 
//f : Expected Amount of time to finish 
//F : Current time

/*
(-log(dead line - current time)

P (d, f, t)

D - t = delta(t)

p(f, delta(t)) */

//D : Due date
//f : Expected Amount of time to finish
//F : Current time
 
/*
(-log(dead line - current time)
 
P (d, f, t)
 
D - t = delta(t)
 
p(f, delta(t)) */
class Item {
    constructor(name, progress, timeReq, deadline) {
        var time = new Date();
        this.name = name;
        this.progress = progress;
        this.timeReq = timeReq;
        this.deadline = deadline;//user input here
 
// returns the priority of a task
function priority(f, delta) {
    let logVal = Math.log(delta)
    return f*(Math.pow(10,logVal)); // To get the inverse/anti log, raise value given by log func to the power 10
    // how to weight with time required to do? maybe multiply time by log output - rohan
}
 
//Delta function, returns the deadline - current time in minutes, input is the deadline
function delta(dead) {
    var time = new Date();
    //done in minutes
    return(Date.dateDiff(n,time,dead));
 
}
 
function setDeadline(year, month, day, hours, time) {
    //We need this to be determined by the user
 
    deadline = new Date(year, month, day, hours, time, 0, 0);
}
 
//conversions for milliseconds, give credit to https://www.htmlgoodies.com/javascript/calculating-the-difference-between-two-dates-in-javascript/
Date.dateDiff = function(datepart, fromdate, todate) {  
    datepart = datepart.toLowerCase();  
    var diff = todate - fromdate;  
    var divideBy = { w:604800000,
                     d:86400000,
                     h:3600000,
                     n:60000,
                     s:1000 };  
   
    return Math.floor( diff/divideBy[datepart]);
}
    }
}




