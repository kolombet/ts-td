
import { IPoint } from './interfaces'

export default class Vec2 {
	/** Constant to convert from radians to degrees */
	public static RAD2DEG: number = 180 / Math.PI;

	/** Zero vector */
	public static Zero: Vec2 = new Vec2;

	/** Epsilon (maximum error for comparisons) */
	public static Epsilon: number = 0.0000001;

	/** Epsilon squared */
	public static EpsilonSqr: number = 0.0000001 * 0.0000001;

	/** number of decimal places to show when using toString() (set this to -1 for default number -> String conversion) */
	public static stringDecimals: number = 4;

	/** @private */
	_x: number;

	/** @private */
	_y: number;

	constructor(x: number = 0, y: number = 0) {
		this._x = x;
		this._y = y;
	}

	/** X component */
	public set x(x: number) {
		this._x = x;
	}

	/** X component */
	public set y(y: number) {
		this._y = y;
	}

	public set(p: IPoint): Vec2 {
		this._x = p.x;
		this._y = p.y;
		return this;
	}

	/** Copies x and y components from passed arguments */
	public setXY(x: number, y: number): Vec2 {
		this._x = x;
		this._y = y;
		return this;
	}

	/** Sets x and y components to 0 */
	public zero(): Vec2 {
		this._x = 0;
		this._y = 0;
		return this;
	}

	/** Length of the vector (can be assigned to) */
	public set length(value: number) {
		let angle: number = Math.atan2(this._y, this._x);
		this._x = Math.cos(angle) * value;
		this._y = Math.sin(angle) * value;
	}

	/** Adds "pos" vector */
	public addSelf(pos: Vec2): Vec2 {
		this._x += pos._x;
		this._y += pos._y;
		return this;
	}

	/** Adds ("x", "y") */
	public addXYSelf(x: number, y: number): Vec2 {
		this._x += x;
		this._y += y;
		return this;
	}

	/** Subtracts "pos" vector */
	public subSelf(pos: Vec2): Vec2 {
		this._x -= pos._x;
		this._y -= pos._y;
		return this;
	}

	/** Subtracts ("x", "y") */
	public subXYSelf(x: number, y: number): Vec2 {
		this._x -= x;
		this._y -= y;
		return this;
	}

	/** Multiplies by "vec" vector */
	public mulSelf(vec: Vec2): Vec2 {
		this._x *= vec._x;
		this._y *= vec._y;
		return this;
	}

	/** Multiplies by ("x", "y") */
	public mulXYSelf(x: number, y: number): Vec2 {
		this._x *= x;
		this._y *= y;
		return this;
	}

	/** Divides by "vec" vector */
	public divSelf(vec: Vec2): Vec2 {
		this._x /= vec._x;
		this._y /= vec._y;
		return this;
	}

	/** Divides by ("x", "y") */
	public divXYSelf(x: number, y: number): Vec2 {
		this._x /= x;
		this._y /= y;
		return this;
	}

	/** Scales by the scalar "s" */
	public scaleSelf(s: number): Vec2 {
		this._x *= s;
		this._y *= s;
		return this;
	}

	/** Normalizes the vector */
	public normalizeSelf(length: number = 1): Vec2 {
		const nf: number = length / Math.sqrt(this._x * this._x + this._y * this._y);
		this._x *= nf;
		this._y *= nf;
		return this;
	}

	/** Sets components converting from polar coords */
	public fromPolarSelf(rads: number, length: number): Vec2 {
		const s: number = Math.sin(rads);
		const c: number = Math.cos(rads);
		this._x = c * length;
		this._y = s * length;

		return this;
	}

	/** Rotates by "rads" radians */
	public rotateSelf(rads: number): Vec2 {
		const s: number = Math.sin(rads);
		const c: number = Math.cos(rads);
		const xr: number = this._x * c - this._y * s;
		this._y = this._x * s + this._y * c;
		this._x = xr;
		return this;
	}

	/** Sets components to be right-perpendicular to this vector */
	public perpRightSelf(): Vec2 {
		const xr: number = this._x;
		this._x = -this._y
		this._y = xr;
		return this;
	}

	/** Sets components to be left-perpendicular to this vector */
	public perpLeftSelf(): Vec2 {
		const xr: number = this._x;
		this._x = this._y
		this._y = -xr;
		return this;
	}

	/** Negates components */
	public flipSelf(): Vec2 {
		this._x = -this._x;
		this._y = -this._y;
		return this;
	}

	/** Clamps this vector to "maxLen" length */
	public clampSelf(maxLen: number): Vec2 {
		let tx: number = this.x;
		let ty: number = this.y;
		let len: number = tx * tx + ty * ty;
		if (len > maxLen * maxLen) {
			len = Math.sqrt(len);
			this.x = (tx / len) * maxLen;
			this.y = (ty / len) * maxLen;
		}
		return this;
	}

