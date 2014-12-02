"use strict";

var DELAY = 250;

var canvas;
var ctx;
var tool = 0;
var hammer;

$(function() {
	setDefaultBehavior();
	setupPalette();

	canvas = document.getElementById('canvas');

	hammer = new Hammer(canvas);
	hammer.get('pan').set({ direction: Hammer.DIRECTION_ALL });

	ctx = canvas.getContext("2d");
	ctx.lineWidth = 2.0;
	
	Hammer.on(window, "load resize", function(event) {
		resizeWindow();
		touchLogic();
	});
	
	// Clear canvas
	$('#delete').click(function() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
	});
});

function touchLogic() {
	//var swipe = new Hammer.Swipe({ event: 'swipeleft swiperight' });
	//var pan = new Hammer.Pan({ event: 'panstart' });
	//hammer.add([swipe, pan]);
	//pan.requireFailure(swipe);

	var colorSel = $('#color-selection');
	var toolbox = $('#controls');

	var startingPosition;
	var endingPosition;

	hammer.on('swipeleft', function(event) {
		animateColorSelection(colorSel, false);
		animateToolbox(toolbox, true);
	});

	hammer.on('swiperight', function(event) {
		animateToolbox(toolbox, false);
		animateColorSelection(colorSel, true);
	});

	hammer.on('panstart', function(event) {
		startingPosition = getMousePosition(event);
		if (tool == 0) {
			console.log('freedraw');
			freeDraw(startingPosition, endingPosition);
		}
	});

	hammer.on('panend', function(event) {
		endingPosition = getMousePosition(event);
		drawShape(startingPosition, endingPosition);
		endingPosition = null;
		hammer.off('panmove');
	});

	// Handle color change on click/touch
	$('.swatch').click(function() {
		changeColor($(this).css('background-color'));
		animateColorSelection(colorSel, true);
	});

	// Handle tool change on click/touch
	$('.draw-tool').click(function() {
		$('#toolbox li').removeClass('active');
		$(this).addClass('active');
		tool = $(this).val();
		animateToolbox(toolbox, true);
	});
}



function animateColorSelection(selection, shown) {
	if (shown) {
		selection.animate({
			'right' : (0 - selection.innerWidth())
		}, DELAY);
		window.setTimeout(function() {
			selection.css('display', 'none');
		}, DELAY);
	} else {
		selection.css('display', 'inline-block');
		resizeWindow();
		selection.animate({
			'right' : '0px'
		}, DELAY);
	}
}

function animateToolbox(selection, shown) {
	if (shown) {
		selection.animate({
			'left' : (0 - selection.innerWidth())
		}, DELAY);
		window.setTimeout(function() {
			selection.css('display', 'none');
		}, DELAY);
	} else {
		selection.css('display', 'inline-block');
		resizeWindow();
		selection.animate({
			'left' : '0px'
		}, DELAY);
	}
}

function resizeWindow() {
	var height = window.innerHeight - canvas.offsetTop - 20;
	$(canvas).css('height', height);
	$('#color-selection').css('height', height);
	$('#controls').css('height', height);

	var swatches = $('.swatch');
	swatches.css('height', swatches.innerWidth());
}

function changeColor(color) {
	ctx.fillStyle = color;
	ctx.strokeStyle = color;
}

function drawShape(start, end) {
	if (tool == 1) {
		drawLine(start.x, start.y, end.x, end.y);
	} else if (tool == 2) {
		drawRectangle(start.x, start.y, end.x, end.y);
	} else if (tool == 3) {
		drawCircle(start.x, start.y, end.x, end.y);
	}
}

function freeDraw(startingPosition, endingPosition) {
	ctx.beginPath();
	hammer.on('panmove', function(event) {
		endingPosition = getMousePosition(event);
		ctx.moveTo(startingPosition.x, startingPosition.y);
		ctx.lineTo(endingPosition.x, endingPosition.y);
		ctx.stroke();
		startingPosition = endingPosition;
	});
	ctx.closePath();
}

function drawRectangle(x1Coord, y1Coord, x2Coord, y2Coord) {
	var xCoord = (x1Coord < x2Coord) ? x1Coord : x2Coord;
	var yCoord = (y1Coord < y2Coord) ? y1Coord : y2Coord;
	var width = Math.abs(x2Coord - x1Coord);
	var height = Math.abs(y2Coord - y1Coord);
	ctx.fillRect(xCoord, yCoord, width, height);
}

function drawCircle(centerX, centerY, deltaX, deltaY) {
	var aSquare = Math.pow(Math.abs(centerX - deltaX), 2);
	var bSquare = Math.pow(Math.abs(centerY - deltaY), 2);
	var radius = Math.sqrt(aSquare + bSquare);
	ctx.beginPath();
	ctx.arc(centerX, centerY, radius, 0, 2*Math.PI);
	ctx.fill();
	ctx.stroke();
	ctx.closePath();
}

function drawLine(x1Coord, y1Coord, x2Coord, y2Coord) {
	ctx.beginPath();
	ctx.moveTo(x1Coord, y1Coord);
	ctx.lineTo(x2Coord, y2Coord);
	ctx.stroke();
	ctx.closePath();
}

function setupPalette() {
	var colors = ['BLACK', 'WHITE', 'GRAY', 'BLUE', 'RED', 'YELLOW', 'GREEN', 'PURPLE'];

	var palette = $('#colors');
	$.each(colors, function(index, color) {
		var swatch =  $('<li>').addClass('swatch');
		swatch.css('background-color', color);
		swatch.appendTo(palette);
	});
}

function setDefaultBehavior() {
	document.body.addEventListener('touchmove', function(event) {
  		event.preventDefault();
  		event.returnValue = false;
	}, false); 
}

// Credit: http://www.html5canvastutorials.com/advanced/html5-canvas-mouse-coordinates/
function getMousePosition(event) {
	var rect = canvas.getBoundingClientRect();
	return {
		x: Math.round((event.center.x-rect.left)/(rect.right-rect.left)*canvas.width),
		y: Math.round((event.center.y-rect.top)/(rect.bottom-rect.top)*canvas.height)
	};
}

/* Event handlers for mouse control
function mouseLogic() {
	var startingPosition;
	var endingPosition;
	$(canvas)
		.mousedown(function(event) {
			startingPosition = getMousePosition(event);
			if (tool == 0) {
				freeDraw($(this), startingPosition, endingPosition);
			}
		})
		.mouseup(function(event) {
			endingPosition = getMousePosition(event);
			drawShape(startingPosition, endingPosition);
			endingPosition = null;
			$(this).unbind('mousemove');
		});
}
*/

/* Test code
function panelControl() {
	if (smallScreen) {
		var selection;
		$(window).click(function(event) {
			if (event.clientX > window.innerWidth - 40) {
				selection = $('#color-selection');
				animateColorSelection(selection, false);
			} else if (event.clientX < 40) {
				selection = $('#controls');
				animateToolbox(selection, false);
			}
		});
		$('.swatch').click(function() {
			animateColorSelection(selection, true);
		});
		$('.draw-tool').click(function() {
			animateToolbox(selection, true);
		});
	}	
}
*/