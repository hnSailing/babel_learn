const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;

var jscode = "var a = 123;";

const visitor = {
	VariableDeclaration(path)
	{
		console.log(path.type);
		console.log(path.toString());
	}
}

let ast = parser.parse(jscode);

traverse(ast, visitor);
