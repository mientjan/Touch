var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
}
var Touch = (function () {
    function Touch(el, events, options) {
        if (typeof events === "undefined") { events = {
        }; }
        if (typeof options === "undefined") { options = {
        }; }
        this.el = el;
        this.events = events;
        this.options = options;
        this.isTouchable = false;
        this._clickTime = 0;
        this._startEvent = null;
        this._delay = 0;
        this.events = {
        };
    }
    Touch.vector = null;
    Touch.time = null;
    Touch.event = null;
    Touch.hasMoved = false;
    Touch.prototype.handleEvent = function (e) {
        if(e.type == 'touchmove') {
            Touch.vector.move = new Vector2(e.targetTouches[0].clientX, e.targetTouches[0].clientY);
            if(this.options && this.options.preventDefault) {
                e.preventDefault();
            }
            Touch.time.move = e.timeStamp;
            Touch.hasMoved = true;
            this.onTouchMove(e);
        } else {
            if(e.type == 'touchstart') {
                if(!this.isTouchable) {
                    return;
                }
                Touch.hasMoved = false;
                Touch.time.start = e.timeStamp;
                Touch.event.start = e;
                Touch.vector.start = new Vector2(e.targetTouches[0].clientX, e.targetTouches[0].clientY);
                this.onTouchStart(e);
            } else {
                if(e.type == 'touchend') {
                    this.onTouchEnd(e);
                }
            }
        }
        this.deligateEvent(e.type, e);
    };
    Touch.prototype.deligateEvent = function (name, event, delta) {
        if(this.events.hasOwnProperty(name)) {
            this.events[name].call(this, name, event, delta);
        }
    };
    Touch.prototype.setEvent = function (name, fn) {
        this.events[name] = fn;
    };
    Touch.prototype.setEvents = function (events) {
        for(var name in events) {
            if(events.hasOwnProperty(name)) {
                this.eventspname = events[name];
            }
        }
    };
    Touch.prototype.removeEvent = function (name) {
        if(this.events.hasOwnProperty(name)) {
            this.events[name] = null;
        }
    };
    Touch.prototype.onTouchStart = function (e) {
        Touch.event.start = e;
        this.el.addEventListener('touchmove', this, false);
        this.el.addEventListener('touchend', this, false);
    };
    Touch.prototype.onTouchMove = function (e) {
        Touch.event.move = e;
        if(Math.abs(Touch.vector.start.x) > 50 || Math.abs(Touch.vector.start.y) > 50) {
            var d = Touch.vector.start.degre(Touch.vector.move);
            this.deligateEvent('swiping', e);
            if(d >= 70 && d <= 110) {
                this.deligateEvent('swipingDown', e, d);
            } else {
                if(d >= 160 && d <= 200) {
                    this.deligateEvent('swipingLeft', e, d);
                } else {
                    if(d >= 340 || d <= 20) {
                        this.deligateEvent('swipingRight', e, d);
                    } else {
                        if(d >= 250 && d <= 290) {
                            this.deligateEvent('swipingUp', e, d);
                        }
                    }
                }
            }
        }
        this.deligateEvent('move', e);
    };
    Touch.prototype.onTouchEnd = function (e) {
        if(!Touch.hasMoved) {
            if((e.timeStamp - this._clickTime) < 200) {
                this.deligateEvent('dblTap', Touch.event.start);
            } else {
                e.preventDefault();
                this._clickTime = e.timeStamp;
                this.deligateEvent('tap', Touch.event.start);
            }
        }
        if((Math.abs(Touch.vector.start.x) > 50 || Math.abs(Touch.vector.start.y) > 50) && (Touch.time.move - Touch.time.start) < 400) {
            var d = Touch.vector.start.degre(Touch.vector.move);
            if(d >= 70 && d <= 110) {
                this.deligateEvent('swipeDown', Touch.event.start, d);
            } else {
                if(d >= 160 && d <= 200) {
                    this.deligateEvent('swipeLeft', Touch.event.start, d);
                } else {
                    if(d >= 340 || d <= 20) {
                        this.deligateEvent('swipeRight', Touch.event.start, d);
                    } else {
                        if(d >= 250 && d <= 290) {
                            this.deligateEvent('swipeUp', Touch.event.start, d);
                        }
                    }
                }
            }
        }
        this.resetEvents();
    };
    Touch.prototype.resetEvents = function () {
        this.el.removeEventListener('touchmove', this, false);
        this.el.removeEventListener('touchend', this, false);
    };
    Touch.prototype.preventTouch = function (t) {
        var _this = this;
        this.isTouchable = false;
        this._delay = setInterval(function () {
            _this.isTouchable = true;
            clearInterval(_this._delay);
        }, t);
    };
    Touch.prototype.stopTouch = function (t) {
        this.isTouchable = false;
    };
    Touch.prototype.startTouch = function (t) {
        this.isTouchable = true;
    };
    Touch.prototype.bindEvent = function () {
        this.el.addEventListener('touchstart', this, false);
    };
    return Touch;
})();
var TouchScroll = (function (_super) {
    __extends(TouchScroll, _super);
    function TouchScroll(wrapper, holder) {
        _super.call(this, wrapper);
        this.wrapper = wrapper;
        this.holder = holder;
        this.setEvents({
            swipingUp: function (e, delta) {
                console.log(delta);
            },
            swipingDown: function (e, delta) {
            },
            swipingLeft: function (e, delta) {
            },
            swipingRight: function (e, delta) {
            }
        });
    }
    return TouchScroll;
})(Touch);
