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

//D : Due date 
//f : Expected Amount of time to finish 
//F : Current time

/*
(-log(dead line - current time)

P (d, f, t)

D - t = delta(t)

p(f, delta(t)) */

class Item {
    constructor(name, progress, timeToEnd, deadline) {
        var time = new Date();
        this.name = name;
        this.progress = progress;
        this.timeToEnd = timeToEnd;
        this.deadline = deadline;
        this.time = time;
    }
}



function priority(f, delta) {
    let logVal = -1 * Math.log(delta);
}

