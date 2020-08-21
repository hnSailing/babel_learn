const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const generator = require("@babel/generator").default;
const fs = require("fs");

const jscode = fs.readFileSync("./origin.js").toString();

const visitor = {
    StringLiteral(path) {
        let { extra } = path.node;
        delete extra.raw;
    }
}

let ast = parser.parse(jscode);
traverse(ast, visitor);

let { code } = generator(ast);

fs.writeFileSync("new.js", code);