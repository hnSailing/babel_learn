const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const t = require("@babel/types");
const generator = require("@babel/generator").default;

var jscode = `
var a = !![],b = 'Hello ' + 'world' + '!',c = 2 + 3 * 50,d = Math.abs(-200) % 19,e = true ? 123:456;
`;

function pathToLiteral(path, value) {
    switch (typeof value) {
        case "boolean":
            path.replaceWith(t.booleanLiteral(value));
            break;
        case "string":
            path.replaceWith(t.stringLiteral(value));
            break;
        case "number":
            path.replaceWith(t.numericLiteral(value));
            break;
        default:
            break;
    }
}

const visitor = {
    "UnaryExpression|BinaryExpression|ConditionalExpression" (path) {
        /*exit: function(path) {
            const { value } = path.evaluate();
            //console.log(path.toString(), value);

        }*/
        const { value } = path.evaluate();
        pathToLiteral(path, value);
    }
}

let ast = parser.parse(jscode);
traverse(ast, visitor);

let { code } = generator(ast);
console.log(code);