
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
  res.sendFile(__dirname + "/signUp.html");
});

app.post("/", function(req, res){
  const fname = req.body.Fname;
  const lname = req.body.Lname;
  const email = req.body.Email;

 // JAVASCRIPT FORM
  const data = {
     members: [
       {
         email_address: email,
         status: "subscribed",
         merge_fields: {
            FNAME: fname,
            LNAME: lname
         }
       }
     ]
  };
 // Here we converted our javascript data into JSON
  const jsonData = JSON.stringify(data);
 
  // mailchimp Audience ID at last
  const url = "https://us21.api.mailchimp.com/3.0/lists/947e6edb37";

  const options = {
    method: "POST",
    // after : we have our API key
    auth:"Aayush1:7ab167edf725c84218b2110a68e92ad6-us21"
  }

  // https request being made
  const request = https.request(url, options, function(response){

    if (response.statusCode === 403) {
      res.sendFile(__dirname + "/failure.html");
    } else if(response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else{
      res.send("Token Expired");
    }

    response.on("data", function(data){
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();


});

app.post("/failure", function(req, res){
  res.redirect("/");
});

// Listen command
app.listen(process.env.PORT || 3000, function(){
  console.log("Server is running on port 3000");
});








