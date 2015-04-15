/***************************************************************************************\
|	Sources: 																																|
|	http://www.13thparallel.org/archive/bezier-curves/																		|
|	http://www.purplemath.com/modules/distform.htm 																				|
|	http://www.bbc.co.uk/schools/gcsebitesize/maths/geometry/trigonometryrev2.shtml				|
|																																												|
\***************************************************************************************/

function Coords (x, y) {
	if (!x) {
		this.x = 0;
	}

	if (!y) {
		this.y = 0;
	}

	this.x = x;
	this.y = y;
}

//TODO GIVE OWN FILE :) REFACTOR INIT
function QuadraticBezier (c1, c2, c3) {
	var _this = this;

	this.length = 0;
	this.multiplier = 1.1;
	this.points = {};
	this.c1 = c1;
	this.c2 = c2;
	this.c3 = c3;
	this.numberPoints;

	function init () {
		_this.numberPoints = (this.c3.x - this.c1.x) * 2;
		var percent;
		var point;
		for (var i=0; i < _this.numberPoints + 1; i++) {
			percent = i / _this.numberPoints;
			point = _this.getPoint(percent);
			_this.points['point' + i] = {};
			_this.points['point' + i].x = point.x;
			_this.points['point' + i].y = point.y;
			_this.points['point' + i].angle = _this.getAngle(percent);
			if (i > 0) {
				_this.length += _this.getLength(_this.points['point' + (i-1)], _this.points['point' + i]);
			}
		}
	};

	init();
};

QuadraticBezier.prototype.b1 = function(t) {
	return t*t;
};

QuadraticBezier.prototype.b2 = function(t) {
	return (2 * t) * (1 - t);
};

QuadraticBezier.prototype.b3 = function(t) {
	return (1 - t) * (1 - t);
};

QuadraticBezier.prototype.setCoords = function(c1, c2, c3) {
	this.c1 = c1;
	this.c2 = c2;
	this.c3 = c3;
};

QuadraticBezier.prototype.getPoint = function(t) {
	var point = new Coords();
	point.x = this.c1.x * this.b1(t) + this.c2.x * this.b2(t) + this.c3.x * this.b3(t);
	point.y = this.c1.y * this.b1(t) + this.c2.y * this.b2(t) + this.c3.y * this.b3(t);
	return point;
};

QuadraticBezier.prototype.getAngle = function(t) {
	var tc = 1 - t;
	var dx = (tc * this.c2.x + t * this.c3.x) - (tc * this.c1.x + t * this.c2.x);
	var dy = (tc * this.c2.y + t * this.c3.y) - (tc * this.c1.y + t * this.c2.y);
	var radians = Math.atan2(dy, dx) * -1;
	var degrees = radians * (180/ Math.PI);
	var skewedDegrees = degrees * this.multiplier;
	return Math.round(skewedDegrees);
};

QuadraticBezier.prototype.getLength = function(c1, c2) {
	var length = Math.sqrt(Math.pow(c2.x - c1.x, 2) + Math.pow(c2.y - c1.y, 2));
	return length;
};

function calcCardPositions () {
	var card = 0;
	var requiredSegmentLength = curve.length / (numberCards + 1);
	var segmentLength = 0;
	for (var i=0; i < curve.numberPoints + 1; i++) {
		if (i > 0) {
			segmentLength += curve.getLength(curve.points['point' + (i-1)], curve.points['point' + i]);
			if (segmentLength >= requiredSegmentLength) {
				hand['card' + card] = curve.points['point' + i];
				hand['card' + card].curvePoint = i;
				card++;
				segmentLength = 0;
			}
		}
	}
}

function addColours () {
	var colourNum = 0;
	var colours = ["red", "blue", "green", "purple", "yellow", "pink", "orange"];
	for (var card in hand) {
		hand[card].colour = colours[colourNum];
		colourNum++;
		if (colourNum > colours.length - 1) {
			colourNum = 0;
		}
	}
}

function initBoard () {
	addCards();
	addHoverCard();
	makeBucketDroppable();
}

function addCards () {
	for (var card in hand) {
		var number = card.slice(4);
		$("#board").append("<div class='container'><div class='card' id="+card+"></div></div>");
		styleContainer(card, number);
		addContainerEventHandlers(card, number);
		makeContainerDraggable(card, number);
		styleCard(card, number);
	}
}

function styleContainer (card, number) {
	$("#"+card).parent().css({
		"left": hand[card].x + "px",
		"top": hand[card].y + "px",
		"transform": "rotate(" + hand[card].angle +"deg)",
		'z-index': number
	});
}

function makeContainerDraggable (card, number) {
	$("#"+card).parent().draggable({
		start: function(){
			$(this).addClass("dragging");
		},
		stop: function(event, ui){
			$(this).removeClass("dragging");
		}
	});
}

function addContainerEventHandlers(card, number){
	$("#"+card).parent().hover(hoverIn, hoverOut);
	$("#"+card).parent().mousedown(mouseDown);
}

function styleCard(card, number) {
	$("#"+card).css({
		"background-color": hand[card].colour,
		'z-index': number
	});
}

function addHoverCard () { 
	$("#board").append("<div class='hovered-card'></div>");
	$(".hovered-card").hide();
}

function makeBucketDroppable () {
	$('.bucket').droppable({
		drop: function(event, ui) {
			ui.draggable.addClass('dragging');
	        ui.draggable.addClass('dropped');
	    }
	});
}

//setting up the view
var c1 = new Coords(50, 350);
var c2 = new Coords(450, 50);
var c3 = new Coords(850, 350);

/*things that should be objects:
 * each card (consisting of container and actual card)
 * the board
 * the bucket
 * the hand
 */
 
var curve = new QuadraticBezier(c1, c2, c3);

//given by api. api gives an array of cards I guess, then we get the length.
var numberCards = 52; 
var hand = {};

calcCardPositions();
addColours();
initBoard();

function hoverIn () {
	var card = $(this).find(".card").hide().attr("id");
	$(".hovered-card").show().css({
		"left": hand[card].x - 20 + "px",
		"top": hand[card].y - 100 + "px",
		"background-color": hand[card].colour
	});
}

function hoverOut () {
	$(this).find(".card").show();
	$(".hovered-card").hide();
}

function mouseDown () {
	$(this).find(".card").show();
	$(this).unbind('mouseenter mouseleave');
	$(".hovered-card").hide();
}