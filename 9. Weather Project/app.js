
const express = require ("express");
const https = require("https");
const bodyParser= require("body-parser");

const app =express();
app.use(bodyParser.urlencoded({extended: true}));

app.get('/',function(req,res){
   
    res.sendFile(__dirname+"/index.html");
});

app.post('/',function(req,res){

    const apiKey="d450e6fc7a9661b37569b98f13afd9e4"
    const unit="metric"
    const city=req.body.cityName;
    const url ="https://api.openweathermap.org/data/2.5/weather?q="+city+"&appid="+apiKey+"&units="+unit;

    https.get(url,function(response){

        response.on("data",function(data){
            const weatherData = JSON.parse(data);
            const temp = weatherData.main.temp;
            const weatherDescrip =weatherData.weather[0].description;
            const icon=weatherData.weather[0].icon;
            const imageURL="https://openweathermap.org/img/wn"+icon+"2x.png";

            res.write("<h1>City: "+city+" </h1>");
            res.write("<h3> Temperature: "+temp+"<h3/>");
            res.write("<h5> Description: "+weatherDescrip+"</h5>");
            res.write(" <img src="+imageURL+">");
            res.send();
        })
    });

});



app.listen(3000,function(){
    console.log("Server started at  port 3000");
});