/**
 *	Touch
 *	---------
 *	name: Touch
 *
 *	Author Mient-jan Stelling <mientjan.stelling@gmail.com>
 *	
 *	Got Object.prototype.hasOwnProperty from 
 *	John Resig on http://stackoverflow.com/questions/135448/how-do-i-check-to-see-if-an-object-has-an-attribute-in-javascript
 *	
 *	@needs rewrite
 **/

/*
 * @class Touch
 * @param DomElement el
 * @param Object events
 * @param Object options
 * @return Touch
 *
 * @example
 *	var t = new Touch(document.body, {
 *		'tap':function(e){},
 *		'touchstart':function(e){},
 *		'touchmove':function(e){},
 *		'touchend':function(e){},
 *		'dblTap':function(e){},
 *		'swipeUp':function(e){},
 *		'swipeDown':function(e){},
 *		'swipeLeft':function(e){},
 *		'swipeRight':function(e){}
 
 *		'swiping':function(e){},
 *		'swipingUp':function(e){},
 *		'swipingDown':function(e){},
 *		'swipingLeft':function(e){},
 *		'swipingRight':function(e){}

 *	}, {preventDefault:true, useSwipe:true });
 */

 // adding hasOwnProperty if not available
if ( !Object.prototype.hasOwnProperty ) {
	Object.prototype.hasOwnProperty = function(prop){
		var proto = this.__proto__ || this.constructor.prototype;
		return (prop in this) &&
			(!(prop in proto) || proto[prop] !== this[prop]);
	}
}

 
var Touch = function(el, events, options){
	
	this.el = el;
	this.touchable = true;

	this.events = new Object();
	if( events ){
		this.events = events;
	}
	
	this.options = {
		preventDefault:true,
		useSwipe:false
	};
	
	if( options ){
		for( var k in options ){
			if( this.options[k] != undefined ){
				this.options[k] = options[k];	
			}
		}
	}
	
	this.bindEvent();
};

Touch.prototype.deligateEvent = function(t,e,d){
	if( this.events.hasOwnProperty(t) ){
		this.events[t].call(this,e,d);
	}
};
	
Touch.prototype.handleEvent = function(e){
	if(e.type == 'touchmove'){
		// Touch.pos_move_x = e.targetTouches[0].clientX;
		// Touch.pos_move_y = e.targetTouches[0].clientY;
		Touch.move_v = new Vector2(e.targetTouches[0].clientX, e.targetTouches[0].clientY );
		
		if( this.options.preventDefault ){
			e.preventDefault();
		}
		
		Touch.move_t = e.timeStamp;
		Touch.moved = true
		this.onTouchMove(e);			
	} else if (e.type == 'touchstart'){
		if( !this.touchable ){
			return;
		}

		Touch.moved = false;
		Touch.start_t = e.timeStamp;
		Touch.start_e = e;
		Touch.start_v = new Vector2(e.targetTouches[0].clientX, e.targetTouches[0].clientY );

		// Touch.pos_start_x = e.targetTouches[0].clientX;
		// Touch.pos_start_y = e.targetTouches[0].clientY;
		this.onTouchStart(e);
	} else if (e.type == 'touchend') {
		Touch.pos_end_x = Touch.pos_move_x;
		Touch.pos_end_y = Touch.pos_move_y;
		this.onTouchEnd(e);
	}
	
	this.deligateEvent(e.type, e);
};

Touch.prototype.onTouchStart = function(e){
	// e.preventDefault();
	this.el.addEventListener('touchmove', this, false);
	this.el.addEventListener('touchend', this, false);
};

Touch.prototype.onTouchMove = function(e){
	
	if( this.options.useSwipe ) {

		// detect sweep
		if( Math.abs(Touch.start_v.x)>50 || Math.abs(Touch.start_v.y)>50 ){
			var d = Touch.start_v.degre(Touch.move_v);
			this.deligateEvent('swiping', [e,d]);
			
			if(d>=70&&d<=110){ // swipeDown
				this.deligateEvent('swipingDown', [e,d]);
			} else if(d>=160&&d<=200){ // swipingDown
				this.deligateEvent('swipingLeft', [e,d]);
			} else if(d>=340 || d<=20){ // swipingLeft
				this.deligateEvent('swipingRight', [e,d]);
			} else if(d>=250&&d<=290){ // swipingUp
				this.deligateEvent('swipingUp', [e,d]);
			}
		}
	}
	
	this.deligateEvent('move', e);
};

