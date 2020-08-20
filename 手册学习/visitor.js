const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;

var jscode = `
function square(n) {
	return n*n;
}
n;
`;

const updateParamNameVisitor = {
	Identifier(path) {
		if(path.node.name === this.paramName) {
			path.node.name = "x";
		}
	}
}
const MyVisitor = {
	/*
	Identifier: {
		enter() {
			console.log("Entered!");
		},
		exit() {
			console.log("Exited!");
		}
	}
	*/
	/*
	Identifier(path) {
		console.log("Visiting: " + path.node.name);
	}
	*/

	/*状态管理*/
	/*
	FunctionDeclaration(path) {
		const param = path.node.params[0];
		paramName = param.name;
		param.name = "x";
	},
	Identifier(path) {
		if (path.node.name === paramName) {
			path.node.name = "x";
		}
	}
	*/
	FunctionDeclaration(path) {
		const param = path.node.params[0];
		const paramName = param.name;
		param.name = "x";

		path.traverse(updateParamNameVisitor, { paramName });
	}
};

let visitor = {};
visitor.MemberExpression = function() {};
visitor.FunctionDeclaration = function() {};

let ast = parser.parse(jscode);

traverse(ast, MyVisitor);

console.log(JSON.stringify(ast, null, '\t'));
