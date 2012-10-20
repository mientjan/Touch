var Vector2 = (function () {
    function Vector2(x, y) {
        this.x = x;
        this.y = y;
    }
    Vector2.prototype.toString = function () {
        return '(' + this.x + ', ' + this.y + ')';
    };
    Vector2.prototype.dump = function () {
        console.log(this.toString());
    };
    Vector2.prototype.clone = function () {
        return new Vector2(this.x, this.y);
    };
    Vector2.prototype.plus = function (v2) {
        return new Vector2(this.x + v2.x, this.y + v2.y);
    };
    Vector2.prototype.minus = function (v2) {
        return new Vector2(this.x - v2.x, this.y - v2.y);
    };
    Vector2.prototype.degre = function (v2) {
        var v = this.minus(v2);
        var a = Math.atan2(v.y, v.x);
        return (a * (180 / Math.PI)) + 180;
    };
    Vector2.prototype.normR = function () {
        return new Vector2(this.y * -1, this.x);
    };
    Vector2.prototype.normL = function () {
        var v = new Vector2(this.y, -1 * this.x);
        return v;
    };
    Vector2.prototype.dir = function () {
        var v = this.clone();
        v.normalize();
        return v;
    };
    Vector2.prototype.proj = function (v2) {
        var den = v2.dot(v2);
        if(den == 0) {
            console.log("WARNING! Vector2.proj() was given a zero-length projection vector!");
            return this.clone();
        } else {
            var v = v2.clone();
            v.mult(this.dot(v2) / den);
            return v;
        }
    };
    Vector2.prototype.projLen = function (v2) {
        var den = v2.dot(v2);
        if(den == 0) {
            console.log("WARNING! Vector2.projLen() was given a zero-length projection vector!");
            return 0;
        } else {
            return Math.abs(this.dot(v2) / v2.len());
        }
    };
    Vector2.prototype.dot = function (v2) {
        return ((this.x * v2.x) + (this.y * v2.y));
    };
    Vector2.prototype.cross = function (v2) {
        return ((this.x * v2.y) - (this.y * v2.x));
    };
    Vector2.prototype.len = function () {
        return (Math.sqrt((this.x * this.x) + (this.y * this.y)));
    };
    Vector2.prototype.angle = function (v2) {
        return (Math.acos((this.dot(v2)) / (this.len() * v2.len())) / Math.PI * 180);
    };
    Vector2.prototype.copy = function (v2) {
        this.x = v2.x;
        this.y = v2.y;
    };
    Vector2.prototype.mult = function (s) {
        this.x *= s;
        this.y *= s;
    };
    Vector2.prototype.normalize = function () {
        var L = this.len();
        if(L != 0) {
            this.x /= L;
            this.y /= L;
        } else {
            console.log("WARNING! Vector2.normalize() was called on a zero-length vector!");
        }
    };
    Vector2.prototype.pluseq = function (v2) {
        this.x += v2.x;
        this.y += v2.y;
    };
    Vector2.prototype.minuseq = function (v2) {
        this.x -= v2.x;
        this.y -= v2.y;
    };
    Vector2.prototype.topLeft = function (v2) {
        var x = Math.min(this.x, v2.x);
        var y = Math.min(this.y, v2.y);
        return new Vector2(x, y);
    };
    Vector2.prototype.topRight = function (v2) {
        var x = Math.max(this.x, v2.x);
        var y = Math.min(this.y, v2.y);
        return new Vector2(x, y);
    };
    Vector2.prototype.bottomRight = function (v2) {
        var x = Math.max(this.x, v2.x);
        var y = Math.max(this.y, v2.y);
        return new Vector2(x, y);
    };
    Vector2.prototype.bottomLeft = function (v2) {
        var x = Math.min(this.x, v2.x);
        var y = Math.max(this.y, v2.y);
        return new Vector2(x, y);
    };
    return Vector2;
})();
