const parser = require("@babel/parser");
const generator = require("@babel/generator").default;
const traverse = require("@babel/traverse").default;
const t = require("@babel/types");

const jscode = `
var _2$SS = function(_SSz, _1111) {
    var _l1L1 = [46222, '\x74\x61\x43\x61\x70\x74\x63\x68\x61\x42\x6c\x6f\x62', '\x74', '\x61', '\x73', '\x6c', '\x64', '\x69', .3834417654519915, '\x65\x6e\x63\x72\x79\x70\x74\x4a', '\x73\x6f', '\x6e', 49344];
    var _2Szs = _l1L1[5] + _l1L1[7] + (_l1L1[4] + _l1L1[2])
    , _I1il1 = _l1L1[9] + (_l1L1[10] + _l1L1[11]);
    var _0ooQoO = _l1L1[0];
    var _$Z22 = _l1L1[12]
    , _2sS2 = _l1L1[8];
    return _l1L1[6] + _l1L1[3] + _l1L1[1];
};
`;

const visitor = {
    VariableDeclarator(path) {
        const {id, init} = path.node;

        // 非Array或者没有元素, 返回
        if (!t.isArrayExpression(init) || init.elements.length === 0) return;

        let elements = init.elements;
    
        // 获取binding实例
        const binding = path.scope.getBinding(id.name);

        for (const refer_path of binding.referencePaths) {
            // 获取MemberExpression父节点
            let member_path = refer_path.findParent(p=>p.isMemberExpression());
            let property = member_path.get('property');
            if (!property.isNumericLiteral()) {
                // 索引值不是NumbericLiteral类型不处理
                continue;
            }
            // 获取索引值
            let index = property.node.value;
            let arr_ele = elements[index];
            member_path.replaceWith(arr_ele);
        }
    }
}

let ast = parser.parse(jscode);

traverse(ast, visitor);

let {code} = generator(ast);
console.log(code);