	/** Clamps this vector to specified components */
	public clampXYSelf(minX: number, maxX: number, minY: number, maxY: number): Vec2 {
		this._x = Math.max(minX, Math.min(this._x, maxX));
		this._y = Math.max(minY, Math.min(this._y, maxY));
		return this;
	}

	/** Clamps this vector to fit in the specified "rectangle" */
	// public  clampInRectSelf(rectangle:Rectangle):Vec2
	// {
	// 	this._x = Math.max(rectangle.x, Math.min(this._x, rectangle.x + rectangle.width));
	// 	this._y = Math.max(rectangle.y, Math.min(this._y, rectangle.y + rectangle.height));
	// 	return this;
	// }

	/** Vector angle in radians (can be assigned to) */
	public set angle(value: number) {
		let len: number = Math.sqrt(this._x * this._x + this._y * this._y);
		this._x = len * Math.cos(value);
		this._y = len * Math.sin(value);
	}

	/** Rotates using spinor "vec" */
	public rotateSpinorSelf(vec: Vec2): Vec2 {
		const xr: number = this._x * vec._x - this._y * vec._y;
		this._y = this._x * vec._y + this._y * vec._x;
		this._x = xr;
		return this;
	}

	/** Linear interpolation from this vector to "to" vector */
	public lerpSelf(to: Vec2, t: number): Vec2 {
		this._x = this._x + t * (to._x - this._x);
		this._y = this._y + t * (to._y - this._y);
		return this;
	}

	/** Creates a Vec2 from an AS3 KPoint (or any "p" object exposing x, y properties) */
	// public static  fromPoint(p:*):Vec2
	// {
	// 	return new Vec2(p.x, p.y);
	// }

	/** Sets components converting from polar coords (returns a new Vec2) */
	public static fromPolar(rads: number, length: number): Vec2 {
		const s: number = Math.sin(rads);
		const c: number = Math.cos(rads);
		return new Vec2(c * length, s * length);
	}

	/** Swaps vectors */
	public static swap(a: Vec2, b: Vec2) {
		const x: number = a._x;
		const y: number = a._y;
		a._x = b._x;
		a._y = b._y;
		b._x = x;
		b._y = y;
	}

	/** VEC2 CONST */

	/** X component (read-only) */
	public get x(): number {
		// //console.log("getx")
		return this._x;
	}

	/** Y component (read-only) */
	public get y(): number {
		// //console.log("gety")
		return this._y;
	}

	/** Returns a new Vec2, replica of this instance */
	public clone(): Vec2 {
		return new Vec2(this._x, this._y);
	}

	/** Adds "pos" vector (returns a new Vec2) */
	public add(pos: Vec2): Vec2 {
		return new Vec2(this._x + pos._x, this._y + pos._y);
	}

	/** Adds ("x", "y") (returns a new Vec2) */
	public addXY(x: number, y: number): Vec2 {
		return new Vec2(this._x + x, this._y + y);
	}

	/** Subtracts "pos" vector (returns a new Vec2) */
	public sub(pos: Vec2): Vec2 {
		return new Vec2(this._x - pos._x, this._y - pos._y);
	}

	/** Subtracts ("x", "y") (returns a new Vec2) */
	public subXY(x: number, y: number): Vec2 {
		return new Vec2(this._x - x, this._y - y);
	}

	/** Multiplies by "vec" vector (returns a new Vec2) */
	public mul(vec: Vec2): Vec2 {
		return new Vec2(this._x * vec._x, this._y * vec._y);
	}

	/** Multiplies by ("x", "y") (returns a new Vec2) */
	public mulXY(x: number, y: number): Vec2 {
		return new Vec2(this._x * x, this._y * y);
	}

	/** Divides by "vec" vector (returns a new Vec2) */
	public div(vec: Vec2): Vec2 {
		return new Vec2(this._x / vec._x, this._y / vec._y);
	}

	/** Divides by ("x", "y") (returns a new Vec2) */
	public divXY(x: number, y: number): Vec2 {
		return new Vec2(this._x / x, this._y / y);
	}

	/** Scales by the scalar "s" (returns a new Vec2) */
	public scale(s: number): Vec2 {
		return new Vec2(this._x * s, this._y * s);
	}

	/** Normalizes the vector (returns a new Vec2) */
	public normalize(length: number = 1): Vec2 {
		const nf: number = length / Math.sqrt(this._x * this._x + this._y * this._y);
		return new Vec2(this._x * nf, this._y * nf);
	}

