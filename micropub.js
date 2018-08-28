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

module.exports = {
 auth: auth,
 request: request
};