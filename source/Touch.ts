/// <reference path="Vector2.ts" />

// fix for wrong signature in EventTarget interface in TypeScript. 
interface EventTarget {
	removeEventListener(type: string, listener: { handleEvent: Function; }, useCapture?: bool): void;
	removeEventListener(type: string, listener: Function, useCapture?: bool): void;

	addEventListener(type: string, listener: { handleEvent: Function; }, useCapture?: bool): void;
	addEventListener(type: string, listener: Function, useCapture?: bool): void;

	dispatchEvent(evt: Event): bool;
}

interface TouchEvents {
	tap: (e: MouseEvent) => void;
	touchstart: (e: MouseEvent) => void;
	touchmove: (e: MouseEvent) => void;
	touchend: (e: MouseEvent) => void;
	dblTap: (e: MouseEvent) => void;
	swipeUp: (e: MouseEvent) => void;
	swipeDown: (e: MouseEvent) => void;
	swipeLeft: (e: MouseEvent) => void;
	swipeRight: (e: MouseEvent) => void;
	swiping: (e: MouseEvent, delta: number) => void;
	swipingUp: (e: MouseEvent, delta: number) => void;
	swipingDown: (e: MouseEvent, delta: number) => void;
	swipingLeft: (e: MouseEvent, delta: number) => void;
	swipingRight: (e: MouseEvent, delta: number) => void;
}

interface TouchVector {
	start: Vector2;
	move: Vector2;
	end: Vector2;
}


interface TouchTime {
	start: number;
	move: number;
	end: number;
}

interface TouchEvent {
	start: MouseEvent;
	move: MouseEvent;
	end: MouseEvent;
}

class Touch {

	static vector: TouchVector;
	static time: TouchTime;
	static event: TouchEvent;

	private _touchable: bool = false;
	private _moved: bool = false;
	private _clickTime: number = 0;
	private _startEvent: MouseEvent = null;

	constructor (public el: Element, public events: TouchEvents,
		public options?: { preventDefault?: bool; }) {
	}

	handleEvent(e: MouseEvent) {
		if (e.type == 'touchmove') {
			if (this.options.preventDefault) {
				e.preventDefault();
			}

			this.onTouchMove(e);
		} else if (e.type == 'touchstart') {

			this.onTouchStart(e);
		} else if (e.type == 'touchend') {
			this.onTouchEnd(e);
		}

	}

	deligateEvent(name: string, event: MouseEvent, delta?: number) {
		if (this.events.hasOwnProperty(name)) {
			this.events[name].call(this, name, event, delta);
		}
	}

	onTouchStart(e: MouseEvent) {
		this.el.addEventListener('touchmove', this, false);
		this.el.addEventListener('touchend', this, false);
	}

	onTouchMove(e: MouseEvent) {


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

	onTouchEnd(e: MouseEvent) {

		// fire click event
		if (!this._moved) {
			if ((e.timeStamp - this._clickTime) < 200) {
				this.deligateEvent('dblTap', this._startEvent);
			} else {
				e.preventDefault();
				this._clickTime = e.timeStamp;
				this.deligateEvent('tap', this._startEvent );
			}
		} 

		// detect sweep
		if ((Math.abs(Touch.vector.start.x) > 50 || Math.abs(Touch.vector.start.y) > 50)
			&& (Touch.time.move - Touch.time.start) < 400)
		{
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