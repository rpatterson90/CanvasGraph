var height = 382;
var width = 382;
var padding = 30;
var origin = {x:padding, y:padding + height};
/*
(padding, padding)
(padding, padding + height)
(padding + width, padding + height)
(padding + width, padding)
*/
function init() {
	var canvas = document.getElementById('graph');
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
	
	//draw edge
	context.beginPath();
	context.moveToPadded(0, 0);
	context.lineToPadded(0, height);
	context.lineToPadded(width, height);
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

$(document).ready(init);