Touch.prototype.onTouchEnd = function(e){
	
	// fire click event
	if( !Touch.moved ){
		if( (e.timeStamp - Touch.click_t) < 200 ){
			this.deligateEvent('dblTap', Touch.start_e);
		} else {
			e.preventDefault(false);
			Touch.click_t = e.timeStamp;
			this.deligateEvent('tap', Touch.start_e);
		}
	} else if( this.options.useSwipe ) {

		// detect sweep
		if( ( Math.abs(Touch.start_v.x)>50 || Math.abs(Touch.start_v.y)>50 )
			&& ( Touch.move_t - Touch.start_t ) < 400 ){
			var d = Touch.start_v.degre(Touch.move_v);
			if(d>=70&&d<=110){ // swipeDown
				this.deligateEvent('swipeDown', [Touch.start_e,d]);
			} else if(d>=160&&d<=200){ // swipeLeft
				this.deligateEvent('swipeLeft', [Touch.start_e,d]);
			} else if(d>=340 || d<=20){ // swipeRight
				this.deligateEvent('swipeRight', [Touch.start_e,d]);
			} else if(d>=250&&d<=290){ // swipeUp
				this.deligateEvent('swipeUp', [Touch.start_e,d]);
			}
		}
	}
	
	this.resetEvents();
};

/*
this.webkitTransitionEnd = function(){
	Site.Const.currentlayer.removeEventListener("webkitTransitionEnd", this, false);
	Site.Const.currentlayer.style.webkitTransition = '';
	Site.Const.currentlayer.style.webkitTransitionDuration = '0';
	// Site.Const.currentlayer.
}
*/
Touch.prototype.resetEvents = function(){
	this.el.removeEventListener("touchmove", this, false);
	this.el.removeEventListener("touchend", this, false);
}

Touch.prototype.preventTouch = function(t){
	this.touchable = false;
	(function(){this.touchable = true;}.bind(this)).delay(t);
}

Touch.prototype.stopTouch = function(t){
	this.touchable = false;
}

Touch.prototype.startTouch = function(t){
	this.touchable = true;
}

Touch.prototype.bindEvent = function(){
	this.el.addEventListener('touchstart', this, false);
}

/*
Touch.getVector = function(x,y,x1,y1){
	return {'x':x1-x,'y':y1-y};
};

Touch.getAngle = function(x,y){ 
	return Math.atan2(y, x); 
};
	
Touch.getDegre = function(a){
	return (a*(180/Math.PI))+180;	
};
*/
Touch.moved = false;
Touch.click_t = 0;
Touch.start_t = 0;
Touch.start_e = null;
Touch.start_v = null;
Touch.pos_start_x = 0;
Touch.pos_start_y = 0;
Touch.move_t = 0;
Touch.pos_move_x = 0;
Touch.pos_move_y = 0;
Touch.pos_move_v = null;
Touch.move_v = null;

/**
 *	Vector2
 *	---------
 *
 *	author Mient-jan Stelling <mientjan.stelling@gmail.com>
 **/
	
function Vector2(x,y)
{
	this.x = x;
	this.y = y;
}

Vector2.prototype.toString = function()
{
	return '(' + this.x + ', ' + this.y + ')';
}
	
// calls a trace of toString
Vector2.prototype.dump = function()
{
	console.log(this.toString());
}
	
	//----- these functions return Vector2s -----
	
Vector2.prototype.clone = function()
{
	var v = new Vector2(this.x, this.y);
	return v;
}
	
Vector2.prototype.plus = function(v2)
{
	var v = new Vector2( this.x + v2.x, this.y + v2.y)
	return v;
}
	
	//return this-v2
Vector2.prototype.minus = function(v2)
{
	var v = new Vector2( this.x - v2.x, this.y - v2.y)
	return v;
}

