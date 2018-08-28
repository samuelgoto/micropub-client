const express = require("express");
const app = express();
const fetch = require("node-fetch");
const FormData = require("form-data");
const {URL, URLSearchParams} = require("url");

async function auth(code, me) {
 let data = new FormData();
 data.append("grant_type", "authorization_code");
 data.append("client_id", "http://code.sgo.to");
 data.append("redirect_uri", "http://localhost:8080/auth");
 data.append("me", me);
 data.append("code", code);

 let url = "https://tokens.indieauth.com/token";

 let result = await fetch(url, {
   method: "POST",
   body: data
  });

 let body = await result.text();
 let params = new URLSearchParams(body);

 let token = {
  me: params.get("me"),
  scope: params.get("scope"),
  access_token: params.get("access_token"),
  token_type: params.get("token_type")
 };
 
 return token;
}

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

async function request(token, method, params) {
  let url = new URL("https://aperture.p3k.io/microsub/109");
  let query = url.searchParams;
  // params.append("action", "channels");
  for (let param in params) {
   query.append(param, params[param]);
  }

  let result = await fetch(url, {
    method: method,
    headers: {
     Authorization: `Bearer ${token}`
    }
  });

  // console.log(result);

  return result.json();
}

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

  console.log(url);

  resp.send(await request(token, "POST", {
     action: "follow",
     channel: channel,
     url: url
    }));
 });

app.post("/stream", async (req, resp) => {
  let token = req.query.access_token;
  let channel = req.query.channel;

  let result = await request(token, "GET", {
     action: "timeline",
     channel: channel
   });

  console.log(result);

  resp.send(result);
 });

app.use("/", express.static("."));


app.listen(8080);

