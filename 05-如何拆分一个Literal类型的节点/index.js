const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const t = require("@babel/types");
const generator = require("@babel/generator").default;

var jscode = `
var a = 12345678;
`;

const visitor = {
    NumericLiteral(path) {
        const node = path.node;
        const value = node.value;
        const first = 0 - Math.floor(Math.random() * 10000000 + 10000000);
        const second = value ^ first;
        path.replaceWith(t.BinaryExpression("^", t.NumericLiteral(first), t.NumericLiteral(second)));
        path.stop();
    }
}

let ast = parser.parse(jscode);

traverse(ast, visitor);

let { code } = generator(ast);

console.log(code);