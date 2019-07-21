const http = require("http");
const fs = require("fs");
var el = fs.readFileSync("data.json");
var jsondata = JSON.parse(el);
// console.log(jsondata)
var arr = [];
var p = "";
var out = "";
var pb = fs.readFileSync("template_product.html");
p = p + pb;
console.log(p);
var cards = fs.readFileSync("template_card.html");
var over = fs.readFileSync("template_overview.html");
const server = http
  .createServer(function(req, res) {
    var pat = req.url;
    res.writeHead(200, { "content-type": "text/html" });
    arr = pat.split("?");
    var path = arr[0];
    if (path === "/products") {
      var op = '';
      var inp = arr[1];
      var arr2 = inp.split("");
      var daal = arr2[3];
      op= p.replace(/{%image%}/g, jsondata[daal]["image"]);
        op=op.replace(/{%productName%}/g, jsondata[daal]["productName"]);
      op = op.replace(/{%from%}/g, jsondata[daal]["from"]);
      op = op.replace(/{%nutrients%}/g, jsondata[daal]["nutrients"]);
      op = op.replace(/{%quantity%}/g, jsondata[daal]["quantity"]);
      op = op.replace(/{%price%}/g, jsondata[daal]["price"]);
      op = op.replace(/{%description%}/g, jsondata[daal]["description"]);
      if (jsondata[daal]["organic"] === false) {
        op = op.replace(/{%NOT-ORGANIC%}/g, "not-organic");
      }
      console.log(op);
      res.end(op);
    } else if (path === "/" || path === "/overview" || path === "/home") {
      var c = "";
      var ov = "";
      var cdata = "";
      ov += over;
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
      res.end(out2);
    } else if (path === "/api") {
      res.write(el);

      res.end("response ended");
    } else {
      res.end("Page not found");
    }
  });
  var port = process.env.PORT||80;
  server.listen(3000);
// console.log("Server has started on port "+port);
