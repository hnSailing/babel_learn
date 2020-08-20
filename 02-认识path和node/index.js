const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generator = require("@babel/generator").default;

const jscode = `
var a = 123;
`;


const visitor = {
	VariableDeclarator(path) {
		//console.log(path.node);
		//delete path.node.init;
		//let {code} = generator(path.node);
		//console.log(code);
		const node = path.node;
		const value = node.init.value;
		console.log(value);
	}
}

let ast = parser.parse(jscode);

traverse(ast, visitor);

let {code} = generator(ast);
console.log(code);
