/***************************************************************************************\
|	Sources: 																																							|
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

//TODO GIVE OWN FILE :)
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
		_this.numberPoints = this.c3.x - this.c1.x;
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

function positionCards () {
	var card = 0;
	var requiredSegmentLength = curve.length / (numberCards + 1);
	var segmentLength = 0;
	var colourNum = 0;
	var colours = ["red", "blue", "green", "purple", "yellow", "pink", "orange"];
	for (var i=0; i < curve.numberPoints + 1; i++) {
		if (i > 0) {
			segmentLength += curve.getLength(curve.points['point' + (i-1)], curve.points['point' + i]);
			if (segmentLength >= requiredSegmentLength) {
				hand['card' + card] = curve.points['point' + i];
				hand['card' + card].curvePoint = i;
				hand['card' + card].colour = colours[colourNum];
				card++;
				colourNum++;
				segmentLength = 0;
				if (colourNum > colours.length - 1) {
					colourNum = 0;
				}
			}
		}
	}
}

//TODO REFACTOR
function positionRightHandCardsOnHover (number) {
	var cardWidth = 100;
	var boundaryCard = hand['card' + (number - 7) ];
	var curvePoint = boundaryCard.curvePoint;
	var subCurveLength = 0;
	for (var i=0; i < curvePoint; i++) {
		if (i > 0) {
			subCurveLength += curve.getLength(curve.points['point' + (i-1)], curve.points['point' + i]);
		}
	}
	console.log("subCurveLength: " + subCurveLength);
	var numberRightHandCards = parseInt(number) + 2;
	console.log("numberRightHandCards: " + numberRightHandCards);
	var requiredSegmentLength = subCurveLength / ( numberRightHandCards );
	console.log("requiredSegmentLength: " + requiredSegmentLength);
	var segmentLength = 0;
	var card = 0;
	for (var i=0; i < curvePoint; i++) {
		if (i > 0) {
			segmentLength += curve.getLength(curve.points['point' + (i-1)], curve.points['point' + i]);
			if (segmentLength >= requiredSegmentLength) {
				hand['card' + card] = curve.points['point' + i];
				card++;
				segmentLength = 0;
			}
		}
	}
}

function renderCards () {
	for (var card in hand) {
		var number = card.slice(4);
		$("#board").append("<div class='card' id="+card+"></div>");
		$("#"+card).css({
			"left": hand[card].x + "px",
			"top": hand[card].y + "px",
			"transform": "rotate(" + hand[card].angle +"deg)",
			"background-color": hand[card].colour,
			'z-index': number
		});
	}

	$('.card').each(function(){
		$(this).hover(hoverIn, hoverOut);
	});
}

//TODO REFACTOR
function rerenderCards () {
	for (var card in hand) {
		var number = card.slice(4);
		$("#"+card).css({
			"left": hand[card].x + "px",
			"top": hand[card].y + "px",
			"transform": "rotate(" + hand[card].angle +"deg)",
			"background-color": hand[card].colour,
			'z-index': number
		});
	}

	$('.card').each(function(){
		$(this).hover(hoverIn, hoverOut);
	});
}

//setting up the view
var c1 = new Coords(50, 350);
var c2 = new Coords(450, 50);
var c3 = new Coords(850, 350);

var curve = new QuadraticBezier(c1, c2, c3);

//given by api. api gives an array of cards I guess, then we get the length.
var numberCards = 52; 
var hand = {};

positionCards();
renderCards();

function hoverIn () {
	/*
	 * Positioning the actual card we're hovering :)
	 */
	var card = $(this).attr('id');
	var number = card.slice(4);

	/*
	 * What about the other cards in the deck?
	 * Cards with a lower number than current card share a smaller fragment of the curve on the right
	 *  * they have a curve that starts where the cards right hand edge is - a width away from its x Coord
	 * Cards with a higher number than current card share a smaller fragment of the curve on the left
	 *  * they have a curve that ends where the left hand edge is - the x Coord
	 */

	 //TODO CLEAN UP FUNCTION NAMES
	 positionRightHandCardsOnHover(number);
	 rerenderCards();

	//distance it moves out
	var movement = 21;

	//angle of card
	var angle = hand[card].angle * -1;

	//convert angle to radians
	var radians = angle * (Math.PI / 180);

	var x = movement * Math.sin(radians);
	var y = movement * Math.cos(radians);

	$(this).css({
		"left": hand[card].x - x + "px",
		"top": hand[card].y - y + "px",
		'z-index': '1000'
	});

}

function hoverOut () {
	var card = $(this).attr('id');
	var number = card.slice(4);
	$(this).css({
		"left": hand[card].x + "px",
		"top": hand[card].y + "px",
		"background-color": hand[card].colour,
		'z-index': number
	});
}