/**
 * @author Mient-jan Stelling
 * @arguments Vector2 v
 * @return float
 */
Vector2.prototype.degre = function(v2){
	var v = this.minus(v2);
	var a = Math.atan2(v.y, v.x);
	return (a*(180/Math.PI))+180;
};

//return the righthand normal of this (using flash's coordinate system)
Vector2.prototype.normR = function()
{
	var v = new Vector2( this.y * -1, this.x);
	return v;	
}
	
//return the leftHand normal of this (using flash's coordinate system)
Vector2.prototype.normL = function()
{
	var v = new Vector2( this.y,  -1 * this.x);
	return v;	
}
	
//return the (unit) direction vector of this
Vector2.prototype.dir = function()
{
	var v = this.clone();
	v.normalize();
	return v;
}
	
	//return this projected _onto_ v2
Vector2.prototype.proj = function(v2){
	var den = v2.dot(v2);	
	if(den == 0)
	{
		//zero-length v2
		console.log("WARNING! Vector2.proj() was given a zero-length projection vector!");
		return this.clone();//not sure how to gracefully recover but, hopefully this will be okay
	}
	else
	{
		var v = v2.clone();
		v.mult(this.dot(v2)/den);
		return v;
	}
}

//----- these functions return scalars -----

//return the magnitude (absval) of this projected onto v2
Vector2.prototype.projLen = function(v2){
	var den = v2.dot(v2);
	if(den == 0)
	{
		//zero-length v2
		console.log("WARNING! Vector2.projLen() was given a zero-length projection vector!");
		return 0;
	}
	else
	{
		return Math.abs(this.dot(v2)/v2.len());
	}
}

//return the dotprod of this and v2
Vector2.prototype.dot = function(v2){
	return ((this.x * v2.x) + (this.y * v2.y));
}

//return the crossprod of this and v2
//note that this is equivalent to the dotprod of this and the lefthand normal of v2
Vector2.prototype.cross = function(v2){
	return ((this.x * v2.y) - (this.y * v2.x));
}

///return the length of this
Vector2.prototype.len = function()
{
	return (Math.sqrt((this.x*this.x) + (this.y*this.y)));
}

///return the angle of the vector
Vector2.prototype.angle = function(v2){
	return (Math.acos((this.dot(v2))/(this.len()*v2.len()))/Math.PI * 180);
}

//----- these functions return nothing (they operate on this) -----

//change this to a duplicate of v2
Vector2.prototype.copy = function(v2)
{
	this.x = v2.x;
	this.y = v2.y;
}

//multiply this by a scalar s
Vector2.prototype.mult = function(s)
{
	this.x *= s;
	this.y *= s;
}

//convert this vector to a unit/direction vector
Vector2.prototype.normalize = function()
{
	var L = this.len();
	if(L != 0)
	{
		this.x /= L;
		this.y /= L;	
	}
	else
	{
		console.log("WARNING! Vector2.normalize() was called on a zero-length vector!");
	}
}

//add v2 to this
Vector2.prototype.pluseq = function(v2) {
	this.x += v2.x;
	this.y += v2.y;
}

//subtract v2 from this
Vector2.prototype.minuseq = function(v2) {
	this.x -= v2.x;
	this.y -= v2.y;
}

Vector2.prototype.topLeft = function(v2){
	var x	= Math.min(this.x, v2.x);
	var y	= Math.min(this.y, v2.y);
	
	return new Vector2(x, y);
}

Vector2.prototype.topRight = function(v2){
	var x	= Math.max(this.x, v2.x);
	var y	= Math.min(this.y, v2.y);
	
	return new Vector2(x, y);
}

Vector2.prototype.bottomRight = function(v2){
	var x	= Math.max(this.x, v2.x);
	var y	= Math.max(this.y, v2.y);
	
	return new Vector2(x, y);
}

Vector2.prototype.bottomLeft = function(v2){
	var x	= Math.min(this.x, v2.x);
	var y	= Math.max(this.y, v2.y);
	
	return new Vector2(x, y);
}