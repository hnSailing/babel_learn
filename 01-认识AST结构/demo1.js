const parser = require("@babel/parser");
const fs = require("fs");

var jscode = "var a = 123;";

let ast = parser.parse(jscode);

//console.log(JSON.stringify(ast, null, "\t"));
fs.writeFile("ast.js", JSON.stringify(ast, null, '\t'), (err)={});
