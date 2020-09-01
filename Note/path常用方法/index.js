const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const t = require("@babel/types");
const generator = require("@babel/generator").default;

const jscode = `
var a = 123;

function wrapper(n) {
    function inner(){
        console.log(n);
        return "Inner";
    }

    return inner;
}
`;

const replace_visitor = {
    //节点替换测试 把wrapper内部语句替换成 其他
    FunctionDeclaration(path) {
        const node = path.node;
        const name = node.id.name; //函数名
        const params = node.params;

        if (name === "wrapper") {
            //开始替换
            const body_path = path.get('body').get("body");
            //const body = body_path.node.body;

            // 构造blockstatement
            const rt = t.returnStatement(params[0]);
            body_path[0].remove();
            //body_path[1].replaceWith(rt);  单个替换
            //body_path[1].replaceWithMultiple([rt, rt]);   可以单个可以多个
            // 兼容上边两种替换方式
            body_path[1].replaceInline([rt, rt]);
            
        }
    }
    
}

let ast = parser.parse(jscode);

traverse(ast, replace_visitor);

let {code} = generator(ast);

console.log(code);