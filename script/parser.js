function Node(val) {
	this.val = val;
	this.left = null;
	this.right = null;
}

function parser(formula) {
	this.formula = formula.toLowerCase();
	this.i = 0;
	this.ch = null; //TODO: be better with this variable (either treat it with class variable or pass it around)

	this.evaluate = function(node, x) {
		switch (node.val) {
			case 'x': return x;
			case '+': return this.evaluate(node.left, x) + this.evaluate(node.right, x);
			case '-': return this.evaluate(node.left, x) - this.evaluate(node.right, x);
			case '*': return this.evaluate(node.left, x) * this.evaluate(node.right, x);
			case '/': return this.evaluate(node.left, x) / this.evaluate(node.right, x);
			default: return node.val;
		}
	}
	
	this.makeEvaluator = function() {
		var _this = this;
		var tree = this.parse();
		return function(x) {
			return _this.evaluate(tree, x);
		}
	}
	
	this.consumeNext = function() {
		var ch = null;
		if (this.i < formula.length) {
			ch = formula[this.i];
			this.i++;
		}	
		return ch;
	}
	
	this.consumeWhiteSpace = function() {
		while (ch == ' ') {
			ch = this.consumeNext();
		}
	}
		
	this.parse = function() { 
		ch = this.consumeNext();
		
		var operand = this.consumeOperand();
		return this.consumeOperator(operand);
	}
	
	this.parseNumber = function() {
		var num = ch - '0', offset = 1;	

		while ((ch = this.consumeNext()) && !isNaN(ch)) {
			num *= 10;
			num += ch - '0';
		}
	
		if (ch == '.') { 
			while ((ch = this.consumeNext()) && !isNaN(ch)) {
				offset *= 0.1;
				num *= 10;
				num += ch - '0';
			}
		}
	
		num *= offset;
		return new Node(num);
	}
	
	this.parseIdentifier = function() {
		//TODO: add math functions
		var id = ch;
		while ((ch = this.consumeNext()) && ch >= 'a' && ch <= 'z') {
			id += ch;
		}
		//TODO: validate
		return new Node(id);
	}
	
	this.consumeOperand = function() {
		this.consumeWhiteSpace();
		
		//TODO: Make use of
		if (ch == '-') {
			ch = this.consumeNext();
			this.consumeWhiteSpace();
		}
		
		if (ch == '(') {
			return this.parse();
		} else if (!isNaN(ch)) {
			return this.parseNumber();
		} else {
			return this.parseIdentifier();
		}
	}
	
	this.consumeOperator = function(left) {
		// This takes left so it can deal with order of operations
		// it doesn't take right so it doesn't have to look ahead
		this.consumeWhiteSpace();
		
		if (!ch) {
			return left;
		} else if (ch == ')') { 
			ch = this.consumeNext();
			return left;
		}
		
		//TODO: validation
		
		var n = new Node(ch);
		n.left = left;
		
		//order of operations..
		if (ch == '+' || ch == '-') {
			n.right = this.parse();
			//TODO: validation 
		} else if (ch == '*' || ch == '/') {
			ch = this.consumeNext();
			n.right = this.consumeOperand();
			return this.consumeOperator(n);
		}
		
		return n;
	}
}

/*var identifiers = { 
	'cos': Math.cos,
	'sin': Math.sin,
	'tan': Math.tan,
	'acos': Math.acos,
	'asin': Math.asin,
	'atan': Math.atan,
	'abs': Math.abs,
	'sqrt': Math.sqrt,
	'log': Math.log,
	'exp': Math.exp,
	
	'pi': Math.PI,
	'e': Math.E,
	'x': function (x) { return x; }
};*/
