/**
 *	Touch
 *	---------
 *	name: Touch
 *	license: GNU LESSER GENERAL PUBLIC LICENSE 
 * 		http://www.gnu.org/licenses/lgpl-3.0.txt
 *
 *	Author Mient-jan Stelling <mientjan.stelling@gmail.com>
 *	Copyright (c) 2006-2010 MediaMonks B.V.
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
		
		Touch.move_t = e.timeStamp;
		Touch.moved = true
		this.onTouchMove(e);			
	} else if (e.type == 'touchstart'){
		if( !this.touchable ){
			return;
		}

		if( this.options.preventDefault ){
			e.preventDefault();
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