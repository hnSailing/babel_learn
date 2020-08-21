const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const t = require("@babel/types");
const generator = require("@babel/generator").default;

const jscode = `
var Xor = function (p,q)
{
  return p ^ q;
}
var Add = function(a, b) {
    return a+b;
}

let a = Xor(111,222);
let b = Xor(333,444);
let c = Add(1,2);
`;

function call2express(path) {
    const { init, id } = path.node;
    const name = id.name;

    const params = init.params;
    // 参数不是两个, return
    if (!params || params.length != 2) return;
    let first_arg = params[0].name;
    let second_arg = params[1].name;
    const body = init.body;
    // 函数内部语句不是一条 return
    if (!body.body || body.body.length != 1) return;

    const body_statement = body.body[0];
    if (body_statement.type !== "ReturnStatement") return;

    const argument = body_statement.argument;

    if (!t.isReturnStatement(body_statement) ||
        !t.isBinaryExpression(argument)) return;

    const { operator, left, right } = argument;
    if (!t.isIdentifier(left, {name:first_arg})||
        !t.isIdentifier(right, {name: second_arg})) return;

    let scope = path.scope;
    traverse(scope.block, {
        CallExpression(_path) {
            let _node = _path.node;
            let args = _node.arguments;

            if (args.length === 2 && t.isIdentifier(_node.callee, {name: name})) {
                _path.replaceWith(t.binaryExpression(operator, args[0], args[1]));
            }
        }
    })
}

const visitor = {
    VariableDeclarator(path) {
        const init = path.get('init');
        if (init.isFunctionExpression()) {
            call2express(path);
            return;
        }
    }
};

let ast = parser.parse(jscode);

traverse(ast, visitor);

let { code } = generator(ast);

console.log('还原前代码: ', jscode);
console.log('还原后代码: ', code);