const parser = require("@babel/parser");
const generator = require("@babel/generator").default;
const traverse = require("@babel/traverse").default;

const jscode = `
function i(){
    var i = 123;
    i += 2;
    let a = i;
    return 123;
}
let a = 123;
`;

const visitor = {
    FunctionDeclaration(path) {
        const {id} = path.node;
        //path.scope.dump();
        const binding = path.scope.parent.getBinding(id.name); // 从父级作用域开始遍历
        
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