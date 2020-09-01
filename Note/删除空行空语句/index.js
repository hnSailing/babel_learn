const parser = require("@babel/parser");
const generator = require("@babel/generator").default;
const traverse = require("@babel/traverse").default;

const jscode = `
let n = 123;
let s = "123";
;
console.log("hello babel!");
;
`;

const visitor = {
    EmptyStatement(path) {
        path.remove();   //删除空语句
    }
}

let ast = parser.parse(jscode);
traverse(ast, visitor);
let { code } = generator(ast, opts={retainLines: false});

console.log(code);