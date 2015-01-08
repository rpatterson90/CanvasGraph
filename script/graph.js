var height = 382;
var width = 382;
var padding = 30;

function setFormula(formula) {
	drawFormula(formula);
	animateFormula(formula, 0.0075);
}

function updateFormula() {
	var formulaText = $("#formulaText").val();
	var formula = new parser(formulaText);
	
	setFormula(formula.makeEvaluator());
}

function drawFormula(formula) {
	var context = createContext("line");
	context.clearRect(0,0, width + padding, height + padding);
	
	context.beginPath();
	context.moveToPadded(0, height * (1-formula(0)));
	for (var x = 0; x <= 1.0; x += 0.001) 
	{
		y = formula(x);
		context.lineToPadded(width * x, height * (1-y));
	}
	context.strokeStyle = "blue";
	context.stroke();
}

var animation;
function animateFormula(formula, step, t) {
	if (animation) {
		cancelAnimationFrame(animation);
	}
	if (!t) {
		t = 0;
	}
	
	var canvas = document.getElementById("animation");
	var context = canvas.getContext('2d');
	context.clearRect(0,0, canvas.width, canvas.height);
	
	y = formula(t);
	context.beginPath();
	context.arc(padding + width * t, padding + height * (1-y), 5, 0, 2 * Math.PI, false);
	context.fillStyle = "green";
	context.fill();
	
	canvas = document.getElementById("timed");
	context = canvas.getContext('2d');
	context.clearRect(0,0, canvas.width, canvas.height);
	
	context.beginPath();
	context.arc(440, padding + height * (1-y), 5, 0, 2 * Math.PI, false);
	context.fillStyle = "green";
	context.fill();
	
	animation = requestAnimationFrame(function() {
		step = (t > 1 || t < 0) ? step * -1 : step;
		animateFormula(formula, step, t + step);
	});
}

function drawGraph() {
	var context = createContext("graph");
	
	//draw edge
	context.beginPath();
	context.moveToPadded(0, 0);
	context.lineToPadded(0, height);
	context.lineToPadded(width, height);
	//These two lines 'close' the graph
	//context.lineToPadded(width, 0);
	//context.lineToPadded(0, 0);
	context.stroke();
	
	//draw markers
	for (var i = 0; i < 1; i += 0.1)
	{
		//x-axis
		context.beginPath();
		context.moveToPadded(width * i, height);
		context.lineToPadded(width * i, height + 5);
		context.stroke();
		context.fillTextPadded(i.toFixed(1), width * i - 7, height + 15);
		
		//y-axis
		context.beginPath();
		context.moveToPadded(0, height * i);
		context.lineToPadded(-5, height * i);
		context.stroke();
		context.fillTextPadded((1 - i).toFixed(1), - 21, height * i + 3);
	}
}

function createContext(canvasName) {
	var canvas = document.getElementById(canvasName);
	var context = canvas.getContext('2d');
	context.moveToPadded = function(x, y) {
		this.moveTo(padding + x, padding + y);
	}
	context.lineToPadded = function(x, y) {
		this.lineTo(padding + x, padding + y);
	}
	context.fillTextPadded = function(text, x, y) {
		this.fillText(text, padding + x, padding + y);
	}
	
	return context;
}

function init() {
	drawGraph();
	setFormula(function(x) { return x * x; });
	$("#formulaText").keyup(function(event) {
		if (event.keyCode == 13) {
			updateFormula();
		}
	});
}

$(document).ready(init);
