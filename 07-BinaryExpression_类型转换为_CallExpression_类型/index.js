const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const t = require("@babel/types");
const generator = require("@babel/generator").default;

const jscode = `
var a = 123 | 456;
var b = 123 * 456;
`;

function binary2func(path) {
    const init_path = path.get('init');
    if (!init_path.isBinaryExpression()) return;
    const init_node = init_path.node;
    let { operator, left, right } = init_node;
    init_node.type = "CallExpression";
    init_node.arguments = [left, right];

    let id = null;

    let arg1 = t.identifier("s");
    let arg2 = t.identifier("h");
    let params = [arg1, arg2];

    let inner_body = t.returnStatement(t.binaryExpression(operator, arg1, arg2));
    let wrapper_body = t.blockStatement([inner_body]);


    init_node.callee = t.functionExpression(id, params, wrapper_body);
}

const visitor = {
    VariableDeclarator(path) {
        binary2func(path);
    }
}

let ast = parser.parse(jscode);

traverse(ast, visitor);

let { code } = generator(ast);

console.log(code);