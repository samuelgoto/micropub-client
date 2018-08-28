const express = require('express');
const app = express();

app.get("/fetch", (req, res) => { 

  console.log(req);

  let url = "https://tokens.indieauth.com/token";
  // let data = new FormData();
  // data.append("grant_type", "authorization_code");
  // data.append("client_id", "http://code.sgo.to");
  // data.append("redirect_uri", "http://localhost:8080/foobar.html");
  // data.append("me", me);
  // data.append("code", code);

  // res.send("Hello World!");
  res.send({hello: "world"});

 });

app.get("/token", (req, res) => { 
  res.send("");
 });

app.use("/", express.static("."));


app.listen(8080);