	/** Computes the length of the vector */
	public get length(): number {
		return Math.sqrt(this._x * this._x + this._y * this._y);
	}

	public getLength(): number {
		// let length = Math.sqrt(this._x * this._x + this._y * this._y);
		// if (length == undefined || isNaN(length)) {
		// 	//console.log("ERROR: catch undefined")
		// }
		return Math.sqrt(this._x * this._x + this._y * this._y);
	}

	/** Computes the squared length of the vector */
	public lengthSqr(): number {
		return this._x * this._x + this._y * this._y;
	}

	/** Computes the distance from "vec" vector */
	public distance(vec: Vec2): number {
		const xd: number = this._x - vec._x;
		const yd: number = this._y - vec._y;
		return Math.sqrt(xd * xd + yd * yd);
	}

	/** Computes the distance from ("x", "y") */
	public distanceXY(x: number, y: number): number {
		const xd: number = this._x - x;
		const yd: number = this._y - y;
		return Math.sqrt(xd * xd + yd * yd);
	}

	/** Computes the squared distance from "vec" vector */
	public distanceSqr(vec: Vec2): number {
		const xd: number = this._x - vec._x;
		const yd: number = this._y - vec._y;
		return xd * xd + yd * yd;
	}

	/** Computes the distance from ("x", "y") */
	public distanceXYSqr(x: number, y: number): number {
		const xd: number = this._x - x;
		const yd: number = this._y - y;
		return xd * xd + yd * yd;
	}

	/** Returns true if this vector's components equal the ones of "vec" */
	public equals(vec: Vec2): Boolean {
		return this._x == vec._x && this._y == vec._y;
	}

	/** Returns true if this vector's components equal ("x", "y") */
	public equalsXY(x: number, y: number): Boolean {
		return this._x == x && this._y == y;
	}

	/** Returns true if this vector is normalized (length == 1) */
	public isNormalized(): Boolean {
		return Math.abs((this._x * this._x + this._y * this._y) - 1) < Vec2.EpsilonSqr;
	}

	/** Returns true if this vector's components are 0 */
	public isZero(): Boolean {
		return this._x == 0 && this._y == 0;
	}

	/** Returns true if this vector is near "vec2" */
	public isNear(vec2: Vec2): Boolean {
		return this.distanceSqr(vec2) < Vec2.EpsilonSqr;
	}

	/** Returns true if this vector is near ("x", "y") */
	public isNearXY(x: number, y: number): Boolean {
		return this.distanceXYSqr(x, y) < Vec2.EpsilonSqr;
	}

	/** Returns true if the distance from "vec2" vector is lesser than "epsilon" */
	public isWithin(vec2: Vec2, epsilon: number): Boolean {
		return this.distanceSqr(vec2) < epsilon * epsilon;
	}

	/** Returns true if the distance from ("x", "y") vector is lesser than "epsilon" */
	public isWithinXY(x: number, y: number, epsilon: number): Boolean {
		return this.distanceXYSqr(x, y) < epsilon * epsilon;
	}

	/** Returns true if is a valid vector (has finite components) */
	public isValid(): Boolean {
		return !isNaN(this._x) && !isNaN(this._y) && isFinite(this._x) && isFinite(this._y);
	}

	/** Vector angle in degrees */
	public getDegrees(): number {
		return Math.atan2(this._y, this._x) * Vec2.RAD2DEG;
	}

	/** Vector angle in radians */
	public getRads(): number {
		return Math.atan2(this._y, this._x);
	}

	/** Vector angle in radians */
	public get angle(): number {
		return Math.atan2(this._y, this._x);
	}

	/** Angle between this vector and "vec" in radians */
	public getRadsBetween(vec: Vec2): number {
		return Math.atan2(this.x - vec.x, this.y - vec.y);
	}

	/** Computes the dot product with "vec" vector */
	public dot(vec: Vec2): number {
		return this._x * vec._x + this._y * vec._y;
	}

	/** Computes the dot product with "vec" vector */
	public dotXY(x: number, y: number): number {
		return this._x * x + this._y * y;
	}

	/** Computes the cross product (determinant) with "vec" */
	public crossDet(vec: Vec2): number {
		return this._x * vec._y - this._y * vec._x;
	}

	/** Computes the cross product (determinant) with ("x", "y")) */
	public crossDetXY(x: number, y: number): number {
		return this._x * y - this._y * x;
	}

	/** Rotates by "rads" radians (returns a new Vec2) */
	public rotate(rads: number): Vec2 {
		const s: number = Math.sin(rads);
		const c: number = Math.cos(rads);
		return new Vec2(this._x * c - this._y * s, this._x * s + this._y * c);
	}

