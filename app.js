// jshint esversion:6
const express=require("express");
const app=express();
const bodyParser=require("body-parser");
const request=require("request");
const https=require("https");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.get("/",function(req,res){
  res.sendFile(__dirname+"/signup.html");
});
app.post("/",function(req,res){
  const firstName=req.body.fName;
  const lastName=req.body.lName;
  const email=req.body.email;
  const data={
    members:[{
      email_address : email,
      status: "subscribed",
      merge_fields:{
        FNAME: firstName,
        LNAME: lastName
      }
    }]
  }
  const jsonData=JSON.stringify(data);

  const client = require("@mailchimp/mailchimp_marketing");
  client.setConfig({
  apiKey: "9aa4c0213b302bdedbb4bc52525eecc7-us14",
  server: "us14",
  });
  const run = async () => {
  const response = await client.lists.batchListMembers("2c96294638", jsonData);
  if(response.error_count===0){
    res.sendFile(__dirname+"/success.html");
  }else {
    res.sendFile(__dirname+"/failure.html");
  }
  };
  run();
});
app.post("/failure",function(req,res){
  res.redirect("/");
});
app.listen(process.env.PORT || 3000,function(){
  console.log("Server is runnning on port 3000");
});


// API KEY
// 9aa4c0213b302bdedbb4bc52525eecc7-us14
// list id
// 2c96294638
