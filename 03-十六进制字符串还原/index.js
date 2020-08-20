const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generator = require('@babel/generator').default;
const t = require('@babel/types');
const fs = require('fs');

let jscode = `
var a = "\x48\x65\x6c\x6c\x6f\x2c\x4e\x69\x67\x68\x74\x54\x65\x61\x6d\x21";
`

const visitor = {
	/*
	VariableDeclarator(path) {
		const init = path.get('init');
		if (!init.isStringLiteral()) return;
		const node = init.node;
		let {value, extra} = node;
		extra.raw = '"' + value + '"';
	}
	*/
	
	StringLiteral(path) {
		let {value, extra} = path.node;
		//第一种方法
		//extra.raw = `"${value}"`;
		/*第二种方法
		path.replaceWith(t.StringLiteral(value));
		path.stop();
		*/
		//第三种方法
		delete extra.raw;
	}
}

let ast = parser.parse(jscode);
traverse(ast, visitor);

let {code} = generator(ast);

fs.writeFileSync("code.js", code);
