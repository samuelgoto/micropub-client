const express = require("express");
const app = express();
const {auth, request} = require("./micropub.js");
 
app.get("/", async (req, resp) => {
  let url = new URL("https://indieauth.com/auth");
  let params = url.searchParams;
  params.append("redirect_uri", "http://localhost:8080/auth");
  params.append("me", "http://code.sgo.to");
  params.append("scope", "read follow mute block create");
  params.append("state", "123");

  resp.redirect(url);
 });

app.get("/auth", async (req, resp) => {
  let {token, me} = req.query;
  let result = await auth(token, me);

  let url = new URL("http://localhost:8080/foobar.html");
  // TODO(goto): we should probably keep these behind cookies.
  let params = url.searchParams;
  params.append("me", result.me);
  params.append("scope", result.scope);
  params.append("access_token", result.access_token);
  params.append("token_type", result.token_type);

  resp.redirect(url);
 });

app.get("/channels", async (req, resp) => {
  let token = req.query.access_token;
  resp.send(await request(token, "GET", {
   action: "channels"
  }));
 });

app.post("/follow", async (req, resp) => {
  let token = req.query.access_token;
  let channel = req.query.channel;
  let url = req.query.url;

  resp.send(await request(token, "POST", {
     action: "follow",
      channel: channel,
     url: url
    }));
 });

app.get("/follow", async (req, resp) => {
  let token = req.query.access_token;
  let channel = req.query.channel;

  resp.send(await request(token, "GET", {
     action: "follow",
      channel: channel
    }));
 });

app.get("/timeline", async (req, resp) => {
  let token = req.query.access_token;
  let channel = req.query.channel;

  let result = await request(token, "GET", {
     action: "timeline",
     channel: channel
   });

  // console.log(result);

  resp.send(result);
 });

app.use("/", express.static("."));

app.listen(8080);

