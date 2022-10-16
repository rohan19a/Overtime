function Add() {
    console.log("h");
}

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
    }
}


function priority(f, delta) {
    let logVal = -1 * Math.log(delta);


}
