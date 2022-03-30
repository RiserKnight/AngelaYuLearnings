
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const express = require("express");
const ejs = require("ejs");

const app = express();

app.set('view engine','ejs');

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB",{useNewUrlParser: true});

const articleSchema ={
    title: String,
    content: String
};

const Article = mongoose.model('Article',articleSchema);

app.get("/",(req,res)=>{
res.send("<h1>Done</h1>");
});

app.route("/articles")

.get((req,res)=>{
Article.find(function(err,results){
    if(err){res.send(err);}
    else{
        console.log("Yaha");
        console.log(results);
        res.send(results);
    }
});
})

.post((req,res)=>{
const newArticle = new Article ({
    title: req.body.title,
    content: req.body.content
})

newArticle.save((err)=>{
if(err){res.send(err);}
else{res.send("Successfully added");}
});
})

.delete((req,res)=>{
Article.deleteMany((err)=>{
if(err){res.send(err);}
else{res.send("Successfully deleted");}
});
});

app.route("/articles/:articleTitle")

.get((req,res)=>{
Article.findOne({title: req.params.articleTitle},(err,result)=>{
    if(result){res.send(result);}
    else{res.send(err);}
})
})

.put((req,res)=>{
Article.update({title: req.params.articleTitle},
    {title: req.body.title,content: req.body.content},
    {overwrite: true},function(err){
      if(!err){res.send("Sucessfully updated");}
      else{res.send(err);}
    });
})

.patch((req,res)=>{
    Article.update({title: req.params.articleTitle},
        {$set: req.body},
        (err)=>{
         if(err){res.send(err);}
         else{res.send("Successfully updated");}
        });
});

app.listen(3000,
    ()=>{
    console.log("Server Started");
})