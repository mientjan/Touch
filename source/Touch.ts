/// <reference path="Vector2.ts" />
/// <reference path="TouchEvent.d.ts" />

// fix for wrong signature in EventTarget interface in TypeScript. 
interface EventTarget {
	removeEventListener(type: string, listener: { handleEvent: (e: ITouchEvent) => any; }, useCapture?: bool): void;
	removeEventListener(type: string, listener: (e: ITouchEvent) => any, useCapture?: bool): void;

	addEventListener(type: string, listener: { handleEvent: (e: ITouchEvent) => any; }, useCapture?: bool): void;
	addEventListener(type: string, listener: (e: ITouchEvent) => any, useCapture?: bool): void;
}

interface TouchEventOptions {
	tap: (e: ITouchEvent) => void;
	touchstart: (e: ITouchEvent) => void;
	touchmove: (e: ITouchEvent) => void;
	touchend: (e: ITouchEvent) => void;
	dblTap: (e: ITouchEvent) => void;
	swipeUp: (e: ITouchEvent) => void;
	swipeDown: (e: ITouchEvent) => void;
	swipeLeft: (e: ITouchEvent) => void;
	swipeRight: (e: ITouchEvent) => void;
	swiping: (e: ITouchEvent, delta: number) => void;
	swipingUp: (e: ITouchEvent, delta: number) => void;
	swipingDown: (e: ITouchEvent, delta: number) => void;
	swipingLeft: (e: ITouchEvent, delta: number) => void;
	swipingRight: (e: ITouchEvent, delta: number) => void;
}



class Touch {

	static vector: {
		start: Vector2;
		move: Vector2;
		end: Vector2;
	};

	static time: {
		start: number;
		move: number;
		end: number;
	};

	static event: {
		start: ITouchEvent;
		move: ITouchEvent;
		end: ITouchEvent;
	};

	static _moved: bool = false;

	private _touchable: bool = false;

	private _clickTime: number = 0;
	private _startEvent: MouseEvent = null;
	private _delay: number = 0;

	constructor (public el: Element, public events: TouchEventOptions,
	public options?: { preventDefault?: bool; }) {}

	handleEvent(e: ITouchEvent) 
	{
		if (e.type == 'touchmove') {
			Touch.vector.move = new Vector2(e.targetTouches[0].clientX, e.targetTouches[0].clientY);

			if (this.options && this.options.preventDefault) {
				e.preventDefault();
			}

			Touch.time.move = e.timeStamp;
			Touch._moved = true

			this.onTouchMove(e);

		} else if (e.type == 'touchstart') {
			if (!this._touchable) {
				return;
			}

			Touch._moved = false;
			Touch.time.start = e.timeStamp;
			Touch.event.start = e;
			Touch.vector.start = new Vector2(e.targetTouches[0].clientX, e.targetTouches[0].clientY);

			this.onTouchStart(e);
		} else if (e.type == 'touchend') {
			
			this.onTouchEnd(e);
		}

		this.deligateEvent(e.type, e);

	}

	deligateEvent(name: string, event: ITouchEvent, delta?: number) {
		if (this.events.hasOwnProperty(name)) {
			this.events[name].call(this, name, event, delta);
		}
	}

	onTouchStart(e: ITouchEvent) {
		Touch.event.start = e;
		this.el.addEventListener('touchmove', this, false);
		this.el.addEventListener('touchend', this, false);
	}

	onTouchMove(e: ITouchEvent) {
		Touch.event.move = e;

		// detect sweep
		if (Math.abs(Touch.vector.start.x) > 50 || Math.abs(Touch.vector.start.y) > 50) {

			var d = Touch.vector.start.degre(Touch.vector.move);

			this.deligateEvent('swiping', e);

			if (d >= 70 && d <= 110) { // swipeDown
				this.deligateEvent('swipingDown', e, d);
			} else if (d >= 160 && d <= 200) { // swipingDown
				this.deligateEvent('swipingLeft', e, d);
			} else if (d >= 340 || d <= 20) { // swipingLeft
				this.deligateEvent('swipingRight', e, d);
			} else if (d >= 250 && d <= 290) { // swipingUp
				this.deligateEvent('swipingUp', e, d);
			}
		}

		this.deligateEvent('move', e);
	}

	onTouchEnd(e: ITouchEvent) {

		// fire click event
		if (!Touch._moved) {
			if ((e.timeStamp - this._clickTime) < 200) {
				this.deligateEvent('dblTap', Touch.event.start);
			} else {
				e.preventDefault();
				this._clickTime = e.timeStamp;
				this.deligateEvent('tap', Touch.event.start);
			}
		}

		// detect sweep
		if ((Math.abs(Touch.vector.start.x) > 50 || Math.abs(Touch.vector.start.y) > 50)
		&& (Touch.time.move - Touch.time.start) < 400) {
			var d = Touch.vector.start.degre(Touch.vector.move);

			if (d >= 70 && d <= 110) { // swipeDown
				this.deligateEvent('swipeDown', Touch.event.start, d);
			} else if (d >= 160 && d <= 200) { // swipeLeft
				this.deligateEvent('swipeLeft', Touch.event.start, d);
			} else if (d >= 340 || d <= 20) { // swipeRight
				this.deligateEvent('swipeRight', Touch.event.start, d);
			} else if (d >= 250 && d <= 290) { // swipeUp
				this.deligateEvent('swipeUp', Touch.event.start, d);
			}
		}


		this.resetEvents();
	};

	resetEvents() {
		this.el.removeEventListener('touchmove', this, false);
		this.el.removeEventListener('touchend', this, false);
	}

	preventTouch(t) {
		this._touchable = false;

		this._delay = setInterval(() => {
			this._touchable = true;
			clearInterval(this._delay);
		}, t);

		// (function() { this.touchable = true; }.bind(this)).delay(t);
	}

	stopTouch(t) {
		this._touchable = false;
	}

	startTouch(t) {
		this._touchable = true;
	}

	bindEvent() {
		this.el.addEventListener('touchstart', this, false);
	}
}