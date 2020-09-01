const parser = require("@babel/parser");
const generator = require("@babel/generator").default;
const traverse = require("@babel/traverse").default;
const t = require("@babel/types");

const jscode = `
var i = 92;
var s = "hello";
b = Z(123, i);
c = s;
d = B("world", s);
function test(i, s) {
    return i+s;
}
`;

// 把用到的s替换成92

const visitor = {
    VariableDeclarator(path) {
        const {id, init} = path.node;

        if (!t.isLiteral(init)) return; //只处理字面量
        const binding = path.scope.getBinding(id.name);

        if (!binding||binding.constantViolations.length > 0) {
            return;  //如果改变量值被改变，就不做处理
        }

        for(const refer_path of binding.referencePaths) {
            refer_path.replaceWith(init);
        }
        path.remove();  // 删除自身dingyi 
    }
}

let ast = parser.parse(jscode);

traverse(ast, visitor);

let {code} = generator(ast);

console.log(code);