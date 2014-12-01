"use strict";

var canvas;
var ctx;

$(function() {
	setupPalette();

	canvas = document.getElementById('canvas');
	ctx = canvas.getContext("2d");

	$('.swatch').click(function() {
		changeColor($(this).css('background-color'));
		drawRectangle(50,100,25,75);
	});
	
	
});

function changeColor(color) {
	ctx.fillStyle = color;
}

function drawRectangle(x1Coord, y1Coord, x2Coord, y2Coord) {
	var xCoord = (x1Coord < x2Coord) ? x1Coord : x2Coord;
	var yCoord = (y1Coord < y2Coord) ? y1Coord : y2Coord;
	var width = Math.abs(x2Coord - x1Coord);
	var height = Math.abs(y2Coord - y1Coord);
	ctx.fillRect(xCoord, yCoord, width, height);
}

function drawCircle() {

}

function drawLine() {

}

function freeDraw() {

}

function clearCanvas() {

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


		//var item = $('<li>');
		//var name = $('<p>').text(color);
		//item.append(swatch);
		//item.append(name);