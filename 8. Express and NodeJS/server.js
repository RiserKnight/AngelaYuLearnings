const express = require ("express");
const app = express();
app.get('/',function(request,response){
    response.send("Hello");
});
app.listen(3000,function(){
    console.log("Listening to port 3000")
});