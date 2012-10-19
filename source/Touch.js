var Touch = (function () {
    function Touch(el, events, options) {
        this.el = el;
        this.events = events;
        this.options = options;
        this._touchable = false;
        this._moved = false;
        Touch.vector.s;
    }
    Touch.vector = null;
    Touch.time = null;
    Touch.prototype.handleEvent = function (e) {
        if(e.type == 'touchmove') {
            if(this.options.preventDefault) {
                e.preventDefault();
            }
            this.onTouchMove(e);
        } else {
            if(e.type == 'touchstart') {
                this.onTouchStart(e);
            } else {
                if(e.type == 'touchend') {
                    this.onTouchEnd(e);
                }
            }
        }
    };
    Touch.prototype.deligateEvent = function (name, event, delta) {
        if(this.events.hasOwnProperty(name)) {
            this.events[name].call(this, name, event, delta);
        }
    };
    Touch.prototype.onTouchStart = function (e) {
        this.el.addEventListener('touchmove', this, false);
        this.el.addEventListener('touchend', this, false);
    };
    Touch.prototype.onTouchMove = function (e) {
        this.deligateEvent('move', e);
    };
    Touch.prototype.onTouchEnd = function (e) {
        this.resetEvents();
    };
    Touch.prototype.resetEvents = function () {
        this.el.removeEventListener('touchmove', this, false);
        this.el.removeEventListener('touchend', this, false);
    };
    Touch.prototype.preventTouch = function (t) {
        this._touchable = false;
    };
    Touch.prototype.stopTouch = function (t) {
        this._touchable = false;
    };
    Touch.prototype.startTouch = function (t) {
        this._touchable = true;
    };
    Touch.prototype.bindEvent = function () {
        this.el.addEventListener('touchstart', this, false);
    };
    return Touch;
})();
