const express = require ("express");
const bodyParser = require("body-parser");
const { redirect } = require("express/lib/response");
const date = require(__dirname+"/date.js")


const app=express();

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));


const listItems=["Fuck"];
const listWork=[];

app.get('/',(req,res)=>{
    res.redirect("/Home");
})

app.get("/Home",(req,res)=>{
    res.render('list',{listTitle: "Home",listItems:listItems,day: date.getDate()});
});

app.post("/Home",(req,res)=>{

    var newItem=req.body.task;
    listItems.push(newItem);
    res.redirect("/Home");
});

app.get("/Work",(req,res)=>{
    res.render('list',{listTitle: "Work",listItems:listWork,day: date.getDate()});
});

app.post("/Work",(req,res)=>{

    var newItem=req.body.task;
    listWork.push(newItem);
    res.redirect("/Work");
});

app.listen(3000,()=>{
console.log("Server Started To Do List Version 1");
});