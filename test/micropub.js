const fs = require("fs");
const Assert = require("assert");
const {auth, request} = require("./../micropub.js");

describe("micropub", function() {
  it("hello world", async function() {
    const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJtZSI6Imh0dHA6XC9cL2NvZGUuc2dvLnRvXC8iLCJpc3N1ZWRfYnkiOiJodHRwczpcL1wvdG9rZW5zLmluZGllYXV0aC5jb21cL3Rva2VuIiwiY2xpZW50X2lkIjoiaHR0cDpcL1wvY29kZS5zZ28udG8iLCJpc3N1ZWRfYXQiOjE1MzU0MzA0NDEsInNjb3BlIjoicmVhZCBmb2xsb3cgbXV0ZSBibG9jayBjcmVhdGUiLCJub25jZSI6MTAzNzM0Mzk1MX0.wyuX2PLghI5qtGe77TBlWhrHMpp_ARmImuVSpmlluDM";

    let result = await request(token, "GET", {
      "action": "timeline",
      "channel": "xvpsnHFwbD0NnIR7rhJbBwwk"
     });

    console.log(result);
   });

  function assertThat(x) {
   return {
    equalsTo(y) {
     Assert.equal(x.trim(), y.trim());
    }
   }
  }
 });

