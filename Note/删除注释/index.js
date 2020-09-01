const parser = require("@babel/parser");
const generator = require("@babel/generator").default;

const jscode = `
/* 这是测试 */
// test
const test = "测试";
// test end
`;

let ast = parser.parse(jscode);

let {code} = generator(ast, opts= {comments: false});

console.log(code);