function Coords(x, y){
	if(!x){
		this.x = 0;
	}
	if(!y){
		this.y = 0;
	}
	this.x = x;
	this.y = y;
}

function QuadraticBezier(c1, c2, c3){
	this.multiplier = 1.1;
	this.c1 = c1;
	this.c2 = c2;
	this.c3 = c3;
	this.b1 = function(t){
		return t*t;
	};
	this.b2 = function(t){
		return (2 * t) * (1 - t);
	};
	this.b3 = function(t){
		return (1 - t) * (1 - t);
	};
	this.setCoords = function(c1, c2, c3){
		this.c1 = c1;
		this.c2 = c2;
		this.c3 = c3;
	};
	this.getPoint = function(t){
		var point = new Coords();
		point.x = this.c1.x * this.b1(t) + this.c2.x * this.b2(t) + this.c3.x * this.b3(t);
		point.y = this.c1.y * this.b1(t) + this.c2.y * this.b2(t) + this.c3.y * this.b3(t);
		return point;
	};
	this.getAngle = function(t){
		var tc = 1 - t;
		var dx = (tc * this.c2.x + t * this.c3.x) - (tc * this.c1.x + t * this.c2.x);
		var dy = (tc * this.c2.y + t * this.c3.y) - (tc * this.c1.y + t * this.c2.y);
		var radians = Math.atan2(dy, dx) * -1;
		var degrees = radians * (180/ Math.PI);
		var skewedDegrees = degrees * this.multiplier;
		return Math.round(skewedDegrees);
	}
}

function plotPoints(){
	for(var point in hand) {
		$("#board").append("<div class='point' id="+point+"></div>");
		$("#"+point).css({
			"left": hand[point].x + "px",
			"top": hand[point].y + "px",
			"transform": "rotate(" + hand[point].angle +"deg)"
		});
	}
}

var c1 = new Coords(50, 500);
var c2 = new Coords(450, 0);
var c3 = new Coords(850, 500);

var curve = new QuadraticBezier(c1, c2, c3);

var hand = {};

var numberCards = 10;

for(var i=0; i < numberCards + 1; i++){
	var percent = i / numberCards;
	var position = curve.getPoint(percent);
	hand['position' + i] = {};
	hand['position' + i].x = position.x;
	hand['position' + i].y = position.y;
	hand['position' + i].angle = curve.getAngle(percent);
}

console.log(JSON.stringify(hand, 0, 2));

plotPoints();