	/** Returns a new Vec2 right-perpendicular to this vector */
	public perpRight(): Vec2 {
		return new Vec2(-this._y, this._x);
	}

	/** Returns a new Vec2 left-perpendicular to this vector */
	public perpLeft(): Vec2 {
		return new Vec2(this._y, -this._x);
	}

	/** Returns a new Vec2 with negated components */
	public flip(): Vec2 {
		return new Vec2(-this._x, -this._y);
	}

	/** Returns a new Vec2 clamped to "maxLen" length */
	public clamp(maxLen: number): Vec2 {
		let tx: number = this.x;
		let ty: number = this.y;
		let len: number = tx * tx + ty * ty;
		if (len > maxLen * maxLen) {
			len = Math.sqrt(len);
			tx = (tx / len) * maxLen;
			ty = (ty / len) * maxLen;
		}
		return new Vec2(tx, ty);
	}

	/** Clamps this vector to specified components (returns a new Vec2) */
	public clampXY(minX: number, maxX: number, minY: number, maxY: number): Vec2 {
		return new Vec2(Math.max(minX, Math.min(this._x, maxX)), Math.max(minY, Math.min(this._y, maxY)));
	}

	/** Clamps this vector to fit in the specified "rectangle" (returns a new Vec2) */
	// public  clampInRect(rectangle:Rectangle):Vec2
	// {
	// 	return new Vec2(
	// 			Math.max(rectangle.x, Math.min(this._x, rectangle.x + rectangle.width)),
	// 			Math.max(rectangle.y, Math.min(this._y, rectangle.y + rectangle.height))
	// 	);
	// }

	/** Returns a new Vec2 which is a unit for this vector (same as normalize(1)) */
	public unit(): Vec2 {
		let scale: number = 1 / Math.sqrt(this._x * this._x + this._y * this._y);
		return new Vec2(this._x * scale, this._y * scale);
	}

	/** Rotates using spinor "vec" (returns a new Vec2) */
	public rotateSpinor(vec: Vec2): Vec2 {
		return new Vec2(this._x * vec._x - this._y * vec._y, this._x * vec._y + this._y * vec._x);
	}

	/** Gets spinor between this vector and "vec" (returns a new Vec2) */
	public spinorBetween(vec: Vec2): Vec2 {
		const d: number = this.lengthSqr();
		const r: number = (vec._x * this._x + vec._y * this._y) / d;
		const i: number = (vec._y * this._x - vec._x * this._y) / d;
		return new Vec2(r, i);
	}

	/** Linear interpolation from this vector to "to" vector (returns a new Vec2) */
	public lerp(to: Vec2, t: number): Vec2 {
		return new Vec2(this._x + t * (to._x - this._x), this._y + t * (to._y - this._y));
	}

	/**
	 * Spherical linear interpolation from this vector to "to" vector (returns a new Vec2) - not thoroughly tested
	 *
	 * Note: this vector and "vec" MUST be orthogonal for it to work properly
	 */
	public slerp(vec: Vec2, t: number): Vec2 {
		const cosTheta: number = this.dot(vec);
		const theta: number = Math.acos(cosTheta);
		const sinTheta: number = Math.sin(theta);
		if (sinTheta <= Vec2.Epsilon)
			return vec.clone();
		const w1: number = Math.sin((1 - t) * theta) / sinTheta;
		const w2: number = Math.sin(t * theta) / sinTheta;
		return this.scale(w1).add(vec.scale(w2));
	}

	/** Reflect this vector in plane whose normal is "normal" (returns a new Vec2) */
	public reflect(normal: Vec2): Vec2 {
		const d: number = 2 * (this._x * normal._x + this._y * normal._y);
		return new Vec2(this._x - d * normal._x, this._y - d * normal._y);
	}

	/** Returns a new Vec2 which is the minimum between this vector and "vec" (component-wise) */
	public getMin(vec: Vec2): Vec2 {
		return new Vec2(Math.min(vec._x, this._x), Math.min(vec._y, this._y));
	}

	/** Returns a new Vec2 which is the maximum between this vector and "vec" (component-wise) */
	public getMax(vec: Vec2): Vec2 {
		return new Vec2(Math.max(vec._x, this._x), Math.max(vec._y, this._y));
	}

	/** Creates an AS3 KPoint from this vector */
	// public  toPoint():KPoint
	// {
	// 	return new KPoint(this._x, this._y);
	// }

	/** String representation of this vector (uses Vec2.stringDecimals decimal positions) */
	public toString(): String {
		return Vec2.stringDecimals >= 0 ?
			"[" + this._x.toFixed(Vec2.stringDecimals) + ", " + this._y.toFixed(Vec2.stringDecimals) + "]" :
			"[" + this._x + ", " + this._y + "]";
	}
}
