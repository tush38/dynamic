const http = require("http");
const fs = require("fs");
var el = fs.readFileSync("data.json");
var jsondata = JSON.parse(el);
var arr = [];
var p = "";
var out = "";
const server = http
  .createServer(function(req, res) {
    var pat = req.url;
    arr = pat.split("?");
    var path = arr[0];
    if (path === "/products") {
      var pb = fs.readFileSync("template_product.html");
      p = p + pb;
      var op = "";
      var inp = arr[1];
      var arr2 = inp.split("");
      var daal = arr2[3];
      op += p
        .replace(/{%image%}/g, jsondata[daal]["image"])
        .replace(/{%productName%}/g, jsondata[daal]["productName"])
        .replace(/{%from%}/g, jsondata[daal]["from"])
        .replace(/{%nutrients%}/g, jsondata[daal]["nutrients"])
        .replace(/{%quantity%}/g, jsondata[daal]["quantity"])
        .replace(/{%price%}/g, jsondata[daal]["price"])
        .replace(/{%description%}/g, jsondata[daal]["description"]);
      if (jsondata[daal]["organic"] === false) {
        op = op.replace(/{%NOT-ORGANIC%}/g, "not-organic");
      }

      res.writeHead(200, { "content-type": "text/html" });
      res.write(op);
    } else if (path === "/" || path === "/overview" || path === "/home") {
      var c = "";
      var ov = "";
      var cdata = "";
      var over = fs.readFileSync("template_overview.html");
      ov += over;
      var cards = fs.readFileSync("template_card.html");
      c += cards;
      for (var i = 0; i < jsondata.length; i++) {
        out = c
          .replace(/{%image%}/g, jsondata[i]["image"])
          .replace(/{%productName%}/g, jsondata[i]["productName"])
          .replace(/{%quantity%}/g, jsondata[i]["quantity"])
          .replace(/{%ID%}/g,jsondata[i]["id"])
          .replace(/{%price%}/g, jsondata[i]["price"]);
        if (jsondata[i]["organic"] === false) {
          out = out.replace(/{%NOT-ORGANIC%}/g, "not-organic");
        }
        cdata += out;
      }
      var out2 = ov.replace(/{%CARD-TEMPLATE%}/g, cdata);

      res.writeHead(200, { "content-type": "text/html" });
      res.write(out2);
    } else if (path === "/api") {
      res.write(el);

      res.end("response ended");
    } else {
      res.end("Page not found");
    }
  });
  var port = process.env.PORT||80;
  server.listen(port);
console.log("Server has started on port "+port);
