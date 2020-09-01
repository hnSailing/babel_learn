const parser = require("@babel/parser");
const generator = require("@babel/generator").default;
const traverse = require("@babel/traverse").default;

const jscode = `
var a = 123, b;
let c = 4+5;
d = a + 12;
function add(a, b) {
    return a+b;
}
`;

const visitor = {
    VariableDeclarator(path) {
        const {id} = path.node;

        const binding = path.scope.getBinding(id.name);
        
        if (!binding||binding.constantViolations.length > 0) {
            return; //变量被修改过
        }
        if (binding.referencePaths.length === 0) {
            // 长度为0 变量未被使用过
            path.remove();
        }
    }
}

let ast = parser.parse(jscode);

traverse(ast, visitor);

let {code} = generator(ast);
console.log(code);