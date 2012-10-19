/**
 *	Vector2
 *	---------
 *
 *	author Mient-jan Stelling <mientjan.stelling@gmail.com>
 **/

class Vector2 {
	constructor (public x: number, public y: number) {

	}

	toString(): string {
		return '(' + this.x + ', ' + this.y + ')';
	}

	dump(): void {
		console.log(this.toString());
	}

	clone(): Vector2 {
		return new Vector2(this.x, this.y);
	}

	plus(v2: Vector2): Vector2 {
		return new Vector2(this.x + v2.x, this.y + v2.y)
	}

	//return this-v2
	minus(v2: Vector2): Vector2 {
		return new Vector2(this.x - v2.x, this.y - v2.y)
	}

	/**
	 * @author Mient-jan Stelling
	 * @arguments Vector2 v
	 * @return float
	 */
	degre(v2: Vector2): number {
		var v = this.minus(v2);
		var a = Math.atan2(v.y, v.x);
		return (a * (180 / Math.PI)) + 180;
	};

		//return the righthand normal of this (using flash's coordinate system)
	normR(): Vector2 {
		return new Vector2(this.y * -1, this.x);
	}

	//return the leftHand normal of this (using flash's coordinate system)
	normL(): Vector2 {
		var v = new Vector2(this.y, -1 * this.x);
		return v;
	}

	//return the (unit) direction vector of this
	dir(): Vector2 {
		var v = this.clone();
		v.normalize();
		return v;
	}

	//return this projected _onto_ v2
	proj(v2): Vector2 {
		var den = v2.dot(v2);
		if (den == 0) {
			//zero-length v2
			console.log("WARNING! Vector2.proj() was given a zero-length projection vector!");
			return this.clone();//not sure how to gracefully recover but, hopefully this will be okay
		}
		else {
			var v = v2.clone();
			v.mult(this.dot(v2) / den);
			return v;
		}
	}

	//----- these functions return scalars -----

	//return the magnitude (absval) of this projected onto v2
	projLen(v2): number {
		var den = v2.dot(v2);
		if (den == 0) {
			//zero-length v2
			console.log("WARNING! Vector2.projLen() was given a zero-length projection vector!");
			return 0;
		}
		else {
			return Math.abs(this.dot(v2) / v2.len());
		}
	}

	//return the dotprod of this and v2
	dot(v2): number {
		return ((this.x * v2.x) + (this.y * v2.y));
	}

	//return the crossprod of this and v2
	//note that this is equivalent to the dotprod of this and the lefthand normal of v2
	cross(v2): number {
		return ((this.x * v2.y) - (this.y * v2.x));
	}

	///return the length of this
	len(): number {
		return (Math.sqrt((this.x * this.x) + (this.y * this.y)));
	}

	///return the angle of the vector
	angle(v2): number {
		return (Math.acos((this.dot(v2)) / (this.len() * v2.len())) / Math.PI * 180);
	}

	//----- these functions return nothing (they operate on this) -----

	//change this to a duplicate of v2
	copy(v2): void {
		this.x = v2.x;
		this.y = v2.y;
	}

	//multiply this by a scalar s
	mult(s): void {
		this.x *= s;
		this.y *= s;
	}

	//convert this vector to a unit/direction vector
	normalize(): void {
		var L = this.len();
		if (L != 0) {
			this.x /= L;
			this.y /= L;
		}
		else {
			console.log("WARNING! Vector2.normalize() was called on a zero-length vector!");
		}
	}

	//add v2 to this
	pluseq(v2: Vector2): void {
		this.x += v2.x;
		this.y += v2.y;
	}

	//subtract v2 from this
	minuseq(v2: Vector2): void {
		this.x -= v2.x;
		this.y -= v2.y;
	}

	topLeft(v2: Vector2): Vector2 {
		var x = Math.min(this.x, v2.x);
		var y = Math.min(this.y, v2.y);

		return new Vector2(x, y);
	}

	topRight(v2: Vector2): Vector2 {
		var x = Math.max(this.x, v2.x);
		var y = Math.min(this.y, v2.y);

		return new Vector2(x, y);
	}

	bottomRight(v2: Vector2): Vector2 {
		var x = Math.max(this.x, v2.x);
		var y = Math.max(this.y, v2.y);

		return new Vector2(x, y);
	}

	bottomLeft(v2: Vector2): Vector2 {
		var x = Math.min(this.x, v2.x);
		var y = Math.max(this.y, v2.y);

		return new Vector2(x, y);
	}
}
