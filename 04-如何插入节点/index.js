const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const t = require("@babel/types");
const generator = require("@babel/generator").default;

var jscode = `
var a = 123;
`;

const visitor = {
	VariableDeclarator(path) {
		//path.insertAfter(t.Identifier('b'));

	},
	VariableDeclaration(path) {
		const operator = "=";
		const left = t.Identifier('b');
		const right = t.NumericLiteral(456);

		const new_assign = t.AssignmentExpression(operator, left, right);
		const new_express = t.ExpressionStatement(new_assign);
		path.insertAfter(new_express);
	}
}

let ast = parser.parse(jscode);

traverse(ast, visitor);

let {code} = generator(ast);

console.log('插入前: ', jscode);
console.log('插入后: ', code);
