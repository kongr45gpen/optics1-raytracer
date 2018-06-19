/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./js/main.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./js/absorber.js":
/*!************************!*\
  !*** ./js/absorber.js ***!
  \************************/
/*! exports provided: Absorber, RayAbsorbed */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Absorber", function() { return Absorber; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RayAbsorbed", function() { return RayAbsorbed; });
/* harmony import */ var _instrument_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./instrument.js */ "./js/instrument.js");
/* harmony import */ var _ray_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ray.js */ "./js/ray.js");
/* harmony import */ var _lookup_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./lookup.js */ "./js/lookup.js");




const depth = 8;

class Absorber extends _instrument_js__WEBPACK_IMPORTED_MODULE_0__["Instrument"] {
    constructor() {
        super(400, 150);

        this.size = 100;

        this.exportedProperties = [
            'x', 'y', 'rot', 'size'
        ];
    }

    prepareRayTracingPoints() {
        const angle = this.rot * Math.PI / 180; // angle in radians

        // These variables will be needed later
        const sin = Math.sin(angle);
        const cos = Math.cos(angle);

        // Calculate coordinates of the 4 points of the mirror, based on trigonometry
        const startFront = [
            this.x + this.size / 2.0 * sin,
            this.y - this.size / 2.0 * cos - depth / 2.0 * sin];
        const endFront = [
            this.x - this.size / 2.0 * sin,
            this.y + this.size / 2.0 * cos - depth / 2.0 * sin];
        const startBack = [
            this.x + this.size / 2.0 * sin + depth * cos,
            this.y - this.size / 2.0 * cos + depth / 2.0 * sin];
        const endBack = [
            this.x - this.size / 2.0 * sin + depth  * cos,
            this.y + this.size / 2.0 * cos + depth / 2.0 * sin];

        let points1 = [];
        let points2 = [];
        // Calculate all points between the starting and ending ones
        // point = start + t * (end-start)
        for (let t = 0.0; ; t += 1.0 / parseFloat(this.size) / parseFloat(conf.resolution)) {
            if (t >= 1) t = 1; // Make sure we don't go off bounds

            // point = start + t * (end-start)
            points1.push([
                (1 - t) * startFront[0] + t * endFront[0],
                (1 - t) * startFront[1] + t * endFront[1]
            ]);
            points2.push([
                (1 - t) * startBack[0] + t * endBack[0],
                (1 - t) * startBack[1] + t * endBack[1]
            ]);

            if (t >= 1) break; // t == 1 means we have finished
        }
        this.points = points1.concat(points2);

        super.prepareRayTracingPoints(); // call parent method
    }

    draw(ctx) {
        // Create gradient
        let gradient = ctx.createLinearGradient(0.000, -this.size / 2.0, 15.000, this.size / 2.0);

        // Add colors
        gradient.addColorStop(0.000, 'rgba(111, 111, 111, 1.000)');
        gradient.addColorStop(0.274, 'rgba(42, 42, 42, 1.000)');
        gradient.addColorStop(0.652, 'rgba(78, 78, 78, 1.000)');
        gradient.addColorStop(1.000, 'rgba(19, 19, 19, 1.000)');
        ctx.fillStyle = gradient;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rot * Math.PI / 180);
        ctx.fillRect(0, -this.size / 2.0, depth, this.size);
        ctx.strokeStyle = 'rgba(130,130,130,0.8)';
        ctx.lineWidth = 1;
        ctx.strokeRect(0, -this.size / 2.0, depth, this.size);
        ctx.setTransform(1, 0, 0, 1, 0, 0);

        super.draw(ctx); // Call superclass function

    }

    newAngle(incident) {
        return new RayAbsorbed();
    }
}

// A class that signifies that the ray should be absorbed
class RayAbsorbed {}


/***/ }),

/***/ "./js/instrument.js":
/*!**************************!*\
  !*** ./js/instrument.js ***!
  \**************************/
/*! exports provided: Instrument */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Instrument", function() { return Instrument; });
let globalId = 1;


class Instrument {
    constructor(x, y) {
        this.id = (globalId++);
        this.affectsLight = true;
        this.isMirror = false;

        this.x = x;
        this.y = y;
        this.rot = 0;

        // Utility properties
        this.name = this.constructor.name + " #" + this.id;

        // List of points used to find intersections with rays
        this.points = [];

        // The (squared) distance of the farthest away point of this object;
        // used to speed up collision detection
        this.maxDistance = 0.0;
        this.maxVerticalDistance = 0.0;
    }

    /**
     * Draw the object in the canvas. This only provides the visual represenation of the object to
     * the user.
     *
     * @param ctx The 2D canvas context
     */
    draw(ctx) {
        if (conf.debug) {
            // Draw all possible intersection points
            this.points.forEach(function (point) {
                ctx.beginPath();
                ctx.arc(point[0], point[1], 3.5, 0, 2 * Math.PI, false);
                ctx.fillStyle = 'rgb(20,215,50)';
                ctx.fill();
            });

            // Center point
            ctx.beginPath();
            ctx.arc(this.x, this.y, 2, 0, 2 * Math.PI, false);
            ctx.fillStyle = 'rgb(235,255,255)';
            ctx.fill();
        }

        if (conf.showLabels) {
            ctx.font = '20px serif';
            ctx.fillStyle = 'rgb(255,255,255,0.8)';
            ctx.textBaseline = 'top';
            ctx.textAlign = 'center';
            ctx.fillText(this.name.charAt(0) + this.id, this.x, this.y + this.maxVerticalDistance + 5);
        }
    }

    /**
     * Get the list of rays that this object produces (useful only for light sources)
     */
    getRays() {
        return [];
    }

    /**
     * Find all the points of the surface of this item, and store them in the this.points array
     */
    prepareRayTracingPoints() {
        let self = this;

        // Find out the largest distance of the farthest away point
        this.points.forEach(function (point) {
            let distance = Math.pow(point[0] - self.x, 2) + Math.pow(point[1] - self.y, 2); // Euclidean distance
            if (distance > self.maxDistance) {
                self.maxDistance = distance;
            }
            if (Math.abs(point[1] - self.y) > self.maxVerticalDistance) {
                self.maxVerticalDistance = Math.abs(point[1] - self.y);
            }
        });
    }

    /**
     * Clears the calculated points from prepareRayTracingPoints()
     */
    clear() {
        this.points = [];
        this.maxDistance = 0;
        this.maxVerticalDistance = 0;
    }

    // TODO: onLoad function for callbacks

    /**
     * Get important attributes of this object so they can be used for JSON exports
     */
    export() {
        let properties = {
            type: this.constructor.name,
            id: this.id
        };
        let self = this;

        this.exportedProperties.forEach(function(property) {
            properties[property] = self[property];
        });

        return properties;
    }

    /**
     * Resets the ID counter
     */
    static reset() {
        globalId = 1;
    }
}


/***/ }),

/***/ "./js/instrumentBiconvex.js":
/*!**********************************!*\
  !*** ./js/instrumentBiconvex.js ***!
  \**********************************/
/*! exports provided: InstrumentBiconvex */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InstrumentBiconvex", function() { return InstrumentBiconvex; });
/* harmony import */ var _instrument_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./instrument.js */ "./js/instrument.js");


class InstrumentBiconvex extends _instrument_js__WEBPACK_IMPORTED_MODULE_0__["Instrument"] {
    constructor() {
        super(300, 150);

        this.size = 70;
        this.radius = 120;

        this.exportedProperties = [
            'x', 'y', 'rot', 'radius', 'size'
        ];
    }

    // Make the list of all points in the mirror, which will be used for collision detection and
    // raytracing later
    prepareRayTracingPoints() {
        const angle = this.rot * Math.PI / 180; // angle in radians

        // These variables will be needed later
        const sin = Math.sin(angle);
        const cos = Math.cos(angle);
        const x = this.x;
        const y = this.y;
        const circleAng = Math.asin(this.size / parseFloat(this.radius));
        const displacement = Math.cos(circleAng) * this.radius;

        const startAngle = Math.PI - circleAng;
        const endAngle = Math.PI + circleAng;

        const tstep = 1 / parseFloat(this.size) / parseFloat(conf.resolution);

        // A function that rotates and then translates the points from (0,0)
        // Source: https://en.wikipedia.org/wiki/Rotation_(mathematics)#Two_dimensions
        let translatePoint = function(point) {
            return [
                point[0] * cos - point[1] * sin + x,
                point[0] * sin + point[1] * cos + y,
            ];
        };

        // Calculate all the points of the circle, for t in (0,1)
        for (let t = 0.0; ; t += tstep) {
            if (t >= 1) t = 1; // Make sure we don't go off bounds

            // point = start + t * (end-start)
            let currentAngle = (1 - t) * startAngle + t * endAngle;
            this.points.push(translatePoint([
                displacement + this.radius * Math.cos(currentAngle),
                this.radius * Math.sin(currentAngle)
            ]));

            if (t >= 1) break; // t == 1 means we have finished
        }

        // Calculate the points of the second circle
        for (let t = 0.0; ; t += tstep) {
            if (t >= 1) t = 1;

            let currentAngle = (t) * startAngle + (1 - t) * endAngle;
            this.points.push(translatePoint([
                - displacement - this.radius * Math.cos(currentAngle),
                this.radius * Math.sin(currentAngle)
            ]));

            if (t >= 1) break;
        }

        super.prepareRayTracingPoints(); // call parent method
    }

    draw(ctx) {
        // Create gradient
        let gradient = ctx.createLinearGradient(this.x - 0.5 * this.size, this.y - 0.5 * this.size, this.x + 0.5 * this.size, this.y + 0.5 * this.size);

        // Add colors
        if (this.isMirror) {
            gradient.addColorStop(0.000, 'rgba(191, 191, 191, 1.000)');
            gradient.addColorStop(0.274, 'rgba(178, 178, 178, 1.000)');
            gradient.addColorStop(0.652, 'rgba(142, 142, 142, 1.000)');
            gradient.addColorStop(1.000, 'rgba(219, 219, 219, 1.000)');
        } else {
            // Different, darker colours for lenses
            gradient.addColorStop(0.000, 'rgba(191, 191, 191, 0.800)');
            gradient.addColorStop(0.274, 'rgba(178, 178, 178, 0.800)');
            gradient.addColorStop(0.652, 'rgba(142, 142, 142, 0.800)');
            gradient.addColorStop(1.000, 'rgba(219, 219, 219, 0.800)');
        }
        ctx.fillStyle = gradient;

        // Draw each point of the path
        ctx.beginPath();
        this.points.forEach(function(point) {
            ctx.lineTo(point[0], point[1]);
        });
        ctx.fill();

        super.draw(ctx); // Call superclass method
    }
}


/***/ }),

/***/ "./js/lensCircular.js":
/*!****************************!*\
  !*** ./js/lensCircular.js ***!
  \****************************/
/*! exports provided: LensCircular */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LensCircular", function() { return LensCircular; });
/* harmony import */ var _instrumentBiconvex_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./instrumentBiconvex.js */ "./js/instrumentBiconvex.js");
/* harmony import */ var _utilities__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utilities */ "./js/utilities.js");




class LensCircular extends _instrumentBiconvex_js__WEBPACK_IMPORTED_MODULE_0__["InstrumentBiconvex"] {
    constructor() {
        super();
        this.isMirror = false;

        this.n = 1.4;
        this.dispersion = false;

        this.exportedProperties = [
            'x', 'y', 'rot', 'radius', 'size', 'n', 'dispersion'
        ];
    }

    prepareRayTracingPoints() {
        // Calculate Cauchy's Equation factors
        if (this.dispersion) {
            this.CauchyB = Object(_utilities__WEBPACK_IMPORTED_MODULE_1__["getCauchyB"])(this.n);
        }

        super.prepareRayTracingPoints(); // call parent method
    }

    newAngle(incident, wavelength) {
        // if (Math.abs(incident) < 0.01) return Math.PI / 2.0;

        // Calculate refractive index based on Cauchy's Equation, if needed
        let n = (this.dispersion) ? Object(_utilities__WEBPACK_IMPORTED_MODULE_1__["getDispersion"])(this.CauchyB, wavelength) : this.n;

        // Find out if the ray is coming from inside or outside the lens
        const rayInside = Math.cos(incident) < 0;
        const ratio = (!rayInside) ? (conf.n / n) : (n / conf.n); // n1/n2 ratio

        // Calculate refraction angle
        const rAng = Math.asin(ratio * Math.sin(incident));
        if (isNaN(rAng)) {
            // Angle is larger than critical. That results in total internal reflection.
            return Math.PI / 2.0 - incident;
        }

        const result = - Math.PI / 2.0 + rAng;

        return (rayInside) ? -result : result;
    }
}


/***/ }),

/***/ "./js/lensConcave.js":
/*!***************************!*\
  !*** ./js/lensConcave.js ***!
  \***************************/
/*! exports provided: LensConcave */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LensConcave", function() { return LensConcave; });
/* harmony import */ var _instrument_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./instrument.js */ "./js/instrument.js");
/* harmony import */ var _utilities__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utilities */ "./js/utilities.js");



const depth = 16;

class LensConcave extends _instrument_js__WEBPACK_IMPORTED_MODULE_0__["Instrument"] {
    constructor() {
        super(300,150);

        this.size = 70;
        this.radius = 120;
        this.n = 1.4;
        this.dispersion = false;

        this.exportedProperties = [
            'x', 'y', 'rot', 'radius', 'size', 'n', 'dispersion'
        ];
    }

    prepareRayTracingPoints() {
        // Calculate Cauchy's Equation factors
        if (this.dispersion) {
            this.CauchyB = Object(_utilities__WEBPACK_IMPORTED_MODULE_1__["getCauchyB"])(this.n);
        }

        // These variables will be needed later
        const angle = this.rot * Math.PI / 180; // angle in radians
        const sin = Math.sin(angle);
        const cos = Math.cos(angle);
        const x = this.x;
        const y = this.y;
        const circleAng = Math.asin(this.size / parseFloat(this.radius));
        const displacement = (1 - Math.cos(circleAng)) * this.radius;

        const startAngle = + circleAng;
        const endAngle   = - circleAng;

        const tstep = 1 / parseFloat(this.size) / parseFloat(conf.resolution);

        // A function that rotates and then translates the points from (0,0)
        // Source: https://en.wikipedia.org/wiki/Rotation_(mathematics)#Two_dimensions
        let translatePoint = function(point) {
            return [
                point[0] * cos - point[1] * sin + x,
                point[0] * sin + point[1] * cos + y,
            ];
        };

        // Calculate all the points of the circle, for t in (0,1)
        for (let t = 0.0; ; t += tstep) {
            if (t >= 1) t = 1; // Make sure we don't go off bounds

            // point = start + t * (end-start)
            let currentAngle = (1 - t) * startAngle + t * endAngle;
            this.points.push(translatePoint([
                this.radius * (- 1 + Math.cos(currentAngle)),
                this.radius * Math.sin(currentAngle)
            ]));

            if (t >= 1) break; // t == 1 means we have finished
        }

        // Calculate the 3 remaining lines
        for (let t = 0.0; ; t += tstep) {
            if (t >= 4) t = 4;

            if (t <= 1.0) {
                // 1st horizontal line
                this.points.push(translatePoint([
                    (1 - t) * (-displacement) + t * depth,
                    - this.size
                ]));
            } else if (t <= 3.0) {
                // vertical line
                this.points.push(translatePoint([
                    depth,
                    (t - 2) * this.size
                ]));
            } else {
                // 2nd horizontal line
                this.points.push(translatePoint([
                    (4 - t) * (depth) + (t - 3) * (-displacement),
                    this.size
                ]));
            }

            if (t >= 4) break;
        }

        super.prepareRayTracingPoints(); // call parent method
    }

    newAngle(incident, wavelength) {
        // if (Math.abs(incident) < 0.01) return Math.PI / 2.0;

        // Calculate refractive index based on Cauchy's Equation, if needed
        let n = (this.dispersion) ? Object(_utilities__WEBPACK_IMPORTED_MODULE_1__["getDispersion"])(this.CauchyB, wavelength) : this.n;

        // Find out if the ray is coming from inside or outside the lens
        const rayInside = Math.cos(incident) < 0;
        const ratio = (!rayInside) ? (conf.n / n) : (n / conf.n); // n1/n2 ratio

        // Calculate refraction angle
        const rAng = Math.asin(ratio * Math.sin(incident));
        if (isNaN(rAng)) {
            // Angle is larger than critical. That results in total internal reflection.
            return Math.PI / 2.0 - incident;
        }

        const result = - Math.PI / 2.0 + rAng;

        return (rayInside) ? -result : result;
    }

    draw(ctx) {
        // Create gradient
        let gradient = ctx.createLinearGradient(this.x - 0.5 * this.size, this.y - 0.5 * this.size, this.x + 0.5 * this.size, this.y + 0.5 * this.size);

        // Add colors
        gradient.addColorStop(0.000, 'rgba(191, 191, 191, 0.800)');
        gradient.addColorStop(0.274, 'rgba(178, 178, 178, 0.800)');
        gradient.addColorStop(0.652, 'rgba(142, 142, 142, 0.800)');
        gradient.addColorStop(1.000, 'rgba(219, 219, 219, 0.800)');
        ctx.fillStyle = gradient;

        // Draw each point of the path
        ctx.beginPath();
        this.points.forEach(function(point) {
            ctx.lineTo(point[0], point[1]);
        });
        ctx.fill();

        super.draw(ctx); // Call superclass method
    }
}


/***/ }),

/***/ "./js/lookup.js":
/*!**********************!*\
  !*** ./js/lookup.js ***!
  \**********************/
/*! exports provided: wlToRgb */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "wlToRgb", function() { return wlToRgb; });
// Autogenerated file
// Wavelength to RGB values (conversion) Look-Up Table

const wlToRgb = [
[80.551, 0.000, 255.000], // 380.0 nm
[80.551, 0.000, 255.000], // 381.0 nm
[80.551, 0.000, 255.000], // 382.0 nm
[80.551, 0.000, 255.000], // 383.0 nm
[77.273, 0.000, 255.000], // 384.0 nm
[74.907, 0.000, 255.000], // 385.0 nm
[73.119, 0.000, 255.000], // 386.0 nm
[73.119, 0.000, 255.000], // 387.0 nm
[73.119, 0.000, 255.000], // 388.0 nm
[73.923, 0.000, 255.000], // 389.0 nm
[74.420, 0.000, 255.000], // 390.0 nm
[74.756, 0.000, 255.000], // 391.0 nm
[74.756, 0.000, 255.000], // 392.0 nm
[74.756, 0.000, 255.000], // 393.0 nm
[74.918, 0.000, 255.000], // 394.0 nm
[75.023, 0.000, 255.000], // 395.0 nm
[75.096, 0.000, 255.000], // 396.0 nm
[75.096, 0.000, 255.000], // 397.0 nm
[75.096, 0.000, 255.000], // 398.0 nm
[75.206, 0.000, 255.000], // 399.0 nm
[75.275, 0.000, 255.000], // 400.0 nm
[75.323, 0.000, 255.000], // 401.0 nm
[75.323, 0.000, 255.000], // 402.0 nm
[75.323, 0.000, 255.000], // 403.0 nm
[75.388, 0.000, 255.000], // 404.0 nm
[75.435, 0.000, 255.000], // 405.0 nm
[75.469, 0.000, 255.000], // 406.0 nm
[75.469, 0.000, 255.000], // 407.0 nm
[75.469, 0.000, 255.000], // 408.0 nm
[75.176, 0.000, 255.000], // 409.0 nm
[74.992, 0.000, 255.000], // 410.0 nm
[74.865, 0.000, 255.000], // 411.0 nm
[74.865, 0.000, 255.000], // 412.0 nm
[74.865, 0.000, 255.000], // 413.0 nm
[74.632, 0.000, 255.000], // 414.0 nm
[74.479, 0.000, 255.000], // 415.0 nm
[74.371, 0.000, 255.000], // 416.0 nm
[74.371, 0.000, 255.000], // 417.0 nm
[74.371, 0.000, 255.000], // 418.0 nm
[74.095, 0.000, 255.000], // 419.0 nm
[73.909, 0.000, 255.000], // 420.0 nm
[73.777, 0.000, 255.000], // 421.0 nm
[73.777, 0.000, 255.000], // 422.0 nm
[73.777, 0.000, 255.000], // 423.0 nm
[73.235, 0.000, 255.000], // 424.0 nm
[72.848, 0.000, 255.000], // 425.0 nm
[72.559, 0.000, 255.000], // 426.0 nm
[72.559, 0.000, 255.000], // 427.0 nm
[72.559, 0.000, 255.000], // 428.0 nm
[71.894, 0.000, 255.000], // 429.0 nm
[71.348, 0.000, 255.000], // 430.0 nm
[70.892, 0.000, 255.000], // 431.0 nm
[70.892, 0.000, 255.000], // 432.0 nm
[70.892, 0.000, 255.000], // 433.0 nm
[70.023, 0.000, 255.000], // 434.0 nm
[69.240, 0.000, 255.000], // 435.0 nm
[68.530, 0.000, 255.000], // 436.0 nm
[68.530, 0.000, 255.000], // 437.0 nm
[68.530, 0.000, 255.000], // 438.0 nm
[67.449, 0.000, 255.000], // 439.0 nm
[66.414, 0.000, 255.000], // 440.0 nm
[65.424, 0.000, 255.000], // 441.0 nm
[65.424, 0.000, 255.000], // 442.0 nm
[65.424, 0.000, 255.000], // 443.0 nm
[64.033, 0.000, 255.000], // 444.0 nm
[62.652, 0.000, 255.000], // 445.0 nm
[61.279, 0.000, 255.000], // 446.0 nm
[61.279, 0.000, 255.000], // 447.0 nm
[61.279, 0.000, 255.000], // 448.0 nm
[59.394, 0.000, 255.000], // 449.0 nm
[57.483, 0.000, 255.000], // 450.0 nm
[55.546, 0.000, 255.000], // 451.0 nm
[55.546, 0.000, 255.000], // 452.0 nm
[55.546, 0.000, 255.000], // 453.0 nm
[53.097, 0.000, 255.000], // 454.0 nm
[50.590, 0.000, 255.000], // 455.0 nm
[48.025, 0.000, 255.000], // 456.0 nm
[48.025, 0.000, 255.000], // 457.0 nm
[48.025, 0.000, 255.000], // 458.0 nm
[44.806, 0.000, 255.000], // 459.0 nm
[41.437, 0.000, 255.000], // 460.0 nm
[37.907, 0.000, 255.000], // 461.0 nm
[37.907, 0.000, 255.000], // 462.0 nm
[37.907, 0.000, 255.000], // 463.0 nm
[33.620, 0.000, 255.000], // 464.0 nm
[28.971, 0.000, 255.000], // 465.0 nm
[23.911, 0.000, 255.000], // 466.0 nm
[23.911, 0.000, 255.000], // 467.0 nm
[23.911, 0.000, 255.000], // 468.0 nm
[17.167, 0.000, 255.000], // 469.0 nm
[9.334, 0.000, 255.000], // 470.0 nm
[0.125, 0.000, 255.000], // 471.0 nm
[0.125, 0.000, 255.000], // 472.0 nm
[0.125, 0.000, 255.000], // 473.0 nm
[0.000, 10.669, 255.000], // 474.0 nm
[0.000, 22.688, 255.000], // 475.0 nm
[0.000, 36.151, 255.000], // 476.0 nm
[0.000, 36.151, 255.000], // 477.0 nm
[0.000, 36.151, 255.000], // 478.0 nm
[0.000, 50.891, 255.000], // 479.0 nm
[0.000, 67.529, 255.000], // 480.0 nm
[0.000, 86.458, 255.000], // 481.0 nm
[0.000, 86.458, 255.000], // 482.0 nm
[0.000, 86.458, 255.000], // 483.0 nm
[0.000, 106.324, 255.000], // 484.0 nm
[0.000, 128.884, 255.000], // 485.0 nm
[0.000, 154.723, 255.000], // 486.0 nm
[0.000, 154.723, 255.000], // 487.0 nm
[0.000, 154.723, 255.000], // 488.0 nm
[0.000, 181.150, 255.000], // 489.0 nm
[0.000, 210.859, 255.000], // 490.0 nm
[0.000, 244.503, 255.000], // 491.0 nm
[0.000, 244.503, 255.000], // 492.0 nm
[0.000, 244.503, 255.000], // 493.0 nm
[0.000, 255.000, 232.872], // 494.0 nm
[0.000, 255.000, 204.821], // 495.0 nm
[0.000, 255.000, 180.731], // 496.0 nm
[0.000, 255.000, 180.731], // 497.0 nm
[0.000, 255.000, 180.731], // 498.0 nm
[0.000, 255.000, 161.477], // 499.0 nm
[0.000, 255.000, 144.897], // 500.0 nm
[0.000, 255.000, 130.470], // 501.0 nm
[0.000, 255.000, 130.470], // 502.0 nm
[0.000, 255.000, 130.470], // 503.0 nm
[0.000, 255.000, 118.184], // 504.0 nm
[0.000, 255.000, 107.560], // 505.0 nm
[0.000, 255.000, 98.282], // 506.0 nm
[0.000, 255.000, 98.282], // 507.0 nm
[0.000, 255.000, 98.282], // 508.0 nm
[0.000, 255.000, 89.582], // 509.0 nm
[0.000, 255.000, 81.873], // 510.0 nm
[0.000, 255.000, 74.995], // 511.0 nm
[0.000, 255.000, 74.995], // 512.0 nm
[0.000, 255.000, 74.995], // 513.0 nm
[0.000, 255.000, 68.325], // 514.0 nm
[0.000, 255.000, 62.273], // 515.0 nm
[0.000, 255.000, 56.756], // 516.0 nm
[0.000, 255.000, 56.756], // 517.0 nm
[0.000, 255.000, 56.756], // 518.0 nm
[0.000, 255.000, 51.532], // 519.0 nm
[0.000, 255.000, 46.638], // 520.0 nm
[0.000, 255.000, 42.043], // 521.0 nm
[0.000, 255.000, 42.043], // 522.0 nm
[0.000, 255.000, 42.043], // 523.0 nm
[0.000, 255.000, 37.542], // 524.0 nm
[0.000, 255.000, 33.168], // 525.0 nm
[0.000, 255.000, 28.916], // 526.0 nm
[0.000, 255.000, 28.916], // 527.0 nm
[0.000, 255.000, 28.916], // 528.0 nm
[0.000, 255.000, 24.245], // 529.0 nm
[0.000, 255.000, 19.589], // 530.0 nm
[0.000, 255.000, 14.949], // 531.0 nm
[0.000, 255.000, 14.949], // 532.0 nm
[0.000, 255.000, 14.949], // 533.0 nm
[0.000, 255.000, 9.861], // 534.0 nm
[0.000, 255.000, 4.687], // 535.0 nm
[0.577, 255.000, 0.000], // 536.0 nm
[0.577, 255.000, 0.000], // 537.0 nm
[0.577, 255.000, 0.000], // 538.0 nm
[6.378, 255.000, 0.000], // 539.0 nm
[12.124, 255.000, 0.000], // 540.0 nm
[17.816, 255.000, 0.000], // 541.0 nm
[17.816, 255.000, 0.000], // 542.0 nm
[17.816, 255.000, 0.000], // 543.0 nm
[24.150, 255.000, 0.000], // 544.0 nm
[30.510, 255.000, 0.000], // 545.0 nm
[36.896, 255.000, 0.000], // 546.0 nm
[36.896, 255.000, 0.000], // 547.0 nm
[36.896, 255.000, 0.000], // 548.0 nm
[44.101, 255.000, 0.000], // 549.0 nm
[51.425, 255.000, 0.000], // 550.0 nm
[58.873, 255.000, 0.000], // 551.0 nm
[58.873, 255.000, 0.000], // 552.0 nm
[58.873, 255.000, 0.000], // 553.0 nm
[67.408, 255.000, 0.000], // 554.0 nm
[76.188, 255.000, 0.000], // 555.0 nm
[85.222, 255.000, 0.000], // 556.0 nm
[85.222, 255.000, 0.000], // 557.0 nm
[85.222, 255.000, 0.000], // 558.0 nm
[95.581, 255.000, 0.000], // 559.0 nm
[106.372, 255.000, 0.000], // 560.0 nm
[117.623, 255.000, 0.000], // 561.0 nm
[117.623, 255.000, 0.000], // 562.0 nm
[117.623, 255.000, 0.000], // 563.0 nm
[130.549, 255.000, 0.000], // 564.0 nm
[144.220, 255.000, 0.000], // 565.0 nm
[158.700, 255.000, 0.000], // 566.0 nm
[158.700, 255.000, 0.000], // 567.0 nm
[158.700, 255.000, 0.000], // 568.0 nm
[175.237, 255.000, 0.000], // 569.0 nm
[193.019, 255.000, 0.000], // 570.0 nm
[212.193, 255.000, 0.000], // 571.0 nm
[212.193, 255.000, 0.000], // 572.0 nm
[212.193, 255.000, 0.000], // 573.0 nm
[233.957, 255.000, 0.000], // 574.0 nm
[255.000, 252.207, 0.000], // 575.0 nm
[255.000, 228.870, 0.000], // 576.0 nm
[255.000, 228.870, 0.000], // 577.0 nm
[255.000, 228.870, 0.000], // 578.0 nm
[255.000, 207.277, 0.000], // 579.0 nm
[255.000, 187.430, 0.000], // 580.0 nm
[255.000, 169.126, 0.000], // 581.0 nm
[255.000, 169.126, 0.000], // 582.0 nm
[255.000, 169.126, 0.000], // 583.0 nm
[255.000, 152.506, 0.000], // 584.0 nm
[255.000, 136.958, 0.000], // 585.0 nm
[255.000, 122.381, 0.000], // 586.0 nm
[255.000, 122.381, 0.000], // 587.0 nm
[255.000, 122.381, 0.000], // 588.0 nm
[255.000, 109.469, 0.000], // 589.0 nm
[255.000, 97.187, 0.000], // 590.0 nm
[255.000, 85.490, 0.000], // 591.0 nm
[255.000, 85.490, 0.000], // 592.0 nm
[255.000, 85.490, 0.000], // 593.0 nm
[255.000, 75.443, 0.000], // 594.0 nm
[255.000, 65.732, 0.000], // 595.0 nm
[255.000, 56.339, 0.000], // 596.0 nm
[255.000, 56.339, 0.000], // 597.0 nm
[255.000, 56.339, 0.000], // 598.0 nm
[255.000, 48.800, 0.000], // 599.0 nm
[255.000, 41.370, 0.000], // 600.0 nm
[255.000, 34.047, 0.000], // 601.0 nm
[255.000, 34.047, 0.000], // 602.0 nm
[255.000, 34.047, 0.000], // 603.0 nm
[255.000, 28.162, 0.000], // 604.0 nm
[255.000, 22.268, 0.000], // 605.0 nm
[255.000, 16.365, 0.000], // 606.0 nm
[255.000, 16.365, 0.000], // 607.0 nm
[255.000, 16.365, 0.000], // 608.0 nm
[255.000, 11.992, 0.000], // 609.0 nm
[255.000, 7.527, 0.000], // 610.0 nm
[255.000, 2.966, 0.000], // 611.0 nm
[255.000, 2.966, 0.000], // 612.0 nm
[255.000, 2.966, 0.000], // 613.0 nm
[255.000, 0.000, 0.332], // 614.0 nm
[255.000, 0.000, 3.705], // 615.0 nm
[255.000, 0.000, 7.119], // 616.0 nm
[255.000, 0.000, 7.119], // 617.0 nm
[255.000, 0.000, 7.119], // 618.0 nm
[255.000, 0.000, 9.416], // 619.0 nm
[255.000, 0.000, 11.803], // 620.0 nm
[255.000, 0.000, 14.286], // 621.0 nm
[255.000, 0.000, 14.286], // 622.0 nm
[255.000, 0.000, 14.286], // 623.0 nm
[255.000, 0.000, 15.901], // 624.0 nm
[255.000, 0.000, 17.627], // 625.0 nm
[255.000, 0.000, 19.476], // 626.0 nm
[255.000, 0.000, 19.476], // 627.0 nm
[255.000, 0.000, 19.476], // 628.0 nm
[255.000, 0.000, 20.654], // 629.0 nm
[255.000, 0.000, 21.941], // 630.0 nm
[255.000, 0.000, 23.354], // 631.0 nm
[255.000, 0.000, 23.354], // 632.0 nm
[255.000, 0.000, 23.354], // 633.0 nm
[255.000, 0.000, 24.280], // 634.0 nm
[255.000, 0.000, 25.303], // 635.0 nm
[255.000, 0.000, 26.440], // 636.0 nm
[255.000, 0.000, 26.440], // 637.0 nm
[255.000, 0.000, 26.440], // 638.0 nm
[255.000, 0.000, 27.153], // 639.0 nm
[255.000, 0.000, 27.953], // 640.0 nm
[255.000, 0.000, 28.856], // 641.0 nm
[255.000, 0.000, 28.856], // 642.0 nm
[255.000, 0.000, 28.856], // 643.0 nm
[255.000, 0.000, 29.394], // 644.0 nm
[255.000, 0.000, 30.009], // 645.0 nm
[255.000, 0.000, 30.718], // 646.0 nm
[255.000, 0.000, 30.718], // 647.0 nm
[255.000, 0.000, 30.718], // 648.0 nm
[255.000, 0.000, 31.097], // 649.0 nm
[255.000, 0.000, 31.538], // 650.0 nm
[255.000, 0.000, 32.056], // 651.0 nm
[255.000, 0.000, 32.056], // 652.0 nm
[255.000, 0.000, 32.056], // 653.0 nm
[255.000, 0.000, 32.339], // 654.0 nm
[255.000, 0.000, 32.672], // 655.0 nm
[255.000, 0.000, 33.070], // 656.0 nm
[255.000, 0.000, 33.070], // 657.0 nm
[255.000, 0.000, 33.070], // 658.0 nm
[255.000, 0.000, 33.274], // 659.0 nm
[255.000, 0.000, 33.518], // 660.0 nm
[255.000, 0.000, 33.814], // 661.0 nm
[255.000, 0.000, 33.814], // 662.0 nm
[255.000, 0.000, 33.814], // 663.0 nm
[255.000, 0.000, 33.935], // 664.0 nm
[255.000, 0.000, 34.081], // 665.0 nm
[255.000, 0.000, 34.262], // 666.0 nm
[255.000, 0.000, 34.262], // 667.0 nm
[255.000, 0.000, 34.262], // 668.0 nm
[255.000, 0.000, 34.375], // 669.0 nm
[255.000, 0.000, 34.514], // 670.0 nm
[255.000, 0.000, 34.689], // 671.0 nm
[255.000, 0.000, 34.689], // 672.0 nm
[255.000, 0.000, 34.689], // 673.0 nm
[255.000, 0.000, 34.772], // 674.0 nm
[255.000, 0.000, 34.873], // 675.0 nm
[255.000, 0.000, 34.999], // 676.0 nm
[255.000, 0.000, 34.999], // 677.0 nm
[255.000, 0.000, 34.999], // 678.0 nm
[255.000, 0.000, 35.093], // 679.0 nm
[255.000, 0.000, 35.208], // 680.0 nm
[255.000, 0.000, 35.349], // 681.0 nm
[255.000, 0.000, 35.349], // 682.0 nm
[255.000, 0.000, 35.349], // 683.0 nm
[255.000, 0.000, 35.441], // 684.0 nm
[255.000, 0.000, 35.555], // 685.0 nm
[255.000, 0.000, 35.701], // 686.0 nm
[255.000, 0.000, 35.701], // 687.0 nm
[255.000, 0.000, 35.701], // 688.0 nm
[255.000, 0.000, 35.728], // 689.0 nm
[255.000, 0.000, 35.763], // 690.0 nm
[255.000, 0.000, 35.808], // 691.0 nm
[255.000, 0.000, 35.808], // 692.0 nm
[255.000, 0.000, 35.808], // 693.0 nm
[255.000, 0.000, 35.835], // 694.0 nm
[255.000, 0.000, 35.870], // 695.0 nm
[255.000, 0.000, 35.915], // 696.0 nm
[255.000, 0.000, 35.915], // 697.0 nm
[255.000, 0.000, 35.915], // 698.0 nm
[255.000, 0.000, 35.982], // 699.0 nm
[255.000, 0.000, 36.064], // 700.0 nm
[255.000, 0.000, 36.166], // 701.0 nm
[255.000, 0.000, 36.166], // 702.0 nm
[255.000, 0.000, 36.166], // 703.0 nm
[255.000, 0.000, 36.263], // 704.0 nm
[255.000, 0.000, 36.382], // 705.0 nm
[255.000, 0.000, 36.533], // 706.0 nm
[255.000, 0.000, 36.533], // 707.0 nm
[255.000, 0.000, 36.533], // 708.0 nm
[255.000, 0.000, 36.292], // 709.0 nm
[255.000, 0.000, 35.995], // 710.0 nm
[255.000, 0.000, 35.618], // 711.0 nm
[255.000, 0.000, 35.618], // 712.0 nm
[255.000, 0.000, 35.618], // 713.0 nm
[255.000, 0.000, 35.393], // 714.0 nm
[255.000, 0.000, 35.112], // 715.0 nm
[255.000, 0.000, 34.753], // 716.0 nm
[255.000, 0.000, 34.753], // 717.0 nm
[255.000, 0.000, 34.753], // 718.0 nm
[255.000, 0.000, 36.006], // 719.0 nm
[255.000, 0.000, 37.537], // 720.0 nm
[255.000, 0.000, 39.454], // 721.0 nm
[255.000, 0.000, 39.454], // 722.0 nm
[255.000, 0.000, 39.454], // 723.0 nm
[255.000, 0.000, 39.165], // 724.0 nm
[255.000, 0.000, 38.799], // 725.0 nm
[255.000, 0.000, 38.321], // 726.0 nm
[255.000, 0.000, 38.321], // 727.0 nm
[255.000, 0.000, 38.321], // 728.0 nm
[255.000, 0.000, 37.911], // 729.0 nm
[255.000, 0.000, 37.397], // 730.0 nm
[255.000, 0.000, 36.731], // 731.0 nm
[255.000, 0.000, 36.731], // 732.0 nm
[255.000, 0.000, 36.731], // 733.0 nm
[255.000, 0.000, 34.161], // 734.0 nm
[255.000, 0.000, 30.882], // 735.0 nm
[255.000, 0.000, 26.552], // 736.0 nm
[255.000, 0.000, 26.552], // 737.0 nm
[255.000, 0.000, 26.552], // 738.0 nm
[255.000, 0.000, 33.710], // 739.0 nm
[255.000, 0.000, 41.921], // 740.0 nm
[255.000, 0.000, 51.436], // 741.0 nm
[255.000, 0.000, 51.436], // 742.0 nm
[255.000, 0.000, 51.436], // 743.0 nm
[255.000, 0.000, 45.554], // 744.0 nm
[255.000, 0.000, 37.670], // 745.0 nm
[255.000, 0.000, 26.552], // 746.0 nm
[255.000, 0.000, 26.552], // 747.0 nm
[255.000, 0.000, 26.552], // 748.0 nm
[255.000, 0.000, 30.338], // 749.0 nm
[255.000, 0.000, 35.261], // 750.0 nm
[255.000, 0.000, 41.921], // 751.0 nm
[255.000, 0.000, 41.921], // 752.0 nm
[255.000, 0.000, 41.921], // 753.0 nm
[255.000, 0.000, 32.628], // 754.0 nm
[255.000, 0.000, 19.087], // 755.0 nm
[255.000, 2.450, 0.000], // 756.0 nm
[255.000, 2.450, 0.000], // 757.0 nm
[255.000, 2.450, 0.000], // 758.0 nm
[255.000, 2.450, 0.000], // 759.0 nm
[255.000, 2.450, 0.000], // 760.0 nm
[255.000, 2.450, 0.000], // 761.0 nm
[255.000, 2.450, 0.000], // 762.0 nm
[255.000, 2.450, 0.000], // 763.0 nm
[255.000, 0.000, 26.552], // 764.0 nm
[255.000, 0.000, 57.907], // 765.0 nm
[255.000, 0.000, 91.883], // 766.0 nm
[255.000, 0.000, 91.883], // 767.0 nm
[255.000, 0.000, 91.883], // 768.0 nm
[255.000, 0.000, 91.883], // 769.0 nm
[255.000, 0.000, 91.883], // 770.0 nm
[255.000, 0.000, 91.883], // 771.0 nm
[255.000, 0.000, 91.883], // 772.0 nm
[255.000, 0.000, 91.883], // 773.0 nm
[255.000, 0.000, 91.883], // 774.0 nm
[255.000, 0.000, 91.883], // 775.0 nm
[255.000, 0.000, 91.883], // 776.0 nm
[255.000, 0.000, 91.883], // 777.0 nm
[255.000, 0.000, 91.883], // 778.0 nm
[255.000, 0.000, 91.883], // 779.0 nm
[255.000, 0.000, 91.883], // 780.0 nm
];


/***/ }),

/***/ "./js/main.js":
/*!********************!*\
  !*** ./js/main.js ***!
  \********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var dat_gui__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! dat.gui */ "./node_modules/dat.gui/build/dat.gui.module.js");
/* harmony import */ var micromodal__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! micromodal */ "./node_modules/micromodal/dist/micromodal.es.js");
/* harmony import */ var debounce__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! debounce */ "./node_modules/debounce/index.js");
/* harmony import */ var debounce__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(debounce__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _presets_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./presets.js */ "./js/presets.js");
/* harmony import */ var _instrument_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./instrument.js */ "./js/instrument.js");
/* harmony import */ var _torch_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./torch.js */ "./js/torch.js");
/* harmony import */ var _mirror_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./mirror.js */ "./js/mirror.js");
/* harmony import */ var _mirrorCircular_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./mirrorCircular.js */ "./js/mirrorCircular.js");
/* harmony import */ var _lensCircular_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./lensCircular.js */ "./js/lensCircular.js");
/* harmony import */ var _lensConcave_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./lensConcave.js */ "./js/lensConcave.js");
/* harmony import */ var _absorber_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./absorber.js */ "./js/absorber.js");
console.log("Welcome to optics1-raytracer");














const gui = new dat_gui__WEBPACK_IMPORTED_MODULE_0__["default"].GUI();
const drawSlowly = debounce__WEBPACK_IMPORTED_MODULE_2___default()(getDraw()); // Make sure that draw() isn't called too often for automatic functions

function addObject(object) {
    const id = object.id;
    const name = object.name;

    console.log("Adding " + object.name);
    objects.push(object);

    const folder = gui.addFolder(object.name);
    const draw = getDraw(id);
    object.exportedProperties.forEach(function (prop) {
        if (prop === 'x' || prop === 'y') {
            folder.add(object, prop, 0, conf.canvasSize).onChange(draw);
        } else if (prop === 'rot') {
            folder.add(object, prop, -180, 180).onChange(draw);
        } else if (prop === 'intensity') {
            folder.add(object, prop, 0.0, 1.0).onChange(draw);
        } else if (prop === 'wavelength') {
            folder.add(object, prop, 380, 780).onChange(draw);
        } else if (prop === 'size') {
            folder.add(object, prop, 0, 200).onChange(draw);
        } else if (prop === 'radius') {
            folder.add(object, prop, 0, 200).onChange(draw);
        } else if (prop === 'n') {
            folder.add(object, prop, 0.9, 5.0).onChange(draw);
        } else {
            folder.add(object, prop).onChange(draw);
        }
    });
    object.remove = function () {
        // Delete the object from the list of objects
        objects = objects.filter(function (item) {
            return item.id !== id
        });
        drawSlowly();
        gui.removeFolder(folder);
    };
    folder.add(object, 'remove');
    folder.open();

    drawSlowly();
}

// Initialise the canvas
let canvas = document.getElementById('app');
let ctx = canvas.getContext('2d');
window.ctx = ctx; // Make the variable globally accessible

// Configuration object; used to store all configuration values of the app, so that they
// can be used by the instrument classes
class Config {
    constructor() {
        this.canvasSize = 850;
        this.canvasWidth = canvas.scrollWidth;
        this.canvasHeight = canvas.scrollHeight;

        this.debug = false;
        this.showLabels = false;
        this.realisticDispersion = false;
        this.resolution = 4.0;
        this.stepsLo = 1.0;
        this.stepsHi = 5.0;
        this.maxSteps = 9000;

        this.n = 1.0;

        this.redraw = function () {
            draw()
        };
        this.reset = function () {
            reset();
            drawSlowly();
        };

        this.addTorch = function () {addObject(new _torch_js__WEBPACK_IMPORTED_MODULE_5__["Torch"]());};
        this.addMirror = function () {addObject(new _mirror_js__WEBPACK_IMPORTED_MODULE_6__["Mirror"]());};
        this.addCircularMirror = function () {addObject(new _mirrorCircular_js__WEBPACK_IMPORTED_MODULE_7__["MirrorCircular"]());};
        this.addCircularLens = function () {addObject(new _lensCircular_js__WEBPACK_IMPORTED_MODULE_8__["LensCircular"]());};
        this.addConcaveLens = function () {addObject(new _lensConcave_js__WEBPACK_IMPORTED_MODULE_9__["LensConcave"]());};
        this.addAbsorber = function () {addObject(new _absorber_js__WEBPACK_IMPORTED_MODULE_10__["Absorber"]());};
    }
}

let conf = new Config();
window.conf = conf; // Make the variable globally accessible

let objects = []; // The list of optical instruments
window.objects = objects;

// Function to store the current optical system to the browser, so it can be recovered later
const performStorage = debounce__WEBPACK_IMPORTED_MODULE_2___default()(function () {
    localStorage.setItem('optics1_raytracer.system', exportData());
}, 250);

const drawingIndicator = document.getElementById('drawing');

// Get a draw function
//
// id: The ID of the object to reset. NULL to reset all objects.
// Rays are always processed entirely
function getDraw(id) {
    return function () {
        drawingIndicator.style.display = 'inline-block';

        // setTimeout(function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Prepare and draw all optical instruments
        objects.forEach(function (obj) {
            if (id === undefined || id === null || obj.id === id) {
                obj.clear();
                obj.prepareRayTracingPoints();
            }
            obj.draw(ctx);
        });

        // Draw all rays
        objects.forEach(function (obj) {
            obj.getRays().forEach(function (ray) {
                ray.draw(ctx, objects);
            })
        });

        // Store changes in the local storage
        performStorage();

        // Hide the processing... indicator
        drawingIndicator.style.display = 'none';
        // }, 1);
    };
}

const draw = getDraw();

// Set up dat.gui configuration
gui.add(conf, 'n', 1.0, 2.0).onChange(draw);
gui.add(conf, 'debug').onChange(draw);
gui.add(conf, 'showLabels').onChange(draw);
let folder = gui.addFolder('Configuration');
folder.add(conf, 'resolution', 0.0, 10.0).onChange(draw);
folder.add(conf, 'stepsLo', 0.0, 10.0).onChange(draw);
folder.add(conf, 'stepsHi', 0.0, 20.0).onChange(draw);
folder.add(conf, 'maxSteps', 100, 100000).onChange(draw);
folder.add(conf, 'realisticDispersion').onChange(draw);
folder.add(conf, 'redraw');
gui.add(conf, 'addTorch');
gui.add(conf, 'addMirror');
gui.add(conf, 'addCircularMirror');
gui.add(conf, 'addCircularLens');
gui.add(conf, 'addConcaveLens');
gui.add(conf, 'addAbsorber');

// Reset function to remove all instruments
function reset() {
    objects.forEach(function (object) {
        // This might be dangerous
        console.log("Removing " + object.name);
        object.remove();
    });

    _instrument_js__WEBPACK_IMPORTED_MODULE_4__["Instrument"].reset();
}
window.reset = reset;


// Export functions
function exportData() {
    return JSON.stringify(objects.map(function (object) {
        return object.export();
    }), null, 1).replace(/\n/g, ' ');
}

document.getElementById('export').addEventListener('click', function () {
    document.getElementById('exported-json').innerHTML = exportData();

    micromodal__WEBPACK_IMPORTED_MODULE_1__["default"].show('modal-1');
});

// Import functions
let json = localStorage.getItem('optics1_raytracer.system');
if (json !== undefined && json !== null) {
    importData(JSON.parse(json));
}
// TODO: Use an actual callback instead of this workaround
setTimeout(draw, 1000); // redraw after all elements have loaded
setTimeout(draw, 2000); // 2nd try

document.getElementById('import').addEventListener('click', function () {
    micromodal__WEBPACK_IMPORTED_MODULE_1__["default"].show('modal-2');
});

document.getElementById('import-form').addEventListener('submit', function () {
    micromodal__WEBPACK_IMPORTED_MODULE_1__["default"].close('modal-2');
    importData(JSON.parse(this.elements['import-json'].value));
});

function importData(data) {
    drawingIndicator.style.display = 'inline-block';

    reset();

    data.forEach(function (datum) {
        let object;
        switch (datum.type) {
            case "Mirror":
                object = new _mirror_js__WEBPACK_IMPORTED_MODULE_6__["Mirror"]();
                break;
            case "MirrorCircular":
                object = new _mirrorCircular_js__WEBPACK_IMPORTED_MODULE_7__["MirrorCircular"]();
                break;
            case "LensCircular":
                object = new _lensCircular_js__WEBPACK_IMPORTED_MODULE_8__["LensCircular"]();
                break;
            case "LensConcave":
                object = new _lensConcave_js__WEBPACK_IMPORTED_MODULE_9__["LensConcave"]();
                break;
            case "Torch":
                object = new _torch_js__WEBPACK_IMPORTED_MODULE_5__["Torch"]();
                break;
            case "Absorber":
                object = new _absorber_js__WEBPACK_IMPORTED_MODULE_10__["Absorber"]();
                break;
        }

        // Copy properties
        Object.keys(datum).forEach(function (property) {
            if (property === 'id') return; // Don't copy ID, use the already existing one
            object[property] = datum[property];
        });

        addObject(object);
    });
}

// Populate list of presets
const originalButton = document.getElementById('preset-preset');
console.log(originalButton);
for (let key in _presets_js__WEBPACK_IMPORTED_MODULE_3__["presets"]) {
    const configuration = _presets_js__WEBPACK_IMPORTED_MODULE_3__["presets"][key];

    let button = originalButton.cloneNode(true);
    button.innerText = key; //.replace( /([A-Z])/g, " $1");
    button.id = null;
    button.addEventListener('click', function () {
        importData(configuration);
    });


    originalButton.parentNode.appendChild(button);
}


/***/ }),

/***/ "./js/mirror.js":
/*!**********************!*\
  !*** ./js/mirror.js ***!
  \**********************/
/*! exports provided: Mirror */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Mirror", function() { return Mirror; });
/* harmony import */ var _instrument_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./instrument.js */ "./js/instrument.js");
/* harmony import */ var _ray_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ray.js */ "./js/ray.js");
/* harmony import */ var _lookup_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./lookup.js */ "./js/lookup.js");




const depth = 8;

class Mirror extends _instrument_js__WEBPACK_IMPORTED_MODULE_0__["Instrument"] {
    constructor() {
        super(400, 150);
        this.isMirror = true;

        this.size = 100;

        this.exportedProperties = [
            'x', 'y', 'rot', 'size'
        ];
    }

    // Make the list of all points in the mirror, which will be used for collision detection and
    // raytracing later
    //
    // TODO: Call this function only when this element changes, not for every redraw
    // TODO: Make sure mirror front and back do not get confused for the 1 point in the middle
    //       of the points array
    prepareRayTracingPoints() {
        const angle = this.rot * Math.PI / 180; // angle in radians

        // These variables will be needed later
        const sin = Math.sin(angle);
        const cos = Math.cos(angle);

        // Calculate coordinates of the 4 points of the mirror, based on trigonometry
        const startFront = [
            this.x + this.size / 2.0 * sin - depth / 2.0 * cos,
            this.y - this.size / 2.0 * cos - depth / 2.0 * sin];
        const endFront = [
            this.x - this.size / 2.0 * sin - depth / 2.0 * cos,
            this.y + this.size / 2.0 * cos - depth / 2.0 * sin];
        const startBack = [
            this.x + this.size / 2.0 * sin + depth / 2.0 * cos,
            this.y - this.size / 2.0 * cos + depth / 2.0 * sin];
        const endBack = [
            this.x - this.size / 2.0 * sin + depth / 2.0 * cos,
            this.y + this.size / 2.0 * cos + depth / 2.0 * sin];

        let points1 = [];
        let points2 = [];
        // Calculate all points between the starting and ending ones
        // point = start + t * (end-start)
        for (let t = 0.0; ; t += 1.0 / parseFloat(this.size) / parseFloat(conf.resolution)) {
            if (t >= 1) t = 1; // Make sure we don't go off bounds

            // point = start + t * (end-start)
            points1.push([
                (1 - t) * startFront[0] + t * endFront[0],
                (1 - t) * startFront[1] + t * endFront[1]
            ]);
            points2.push([
                (1 - t) * startBack[0] + t * endBack[0],
                (1 - t) * startBack[1] + t * endBack[1]
            ]);

            if (t >= 1) break; // t == 1 means we have finished
        }
        this.points = points1.concat(points2);

        super.prepareRayTracingPoints(); // call parent method
    }

    draw(ctx) {
        // Create gradient
        let gradient = ctx.createLinearGradient(0.000, 0.000, 15.000, 15.000);

        // Add colors
        gradient.addColorStop(0.000, 'rgba(191, 191, 191, 1.000)');
        gradient.addColorStop(0.274, 'rgba(178, 178, 178, 1.000)');
        gradient.addColorStop(0.652, 'rgba(142, 142, 142, 1.000)');
        gradient.addColorStop(1.000, 'rgba(219, 219, 219, 1.000)');
        ctx.fillStyle = gradient;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rot * Math.PI / 180);
        ctx.fillRect(-depth / 2.0, -this.size / 2.0, depth, this.size);
        ctx.setTransform(1, 0, 0, 1, 0, 0);

        super.draw(ctx); // Call superclass function

        // ctx.fillStyle = 'rgb(' + 200 * this.intensity + ', 0, 0)';
        //
        // let lutValues = wlToRgb[parseInt(this.wavelength) - 380];
        // ctx.fillStyle = 'rgb(' + lutValues[0] * this.intensity + ',' + lutValues[1] * this.intensity + ',' + lutValues[2] * this.intensity;
        //
        // // ctx.fillRect(this.x - 25, this.y - 25, 50, 50);
        // ctx.translate(this.x - 25 * Math.cos(this.rot / 180 * Math.PI), this.y - 25 * Math.sin(this.rot / 180 * Math.PI));
        // ctx.rotate(this.rot * Math.PI / 180);
        // ctx.drawImage(torchImg, -25, -25,50,50);
        // ctx.setTransform(1, 0, 0, 1, 0, 0);
    }

    newAngle(incident) {
        return Math.PI / 2.0 - incident;
    }
}


/***/ }),

/***/ "./js/mirrorCircular.js":
/*!******************************!*\
  !*** ./js/mirrorCircular.js ***!
  \******************************/
/*! exports provided: MirrorCircular */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MirrorCircular", function() { return MirrorCircular; });
/* harmony import */ var _instrumentBiconvex_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./instrumentBiconvex.js */ "./js/instrumentBiconvex.js");


class MirrorCircular extends _instrumentBiconvex_js__WEBPACK_IMPORTED_MODULE_0__["InstrumentBiconvex"] {
    constructor() {
        super();
        this.isMirror = true;
    }

    newAngle(incident) {
        return Math.PI / 2.0 - incident;
    }
}


/***/ }),

/***/ "./js/presets.js":
/*!***********************!*\
  !*** ./js/presets.js ***!
  \***********************/
/*! exports provided: presets */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "presets", function() { return presets; });
let presets = {};

presets['Simple'] = [
    {
        type: 'Torch',
        id: 1,
        x: 150,
        y: 150,
        rot: 0,
        intensity: 0.9,
        wavelength: 595
    },
    {
        type: 'Torch',
        id: 2,
        x: 150,
        y: 180,
        rot: 0,
        intensity: 0.9,
        wavelength: 487
    },
    {
        type: 'Torch',
        id: 3,
        x: 150,
        y: 120,
        rot: 0,
        intensity: 0.9,
        wavelength: 536
    },
    {
        type: 'Mirror',
        id: 4,
        x: 400,
        y: 150,
        rot: -45,
        size: 100
    },
    {
        type: 'Absorber',
        id: 5,
        x: 395,
        y: 420,
        rot: 90,
        size: 100
    }
];

presets['Complex'] = [
    {
        type: 'Torch',
        id: 1,
        x: 50,
        y: 250,
        rot: -10,
        intensity: 1,
        wavelength: 616
    },
    {
        type: 'Torch',
        id: 2,
        x: 50,
        y: 250,
        rot: 0,
        intensity: 1,
        wavelength: 567
    },
    {
        type: 'Torch',
        id: 3,
        x: 50,
        y: 250,
        rot: 10,
        intensity: 1,
        wavelength: 479
    },
    {
        type: 'LensCircular',
        id: 4,
        x: 200,
        y: 250,
        rot: 0,
        radius: 120,
        size: 70,
        n: 1.68,
        dispersion: false
    },
    {
        type: 'LensConcave',
        id: 5,
        x: 300,
        y: 250,
        rot: 0,
        radius: 120,
        size: 70,
        n: 1.7,
        dispersion: false
    },
    {
        type: 'Mirror',
        id: 6,
        x: 500,
        y: 250,
        rot: 45,
        size: 100
    },
    {
        type: 'MirrorCircular',
        id: 7,
        x: 489,
        y: 100,
        rot: 45,
        radius: 200,
        size: 50
    },
    {
        type: 'LensCircular',
        id: 8,
        x: 650,
        y: 104,
        rot: 0,
        radius: 120,
        size: 70,
        n: 1.6,
        dispersion: false
    },
    {
        type: 'Absorber',
        id: 9,
        x: 808,
        y: 100,
        rot: 0,
        size: 100
    }
];

presets['Dispersion'] = [
    {
        type: 'Torch',
        id: 1,
        x: 95,
        y: 160,
        rot: -10,
        intensity: 0.6,
        wavelength: 780
    },
    {
        type: 'Torch',
        id: 2,
        x: 50,
        y: 168,
        rot: -10.02, // this slight difference in rotation accounts for differences in the incident angle
                     // since the torches are not placed directly behind one another
        intensity: 0.48,
        wavelength: 558
    },
    {
        type: 'Torch',
        id: 3,
        x: 150,
        y: 150,
        rot: -10.15,
        intensity: 0.39,
        wavelength: 474
    },
    {
        type: 'LensCircular',
        id: 4,
        x: 300,
        y: 150,
        rot: 0,
        radius: 120,
        size: 70,
        n: 1.4,
        dispersion: true
    },
    {
        type: 'MirrorCircular',
        id: 5,
        x: 725,
        y: 125,
        rot: -47,
        radius: 120,
        size: 70
    }
];

presets['Return Path'] = [
    {
        type: 'Torch',
        id: 1,
        x: 150,
        y: 150,
        rot: -10,
        intensity: 0.9,
        wavelength: 595
    },
    {
        type: 'MirrorCircular',
        id: 2,
        x: 300,
        y: 150,
        rot: 0.23,
        radius: 120,
        size: 70
    },
    {
        type: 'Mirror',
        id: 3,
        x: 154,
        y: 32,
        rot: 64,
        size: 111
    },
    {
        type: 'Mirror',
        id: 4,
        x: 88,
        y: 294,
        rot: -24,
        size: 200
    },
    {
        type: 'LensCircular',
        id: 5,
        x: 257,
        y: 472,
        rot: 61,
        radius: 120,
        size: 70,
        n: 1.4,
        dispersion: false
    },
    {
        type: 'Torch',
        id: 6,
        x: 426,
        y: 617,
        rot: -131,
        intensity: 0.9,
        wavelength: 536
    }
];

presets['Internal Reflection'] = [
    {
        type: 'Torch',
        id: 1,
        x: 150,
        y: 400,
        rot: -10,
        intensity: 1,
        wavelength: 479
    },
    {
        type: 'LensCircular',
        id: 2,
        x: 500,
        y: 400,
        rot: 0,
        radius: 200,
        size: 110,
        n: 3.6,
        dispersion: false
    },
    {
        type: 'Torch',
        id: 3,
        x: 416,
        y: 407,
        rot: 24,
        intensity: 0.9,
        wavelength: 595
    },
    {
        type: 'Absorber',
        id: 4,
        x: 659.8789202060972,
        y: 378.68061422612703,
        rot: 0,
        size: 100
    },
    {
        type: 'Absorber',
        id: 5,
        x: 350,
        y: 458,
        rot: 0,
        size: 45
    }
];

presets['Mirrors'] = [
    {
        type: 'Mirror',
        id: 1,
        x: 400,
        y: 150,
        rot: 90,
        size: 200
    },
    {
        type: 'Mirror',
        id: 2,
        x: 600,
        y: 150,
        rot: 90,
        size: 200
    },
    {
        type: 'Mirror',
        id: 3,
        x: 400,
        y: 250,
        rot: -90,
        size: 200
    },
    {
        type: 'Mirror',
        id: 4,
        x: 600,
        y: 250,
        rot: -90,
        size: 200
    },
    {
        type: 'Torch',
        id: 5,
        x: 266,
        y: 266,
        rot: -71,
        intensity: 0.9,
        wavelength: 595
    },
    {
        type: 'Absorber',
        id: 6,
        x: 700,
        y: 200,
        rot: 0,
        size: 108
    },
    {
        type: 'Torch',
        id: 87,
        x: 450,
        y: 400,
        rot: 0,
        intensity: 0.9,
        wavelength: 585
    },
    {
        type: 'Mirror',
        id: 8,
        x: 200,
        y: 400,
        rot: 0,
        size: 100
    },
    {
        type: 'Mirror',
        id: 9,
        x: 700,
        y: 400,
        rot: 0,
        size: 100
    }
];

presets['Mess'] = [
    {
        type: 'Torch',
        id: 1,
        x: 150,
        y: 150,
        rot: -10,
        intensity: 0.9,
        wavelength: 571.4355034466466
    },
    {
        type: 'MirrorCircular',
        id: 2,
        x: 284.94784556613695,
        y: 125.6021388441539,
        rot: -33,
        radius: 120,
        size: 40.58082898215268
    },
    {
        type: 'Mirror',
        id: 3,
        x: 59.989200782160864,
        y: 425.54699855612205,
        rot: -27.55733908483947,
        size: 84.69036717508918
    },
    {
        type: 'Torch',
        id: 4,
        x: 116.22886197815488,
        y: 134.9754157101529,
        rot: -3.7381884606537596,
        intensity: 0.9,
        wavelength: 531.7369190730037
    },
    {
        type: 'Torch',
        id: 5,
        x: 472.41338288611706,
        y: 150,
        rot: -180,
        intensity: 0.9,
        wavelength: 456.7507041450117
    },
    {
        type: 'Mirror',
        id: 6,
        x: 350.56078362813,
        y: 106.85558511215588,
        rot: 101,
        size: 25.14249061462491
    },
    {
        type: 'LensConcave',
        id: 7,
        x: 463.04010602011806,
        y: 406.800444824124,
        rot: 180,
        radius: 160,
        size: 49.40273662073999,
        n: 1.5510578875430903,
        dispersion: true
    },
    {
        type: 'Mirror',
        id: 8,
        x: 716.1185814020911,
        y: 275.57456870013795,
        rot: -55.346348146389474,
        size: 80
    },
    {
        type: 'Mirror',
        id: 9,
        x: 678.6254739380951,
        y: 388.053891092126,
        rot: -47.4066312716609,
        size: 33.96439825321222
    },
    {
        type: 'Mirror',
        id: 10,
        x: 716.1185814020911,
        y: 472.41338288611706,
        rot: -39.46691439693234,
        size: 20.731536795331266
    },
    {
        type: 'Torch',
        id: 11,
        x: 547.399597814109,
        y: 669.2521970720961,
        rot: -114.89422470685373,
        intensity: 0.9,
        wavelength: 769.9284253148608
    },
    {
        type: 'MirrorCircular',
        id: 12,
        x: 491.15993661811507,
        y: 284.94784556613695,
        rot: 24.050820600896202,
        radius: 35,
        size: 29.553444433918564
    },
    {
        type: 'LensCircular',
        id: 13,
        x: 706.7453045360921,
        y: 584.892705278105,
        rot: -138.71337533103943,
        radius: 120,
        size: 62.63559807862094,
        n: 1.2345719510087712,
        dispersion: true
    },
    {
        type: 'Mirror',
        id: 14,
        x: 753.6116888660872,
        y: 669.2521970720961,
        rot: 39.93025435035335,
        size: 185.5912338792443
    },
    {
        type: 'Torch',
        id: 15,
        x: 191.21507690614692,
        y: 622.385812742101,
        rot: 4.201528414074801,
        intensity: 0.9,
        wavelength: 595
    },
    {
        type: 'Mirror',
        id: 17,
        x: 556.7728746801081,
        y: 172.4685231741489,
        rot: -106.65,
        size: 38.375352072505855
    },
    {
        type: 'Torch',
        id: 18,
        x: 125.6021388441539,
        y: 69.36247764815987,
        rot: 38.75,
        intensity: 0.9,
        wavelength: 496.44928851865455
    },
    {
        type: 'Torch',
        id: 19,
        x: 631.7590896081001,
        y: 150,
        rot: 137.7,
        intensity: 0.9,
        wavelength: 483.21642706077364
    },
    {
        type: 'Absorber',
        id: 20,
        x: 60,
        y: 25,
        rot: 45,
        size: 40
    }
];


/***/ }),

/***/ "./js/ray.js":
/*!*******************!*\
  !*** ./js/ray.js ***!
  \*******************/
/*! exports provided: Ray */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Ray", function() { return Ray; });
/* harmony import */ var _lookup__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lookup */ "./js/lookup.js");
/* harmony import */ var _absorber__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./absorber */ "./js/absorber.js");



class Ray {
    constructor(startX, startY, rot, intensity, wavelength = 595) {
        this.x = startX;
        this.y = startY;

        // Store rotation in radians
        this.rot = rot / 180 * Math.PI;

        this.intensity = intensity;
        this.wavelength = wavelength;

        // The RGB colour of the ray
        this.colour = _lookup__WEBPACK_IMPORTED_MODULE_0__["wlToRgb"][parseInt(wavelength) - 380];
    }

    /**
     * Given a ray point, find intersections with an object
     */
    _findCollisions(x, y, rot, object) {
        if (object.points.length <= 1) throw new Error("An instrument needs at least 2 points.");

        const threshold = Math.pow(2 / parseFloat(conf.stepsHi), 2);

        for (let i = 0; i < object.points.length; i++) {
            let point = object.points[i];

            if (Math.pow(x - point[0], 2) + Math.pow(y - point[1], 2) <= threshold) {
                // We found an intersection!
                if (conf.debug) {
                    // Mark the precise points for debugging, if enabled
                    ctx.fillStyle = 'rgb(50,255,255)';
                    ctx.fillRect(x - 4, y - 4, 8, 8);
                }

                // Find the angle of incidence
                // First, we need to find the closest point on the line
                let secondPoint;
                if (i < object.points.length - 1) {
                    secondPoint = object.points[i + 1];
                } else {
                    // swap the points
                    secondPoint = point;
                    point = object.points[i - 1];
                }

                // Find the angle of the object line
                let ang1 = -Math.atan2(secondPoint[1] - point[1], secondPoint[0] - point[0]);

                // incidentAngle = 180o + rayAngle - objectAngle - 90o
                let incident = -rot - ang1 + Math.PI / 2.0;
                let newAngle = object.newAngle(incident, this.wavelength);

                if (isFinite(newAngle)) {
                    return -newAngle - ang1;
                }

                return newAngle;
            }
        }

        return null;
    }

    draw(ctx, objects) {
        ctx.strokeStyle = 'rgba(' + this.colour[0] + ',' + this.colour[1] + ',' + this.colour[2] + ',' + (0.2 + 0.8 * this.intensity) + ')';
        ctx.lineWidth = 0.5 + 3 * this.intensity;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);

        let rotation = this.rot; // current rotation
        let x = this.x;
        let y = this.y;
        let cooldown = 0;

        const step = 1 / parseFloat(conf.stepsLo);
        const smallStep = 1 / parseFloat(conf.stepsHi);

        let self = this;
        const max = conf.maxSteps;
        let rayAbsorbed = false;

        for (let i = 0; i < max; i++) {
            // A list of objects that are close to our ray and should be examined for intersection
            let closeObjects = [];
            if (cooldown === 0) {
                objects.every(function (object) {
                    if (!object.affectsLight) return true; // We don't care about torches

                    if (Math.pow(x - object.x, 2) + Math.pow(y - object.y, 2) <= object.maxDistance + 10.0) {
                        // We are close!
                        closeObjects.push(object);

                        // Find all the points of the object. If we are close enough to one of them,
                        // perform the intersection.
                        let result = self._findCollisions(x, y, rotation, object);
                        if (result instanceof _absorber__WEBPACK_IMPORTED_MODULE_1__["RayAbsorbed"]) {
                            // The ray has been absorbed -- no more points to draw!
                            rayAbsorbed = true;

                            if (conf.debug) {
                                // Mark the precise points for debugging, if enabled
                                ctx.fillStyle = 'rgb(255,0,0)';
                                ctx.fillRect(x - 3, y - 3, 6, 6);
                            }

                            return false;
                        } else if (result !== null) {
                            // Intersection found!
                            rotation = result;

                            // Prevent a second collision from occuring, since we are still very
                            // close to the specified object
                            cooldown += 3;

                            // Don't look for more intersections
                            return false;
                        }
                    }

                    return true;
                });
            } else {
                cooldown--;
            }

            if (rayAbsorbed) {
                // The ray has been absorbed. Don't continue to draw anything.
                break;
            }
            if (closeObjects.length !== 0) {
                // An object is close. Reduce the step for increased precision.
                x += smallStep * Math.cos(rotation);
                y += smallStep * Math.sin(rotation);

                if (conf.debug) {
                    // Mark the precise points for debugging, if enabled
                    ctx.fillStyle = 'rgb(50,50,255)';
                    ctx.fillRect(x - 3, y - 3, 6, 6);
                }
            } else {
                // No objects are close; continue running in a linear trajectory
                x += step * Math.cos(rotation);
                y += step * Math.sin(rotation);

                if (conf.debug) {
                    // Mark the precise points for debugging, if enabled
                    ctx.fillStyle = 'rgb(0,0,50)';
                    ctx.fillRect(x - 3, y - 3, 6, 6);
                }
            }

            if (x < 0 || x > conf.canvasWidth || y < 0 || y > conf.canvasHeight) {
                // Got outside of bounds!

                if (conf.debug) {
                    // Mark the precise points for debugging, if enabled
                    ctx.fillStyle = 'rgb(200,0,0)';
                    ctx.fillRect(x - 8, y - 8, 16, 16);
                }

                // Don't continue rendering
                break;
            }

            ctx.lineTo(x, y);
        }

        ctx.stroke();
    }
}


/***/ }),

/***/ "./js/torch.js":
/*!*********************!*\
  !*** ./js/torch.js ***!
  \*********************/
/*! exports provided: Torch */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Torch", function() { return Torch; });
/* harmony import */ var _instrument_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./instrument.js */ "./js/instrument.js");
/* harmony import */ var _ray_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ray.js */ "./js/ray.js");
/* harmony import */ var _lookup_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./lookup.js */ "./js/lookup.js");




let torchImg = new Image();
torchImg.src = 'imgs/torch.svg';
// torchImg.addEventListener('load', draw, false);

class Torch extends _instrument_js__WEBPACK_IMPORTED_MODULE_0__["Instrument"] {
    constructor(x, y) {
        super(150, 150);
        this.affectsLight = false;

        this.rot = -10;

        this.intensity = 0.9;
        this.wavelength = 595;

        this.exportedProperties = [
            'x', 'y', 'rot', 'intensity', 'wavelength'
        ];
    }

    prepareRayTracingPoints() {
        this.maxVerticalDistance = 25;
    }

    draw(ctx) {
        super.draw(ctx); // Call parent class function

        // ctx.fillRect(this.x - 25, this.y - 25, 50, 50);
        ctx.translate(this.x - 25 * Math.cos(this.rot / 180 * Math.PI), this.y - 25 * Math.sin(this.rot / 180 * Math.PI));
        ctx.rotate(this.rot * Math.PI / 180);
        ctx.drawImage(torchImg, -25, -25,50,50);
        ctx.setTransform(1, 0, 0, 1, 0, 0);
    }

    getRays() {
        return [
            new _ray_js__WEBPACK_IMPORTED_MODULE_1__["Ray"](this.x, this.y, this.rot, this.intensity, this.wavelength)
        ];
    }
}


/***/ }),

/***/ "./js/utilities.js":
/*!*************************!*\
  !*** ./js/utilities.js ***!
  \*************************/
/*! exports provided: getCauchyB, getDispersion */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getCauchyB", function() { return getCauchyB; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getDispersion", function() { return getDispersion; });
const AvgWavelength = 580;

// Constants for dispersion calculation based on Cauchy's equation
// Source: https://en.wikipedia.org/wiki/Cauchy%27s_equation
function getCauchyB(averageN)
{
    // Exaggerate dispersion if needed
    const CauchyC = (conf.realisticDispersion) ? 0.01 * 1000000 : 0.1 * 1000000;

    return averageN - CauchyC / Math.pow(AvgWavelength, 2);
}

// Calculate refractive index based on Cauchy's Equation
function getDispersion(cauchyB, wavelength)
{
    // Exaggerate dispersion if needed
    const CauchyC = (conf.realisticDispersion) ? 0.01 * 1000000 : 0.1 * 1000000;

    // n(l) = B + C/(l^2)
    return cauchyB + CauchyC / Math.pow(wavelength, 2);
}


/***/ }),

/***/ "./node_modules/dat.gui/build/dat.gui.module.js":
/*!******************************************************!*\
  !*** ./node_modules/dat.gui/build/dat.gui.module.js ***!
  \******************************************************/
/*! exports provided: color, controllers, dom, gui, GUI, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "color", function() { return color; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "controllers", function() { return controllers; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "dom", function() { return dom$1; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "gui", function() { return gui; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GUI", function() { return GUI$1; });
/**
 * dat-gui JavaScript Controller Library
 * http://code.google.com/p/dat-gui
 *
 * Copyright 2011 Data Arts Team, Google Creative Lab
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 */

function ___$insertStyle(css) {
  if (!css) {
    return;
  }
  if (typeof window === 'undefined') {
    return;
  }

  var style = document.createElement('style');

  style.setAttribute('type', 'text/css');
  style.innerHTML = css;
  document.head.appendChild(style);

  return css;
}

function colorToString (color, forceCSSHex) {
  var colorFormat = color.__state.conversionName.toString();
  var r = Math.round(color.r);
  var g = Math.round(color.g);
  var b = Math.round(color.b);
  var a = color.a;
  var h = Math.round(color.h);
  var s = color.s.toFixed(1);
  var v = color.v.toFixed(1);
  if (forceCSSHex || colorFormat === 'THREE_CHAR_HEX' || colorFormat === 'SIX_CHAR_HEX') {
    var str = color.hex.toString(16);
    while (str.length < 6) {
      str = '0' + str;
    }
    return '#' + str;
  } else if (colorFormat === 'CSS_RGB') {
    return 'rgb(' + r + ',' + g + ',' + b + ')';
  } else if (colorFormat === 'CSS_RGBA') {
    return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
  } else if (colorFormat === 'HEX') {
    return '0x' + color.hex.toString(16);
  } else if (colorFormat === 'RGB_ARRAY') {
    return '[' + r + ',' + g + ',' + b + ']';
  } else if (colorFormat === 'RGBA_ARRAY') {
    return '[' + r + ',' + g + ',' + b + ',' + a + ']';
  } else if (colorFormat === 'RGB_OBJ') {
    return '{r:' + r + ',g:' + g + ',b:' + b + '}';
  } else if (colorFormat === 'RGBA_OBJ') {
    return '{r:' + r + ',g:' + g + ',b:' + b + ',a:' + a + '}';
  } else if (colorFormat === 'HSV_OBJ') {
    return '{h:' + h + ',s:' + s + ',v:' + v + '}';
  } else if (colorFormat === 'HSVA_OBJ') {
    return '{h:' + h + ',s:' + s + ',v:' + v + ',a:' + a + '}';
  }
  return 'unknown format';
}

var ARR_EACH = Array.prototype.forEach;
var ARR_SLICE = Array.prototype.slice;
var Common = {
  BREAK: {},
  extend: function extend(target) {
    this.each(ARR_SLICE.call(arguments, 1), function (obj) {
      var keys = this.isObject(obj) ? Object.keys(obj) : [];
      keys.forEach(function (key) {
        if (!this.isUndefined(obj[key])) {
          target[key] = obj[key];
        }
      }.bind(this));
    }, this);
    return target;
  },
  defaults: function defaults(target) {
    this.each(ARR_SLICE.call(arguments, 1), function (obj) {
      var keys = this.isObject(obj) ? Object.keys(obj) : [];
      keys.forEach(function (key) {
        if (this.isUndefined(target[key])) {
          target[key] = obj[key];
        }
      }.bind(this));
    }, this);
    return target;
  },
  compose: function compose() {
    var toCall = ARR_SLICE.call(arguments);
    return function () {
      var args = ARR_SLICE.call(arguments);
      for (var i = toCall.length - 1; i >= 0; i--) {
        args = [toCall[i].apply(this, args)];
      }
      return args[0];
    };
  },
  each: function each(obj, itr, scope) {
    if (!obj) {
      return;
    }
    if (ARR_EACH && obj.forEach && obj.forEach === ARR_EACH) {
      obj.forEach(itr, scope);
    } else if (obj.length === obj.length + 0) {
      var key = void 0;
      var l = void 0;
      for (key = 0, l = obj.length; key < l; key++) {
        if (key in obj && itr.call(scope, obj[key], key) === this.BREAK) {
          return;
        }
      }
    } else {
      for (var _key in obj) {
        if (itr.call(scope, obj[_key], _key) === this.BREAK) {
          return;
        }
      }
    }
  },
  defer: function defer(fnc) {
    setTimeout(fnc, 0);
  },
  debounce: function debounce(func, threshold, callImmediately) {
    var timeout = void 0;
    return function () {
      var obj = this;
      var args = arguments;
      function delayed() {
        timeout = null;
        if (!callImmediately) func.apply(obj, args);
      }
      var callNow = callImmediately || !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(delayed, threshold);
      if (callNow) {
        func.apply(obj, args);
      }
    };
  },
  toArray: function toArray(obj) {
    if (obj.toArray) return obj.toArray();
    return ARR_SLICE.call(obj);
  },
  isUndefined: function isUndefined(obj) {
    return obj === undefined;
  },
  isNull: function isNull(obj) {
    return obj === null;
  },
  isNaN: function (_isNaN) {
    function isNaN(_x) {
      return _isNaN.apply(this, arguments);
    }
    isNaN.toString = function () {
      return _isNaN.toString();
    };
    return isNaN;
  }(function (obj) {
    return isNaN(obj);
  }),
  isArray: Array.isArray || function (obj) {
    return obj.constructor === Array;
  },
  isObject: function isObject(obj) {
    return obj === Object(obj);
  },
  isNumber: function isNumber(obj) {
    return obj === obj + 0;
  },
  isString: function isString(obj) {
    return obj === obj + '';
  },
  isBoolean: function isBoolean(obj) {
    return obj === false || obj === true;
  },
  isFunction: function isFunction(obj) {
    return Object.prototype.toString.call(obj) === '[object Function]';
  }
};

var INTERPRETATIONS = [
{
  litmus: Common.isString,
  conversions: {
    THREE_CHAR_HEX: {
      read: function read(original) {
        var test = original.match(/^#([A-F0-9])([A-F0-9])([A-F0-9])$/i);
        if (test === null) {
          return false;
        }
        return {
          space: 'HEX',
          hex: parseInt('0x' + test[1].toString() + test[1].toString() + test[2].toString() + test[2].toString() + test[3].toString() + test[3].toString(), 0)
        };
      },
      write: colorToString
    },
    SIX_CHAR_HEX: {
      read: function read(original) {
        var test = original.match(/^#([A-F0-9]{6})$/i);
        if (test === null) {
          return false;
        }
        return {
          space: 'HEX',
          hex: parseInt('0x' + test[1].toString(), 0)
        };
      },
      write: colorToString
    },
    CSS_RGB: {
      read: function read(original) {
        var test = original.match(/^rgb\(\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*\)/);
        if (test === null) {
          return false;
        }
        return {
          space: 'RGB',
          r: parseFloat(test[1]),
          g: parseFloat(test[2]),
          b: parseFloat(test[3])
        };
      },
      write: colorToString
    },
    CSS_RGBA: {
      read: function read(original) {
        var test = original.match(/^rgba\(\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*\)/);
        if (test === null) {
          return false;
        }
        return {
          space: 'RGB',
          r: parseFloat(test[1]),
          g: parseFloat(test[2]),
          b: parseFloat(test[3]),
          a: parseFloat(test[4])
        };
      },
      write: colorToString
    }
  }
},
{
  litmus: Common.isNumber,
  conversions: {
    HEX: {
      read: function read(original) {
        return {
          space: 'HEX',
          hex: original,
          conversionName: 'HEX'
        };
      },
      write: function write(color) {
        return color.hex;
      }
    }
  }
},
{
  litmus: Common.isArray,
  conversions: {
    RGB_ARRAY: {
      read: function read(original) {
        if (original.length !== 3) {
          return false;
        }
        return {
          space: 'RGB',
          r: original[0],
          g: original[1],
          b: original[2]
        };
      },
      write: function write(color) {
        return [color.r, color.g, color.b];
      }
    },
    RGBA_ARRAY: {
      read: function read(original) {
        if (original.length !== 4) return false;
        return {
          space: 'RGB',
          r: original[0],
          g: original[1],
          b: original[2],
          a: original[3]
        };
      },
      write: function write(color) {
        return [color.r, color.g, color.b, color.a];
      }
    }
  }
},
{
  litmus: Common.isObject,
  conversions: {
    RGBA_OBJ: {
      read: function read(original) {
        if (Common.isNumber(original.r) && Common.isNumber(original.g) && Common.isNumber(original.b) && Common.isNumber(original.a)) {
          return {
            space: 'RGB',
            r: original.r,
            g: original.g,
            b: original.b,
            a: original.a
          };
        }
        return false;
      },
      write: function write(color) {
        return {
          r: color.r,
          g: color.g,
          b: color.b,
          a: color.a
        };
      }
    },
    RGB_OBJ: {
      read: function read(original) {
        if (Common.isNumber(original.r) && Common.isNumber(original.g) && Common.isNumber(original.b)) {
          return {
            space: 'RGB',
            r: original.r,
            g: original.g,
            b: original.b
          };
        }
        return false;
      },
      write: function write(color) {
        return {
          r: color.r,
          g: color.g,
          b: color.b
        };
      }
    },
    HSVA_OBJ: {
      read: function read(original) {
        if (Common.isNumber(original.h) && Common.isNumber(original.s) && Common.isNumber(original.v) && Common.isNumber(original.a)) {
          return {
            space: 'HSV',
            h: original.h,
            s: original.s,
            v: original.v,
            a: original.a
          };
        }
        return false;
      },
      write: function write(color) {
        return {
          h: color.h,
          s: color.s,
          v: color.v,
          a: color.a
        };
      }
    },
    HSV_OBJ: {
      read: function read(original) {
        if (Common.isNumber(original.h) && Common.isNumber(original.s) && Common.isNumber(original.v)) {
          return {
            space: 'HSV',
            h: original.h,
            s: original.s,
            v: original.v
          };
        }
        return false;
      },
      write: function write(color) {
        return {
          h: color.h,
          s: color.s,
          v: color.v
        };
      }
    }
  }
}];
var result = void 0;
var toReturn = void 0;
var interpret = function interpret() {
  toReturn = false;
  var original = arguments.length > 1 ? Common.toArray(arguments) : arguments[0];
  Common.each(INTERPRETATIONS, function (family) {
    if (family.litmus(original)) {
      Common.each(family.conversions, function (conversion, conversionName) {
        result = conversion.read(original);
        if (toReturn === false && result !== false) {
          toReturn = result;
          result.conversionName = conversionName;
          result.conversion = conversion;
          return Common.BREAK;
        }
      });
      return Common.BREAK;
    }
  });
  return toReturn;
};

var tmpComponent = void 0;
var ColorMath = {
  hsv_to_rgb: function hsv_to_rgb(h, s, v) {
    var hi = Math.floor(h / 60) % 6;
    var f = h / 60 - Math.floor(h / 60);
    var p = v * (1.0 - s);
    var q = v * (1.0 - f * s);
    var t = v * (1.0 - (1.0 - f) * s);
    var c = [[v, t, p], [q, v, p], [p, v, t], [p, q, v], [t, p, v], [v, p, q]][hi];
    return {
      r: c[0] * 255,
      g: c[1] * 255,
      b: c[2] * 255
    };
  },
  rgb_to_hsv: function rgb_to_hsv(r, g, b) {
    var min = Math.min(r, g, b);
    var max = Math.max(r, g, b);
    var delta = max - min;
    var h = void 0;
    var s = void 0;
    if (max !== 0) {
      s = delta / max;
    } else {
      return {
        h: NaN,
        s: 0,
        v: 0
      };
    }
    if (r === max) {
      h = (g - b) / delta;
    } else if (g === max) {
      h = 2 + (b - r) / delta;
    } else {
      h = 4 + (r - g) / delta;
    }
    h /= 6;
    if (h < 0) {
      h += 1;
    }
    return {
      h: h * 360,
      s: s,
      v: max / 255
    };
  },
  rgb_to_hex: function rgb_to_hex(r, g, b) {
    var hex = this.hex_with_component(0, 2, r);
    hex = this.hex_with_component(hex, 1, g);
    hex = this.hex_with_component(hex, 0, b);
    return hex;
  },
  component_from_hex: function component_from_hex(hex, componentIndex) {
    return hex >> componentIndex * 8 & 0xFF;
  },
  hex_with_component: function hex_with_component(hex, componentIndex, value) {
    return value << (tmpComponent = componentIndex * 8) | hex & ~(0xFF << tmpComponent);
  }
};

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};











var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();







var get = function get(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var Color = function () {
  function Color() {
    classCallCheck(this, Color);
    this.__state = interpret.apply(this, arguments);
    if (this.__state === false) {
      throw new Error('Failed to interpret color arguments');
    }
    this.__state.a = this.__state.a || 1;
  }
  createClass(Color, [{
    key: 'toString',
    value: function toString() {
      return colorToString(this);
    }
  }, {
    key: 'toHexString',
    value: function toHexString() {
      return colorToString(this, true);
    }
  }, {
    key: 'toOriginal',
    value: function toOriginal() {
      return this.__state.conversion.write(this);
    }
  }]);
  return Color;
}();
function defineRGBComponent(target, component, componentHexIndex) {
  Object.defineProperty(target, component, {
    get: function get$$1() {
      if (this.__state.space === 'RGB') {
        return this.__state[component];
      }
      Color.recalculateRGB(this, component, componentHexIndex);
      return this.__state[component];
    },
    set: function set$$1(v) {
      if (this.__state.space !== 'RGB') {
        Color.recalculateRGB(this, component, componentHexIndex);
        this.__state.space = 'RGB';
      }
      this.__state[component] = v;
    }
  });
}
function defineHSVComponent(target, component) {
  Object.defineProperty(target, component, {
    get: function get$$1() {
      if (this.__state.space === 'HSV') {
        return this.__state[component];
      }
      Color.recalculateHSV(this);
      return this.__state[component];
    },
    set: function set$$1(v) {
      if (this.__state.space !== 'HSV') {
        Color.recalculateHSV(this);
        this.__state.space = 'HSV';
      }
      this.__state[component] = v;
    }
  });
}
Color.recalculateRGB = function (color, component, componentHexIndex) {
  if (color.__state.space === 'HEX') {
    color.__state[component] = ColorMath.component_from_hex(color.__state.hex, componentHexIndex);
  } else if (color.__state.space === 'HSV') {
    Common.extend(color.__state, ColorMath.hsv_to_rgb(color.__state.h, color.__state.s, color.__state.v));
  } else {
    throw new Error('Corrupted color state');
  }
};
Color.recalculateHSV = function (color) {
  var result = ColorMath.rgb_to_hsv(color.r, color.g, color.b);
  Common.extend(color.__state, {
    s: result.s,
    v: result.v
  });
  if (!Common.isNaN(result.h)) {
    color.__state.h = result.h;
  } else if (Common.isUndefined(color.__state.h)) {
    color.__state.h = 0;
  }
};
Color.COMPONENTS = ['r', 'g', 'b', 'h', 's', 'v', 'hex', 'a'];
defineRGBComponent(Color.prototype, 'r', 2);
defineRGBComponent(Color.prototype, 'g', 1);
defineRGBComponent(Color.prototype, 'b', 0);
defineHSVComponent(Color.prototype, 'h');
defineHSVComponent(Color.prototype, 's');
defineHSVComponent(Color.prototype, 'v');
Object.defineProperty(Color.prototype, 'a', {
  get: function get$$1() {
    return this.__state.a;
  },
  set: function set$$1(v) {
    this.__state.a = v;
  }
});
Object.defineProperty(Color.prototype, 'hex', {
  get: function get$$1() {
    if (!this.__state.space !== 'HEX') {
      this.__state.hex = ColorMath.rgb_to_hex(this.r, this.g, this.b);
    }
    return this.__state.hex;
  },
  set: function set$$1(v) {
    this.__state.space = 'HEX';
    this.__state.hex = v;
  }
});

var Controller = function () {
  function Controller(object, property) {
    classCallCheck(this, Controller);
    this.initialValue = object[property];
    this.domElement = document.createElement('div');
    this.object = object;
    this.property = property;
    this.__onChange = undefined;
    this.__onFinishChange = undefined;
  }
  createClass(Controller, [{
    key: 'onChange',
    value: function onChange(fnc) {
      this.__onChange = fnc;
      return this;
    }
  }, {
    key: 'onFinishChange',
    value: function onFinishChange(fnc) {
      this.__onFinishChange = fnc;
      return this;
    }
  }, {
    key: 'setValue',
    value: function setValue(newValue) {
      this.object[this.property] = newValue;
      if (this.__onChange) {
        this.__onChange.call(this, newValue);
      }
      this.updateDisplay();
      return this;
    }
  }, {
    key: 'getValue',
    value: function getValue() {
      return this.object[this.property];
    }
  }, {
    key: 'updateDisplay',
    value: function updateDisplay() {
      return this;
    }
  }, {
    key: 'isModified',
    value: function isModified() {
      return this.initialValue !== this.getValue();
    }
  }]);
  return Controller;
}();

var EVENT_MAP = {
  HTMLEvents: ['change'],
  MouseEvents: ['click', 'mousemove', 'mousedown', 'mouseup', 'mouseover'],
  KeyboardEvents: ['keydown']
};
var EVENT_MAP_INV = {};
Common.each(EVENT_MAP, function (v, k) {
  Common.each(v, function (e) {
    EVENT_MAP_INV[e] = k;
  });
});
var CSS_VALUE_PIXELS = /(\d+(\.\d+)?)px/;
function cssValueToPixels(val) {
  if (val === '0' || Common.isUndefined(val)) {
    return 0;
  }
  var match = val.match(CSS_VALUE_PIXELS);
  if (!Common.isNull(match)) {
    return parseFloat(match[1]);
  }
  return 0;
}
var dom = {
  makeSelectable: function makeSelectable(elem, selectable) {
    if (elem === undefined || elem.style === undefined) return;
    elem.onselectstart = selectable ? function () {
      return false;
    } : function () {};
    elem.style.MozUserSelect = selectable ? 'auto' : 'none';
    elem.style.KhtmlUserSelect = selectable ? 'auto' : 'none';
    elem.unselectable = selectable ? 'on' : 'off';
  },
  makeFullscreen: function makeFullscreen(elem, hor, vert) {
    var vertical = vert;
    var horizontal = hor;
    if (Common.isUndefined(horizontal)) {
      horizontal = true;
    }
    if (Common.isUndefined(vertical)) {
      vertical = true;
    }
    elem.style.position = 'absolute';
    if (horizontal) {
      elem.style.left = 0;
      elem.style.right = 0;
    }
    if (vertical) {
      elem.style.top = 0;
      elem.style.bottom = 0;
    }
  },
  fakeEvent: function fakeEvent(elem, eventType, pars, aux) {
    var params = pars || {};
    var className = EVENT_MAP_INV[eventType];
    if (!className) {
      throw new Error('Event type ' + eventType + ' not supported.');
    }
    var evt = document.createEvent(className);
    switch (className) {
      case 'MouseEvents':
        {
          var clientX = params.x || params.clientX || 0;
          var clientY = params.y || params.clientY || 0;
          evt.initMouseEvent(eventType, params.bubbles || false, params.cancelable || true, window, params.clickCount || 1, 0,
          0,
          clientX,
          clientY,
          false, false, false, false, 0, null);
          break;
        }
      case 'KeyboardEvents':
        {
          var init = evt.initKeyboardEvent || evt.initKeyEvent;
          Common.defaults(params, {
            cancelable: true,
            ctrlKey: false,
            altKey: false,
            shiftKey: false,
            metaKey: false,
            keyCode: undefined,
            charCode: undefined
          });
          init(eventType, params.bubbles || false, params.cancelable, window, params.ctrlKey, params.altKey, params.shiftKey, params.metaKey, params.keyCode, params.charCode);
          break;
        }
      default:
        {
          evt.initEvent(eventType, params.bubbles || false, params.cancelable || true);
          break;
        }
    }
    Common.defaults(evt, aux);
    elem.dispatchEvent(evt);
  },
  bind: function bind(elem, event, func, newBool) {
    var bool = newBool || false;
    if (elem.addEventListener) {
      elem.addEventListener(event, func, bool);
    } else if (elem.attachEvent) {
      elem.attachEvent('on' + event, func);
    }
    return dom;
  },
  unbind: function unbind(elem, event, func, newBool) {
    var bool = newBool || false;
    if (elem.removeEventListener) {
      elem.removeEventListener(event, func, bool);
    } else if (elem.detachEvent) {
      elem.detachEvent('on' + event, func);
    }
    return dom;
  },
  addClass: function addClass(elem, className) {
    if (elem.className === undefined) {
      elem.className = className;
    } else if (elem.className !== className) {
      var classes = elem.className.split(/ +/);
      if (classes.indexOf(className) === -1) {
        classes.push(className);
        elem.className = classes.join(' ').replace(/^\s+/, '').replace(/\s+$/, '');
      }
    }
    return dom;
  },
  removeClass: function removeClass(elem, className) {
    if (className) {
      if (elem.className === className) {
        elem.removeAttribute('class');
      } else {
        var classes = elem.className.split(/ +/);
        var index = classes.indexOf(className);
        if (index !== -1) {
          classes.splice(index, 1);
          elem.className = classes.join(' ');
        }
      }
    } else {
      elem.className = undefined;
    }
    return dom;
  },
  hasClass: function hasClass(elem, className) {
    return new RegExp('(?:^|\\s+)' + className + '(?:\\s+|$)').test(elem.className) || false;
  },
  getWidth: function getWidth(elem) {
    var style = getComputedStyle(elem);
    return cssValueToPixels(style['border-left-width']) + cssValueToPixels(style['border-right-width']) + cssValueToPixels(style['padding-left']) + cssValueToPixels(style['padding-right']) + cssValueToPixels(style.width);
  },
  getHeight: function getHeight(elem) {
    var style = getComputedStyle(elem);
    return cssValueToPixels(style['border-top-width']) + cssValueToPixels(style['border-bottom-width']) + cssValueToPixels(style['padding-top']) + cssValueToPixels(style['padding-bottom']) + cssValueToPixels(style.height);
  },
  getOffset: function getOffset(el) {
    var elem = el;
    var offset = { left: 0, top: 0 };
    if (elem.offsetParent) {
      do {
        offset.left += elem.offsetLeft;
        offset.top += elem.offsetTop;
        elem = elem.offsetParent;
      } while (elem);
    }
    return offset;
  },
  isActive: function isActive(elem) {
    return elem === document.activeElement && (elem.type || elem.href);
  }
};

var BooleanController = function (_Controller) {
  inherits(BooleanController, _Controller);
  function BooleanController(object, property) {
    classCallCheck(this, BooleanController);
    var _this2 = possibleConstructorReturn(this, (BooleanController.__proto__ || Object.getPrototypeOf(BooleanController)).call(this, object, property));
    var _this = _this2;
    _this2.__prev = _this2.getValue();
    _this2.__checkbox = document.createElement('input');
    _this2.__checkbox.setAttribute('type', 'checkbox');
    function onChange() {
      _this.setValue(!_this.__prev);
    }
    dom.bind(_this2.__checkbox, 'change', onChange, false);
    _this2.domElement.appendChild(_this2.__checkbox);
    _this2.updateDisplay();
    return _this2;
  }
  createClass(BooleanController, [{
    key: 'setValue',
    value: function setValue(v) {
      var toReturn = get(BooleanController.prototype.__proto__ || Object.getPrototypeOf(BooleanController.prototype), 'setValue', this).call(this, v);
      if (this.__onFinishChange) {
        this.__onFinishChange.call(this, this.getValue());
      }
      this.__prev = this.getValue();
      return toReturn;
    }
  }, {
    key: 'updateDisplay',
    value: function updateDisplay() {
      if (this.getValue() === true) {
        this.__checkbox.setAttribute('checked', 'checked');
        this.__checkbox.checked = true;
        this.__prev = true;
      } else {
        this.__checkbox.checked = false;
        this.__prev = false;
      }
      return get(BooleanController.prototype.__proto__ || Object.getPrototypeOf(BooleanController.prototype), 'updateDisplay', this).call(this);
    }
  }]);
  return BooleanController;
}(Controller);

var OptionController = function (_Controller) {
  inherits(OptionController, _Controller);
  function OptionController(object, property, opts) {
    classCallCheck(this, OptionController);
    var _this2 = possibleConstructorReturn(this, (OptionController.__proto__ || Object.getPrototypeOf(OptionController)).call(this, object, property));
    var options = opts;
    var _this = _this2;
    _this2.__select = document.createElement('select');
    if (Common.isArray(options)) {
      var map = {};
      Common.each(options, function (element) {
        map[element] = element;
      });
      options = map;
    }
    Common.each(options, function (value, key) {
      var opt = document.createElement('option');
      opt.innerHTML = key;
      opt.setAttribute('value', value);
      _this.__select.appendChild(opt);
    });
    _this2.updateDisplay();
    dom.bind(_this2.__select, 'change', function () {
      var desiredValue = this.options[this.selectedIndex].value;
      _this.setValue(desiredValue);
    });
    _this2.domElement.appendChild(_this2.__select);
    return _this2;
  }
  createClass(OptionController, [{
    key: 'setValue',
    value: function setValue(v) {
      var toReturn = get(OptionController.prototype.__proto__ || Object.getPrototypeOf(OptionController.prototype), 'setValue', this).call(this, v);
      if (this.__onFinishChange) {
        this.__onFinishChange.call(this, this.getValue());
      }
      return toReturn;
    }
  }, {
    key: 'updateDisplay',
    value: function updateDisplay() {
      if (dom.isActive(this.__select)) return this;
      this.__select.value = this.getValue();
      return get(OptionController.prototype.__proto__ || Object.getPrototypeOf(OptionController.prototype), 'updateDisplay', this).call(this);
    }
  }]);
  return OptionController;
}(Controller);

var StringController = function (_Controller) {
  inherits(StringController, _Controller);
  function StringController(object, property) {
    classCallCheck(this, StringController);
    var _this2 = possibleConstructorReturn(this, (StringController.__proto__ || Object.getPrototypeOf(StringController)).call(this, object, property));
    var _this = _this2;
    function onChange() {
      _this.setValue(_this.__input.value);
    }
    function onBlur() {
      if (_this.__onFinishChange) {
        _this.__onFinishChange.call(_this, _this.getValue());
      }
    }
    _this2.__input = document.createElement('input');
    _this2.__input.setAttribute('type', 'text');
    dom.bind(_this2.__input, 'keyup', onChange);
    dom.bind(_this2.__input, 'change', onChange);
    dom.bind(_this2.__input, 'blur', onBlur);
    dom.bind(_this2.__input, 'keydown', function (e) {
      if (e.keyCode === 13) {
        this.blur();
      }
    });
    _this2.updateDisplay();
    _this2.domElement.appendChild(_this2.__input);
    return _this2;
  }
  createClass(StringController, [{
    key: 'updateDisplay',
    value: function updateDisplay() {
      if (!dom.isActive(this.__input)) {
        this.__input.value = this.getValue();
      }
      return get(StringController.prototype.__proto__ || Object.getPrototypeOf(StringController.prototype), 'updateDisplay', this).call(this);
    }
  }]);
  return StringController;
}(Controller);

function numDecimals(x) {
  var _x = x.toString();
  if (_x.indexOf('.') > -1) {
    return _x.length - _x.indexOf('.') - 1;
  }
  return 0;
}
var NumberController = function (_Controller) {
  inherits(NumberController, _Controller);
  function NumberController(object, property, params) {
    classCallCheck(this, NumberController);
    var _this = possibleConstructorReturn(this, (NumberController.__proto__ || Object.getPrototypeOf(NumberController)).call(this, object, property));
    var _params = params || {};
    _this.__min = _params.min;
    _this.__max = _params.max;
    _this.__step = _params.step;
    if (Common.isUndefined(_this.__step)) {
      if (_this.initialValue === 0) {
        _this.__impliedStep = 1;
      } else {
        _this.__impliedStep = Math.pow(10, Math.floor(Math.log(Math.abs(_this.initialValue)) / Math.LN10)) / 10;
      }
    } else {
      _this.__impliedStep = _this.__step;
    }
    _this.__precision = numDecimals(_this.__impliedStep);
    return _this;
  }
  createClass(NumberController, [{
    key: 'setValue',
    value: function setValue(v) {
      var _v = v;
      if (this.__min !== undefined && _v < this.__min) {
        _v = this.__min;
      } else if (this.__max !== undefined && _v > this.__max) {
        _v = this.__max;
      }
      if (this.__step !== undefined && _v % this.__step !== 0) {
        _v = Math.round(_v / this.__step) * this.__step;
      }
      return get(NumberController.prototype.__proto__ || Object.getPrototypeOf(NumberController.prototype), 'setValue', this).call(this, _v);
    }
  }, {
    key: 'min',
    value: function min(minValue) {
      this.__min = minValue;
      return this;
    }
  }, {
    key: 'max',
    value: function max(maxValue) {
      this.__max = maxValue;
      return this;
    }
  }, {
    key: 'step',
    value: function step(stepValue) {
      this.__step = stepValue;
      this.__impliedStep = stepValue;
      this.__precision = numDecimals(stepValue);
      return this;
    }
  }]);
  return NumberController;
}(Controller);

function roundToDecimal(value, decimals) {
  var tenTo = Math.pow(10, decimals);
  return Math.round(value * tenTo) / tenTo;
}
var NumberControllerBox = function (_NumberController) {
  inherits(NumberControllerBox, _NumberController);
  function NumberControllerBox(object, property, params) {
    classCallCheck(this, NumberControllerBox);
    var _this2 = possibleConstructorReturn(this, (NumberControllerBox.__proto__ || Object.getPrototypeOf(NumberControllerBox)).call(this, object, property, params));
    _this2.__truncationSuspended = false;
    var _this = _this2;
    var prevY = void 0;
    function onChange() {
      var attempted = parseFloat(_this.__input.value);
      if (!Common.isNaN(attempted)) {
        _this.setValue(attempted);
      }
    }
    function onFinish() {
      if (_this.__onFinishChange) {
        _this.__onFinishChange.call(_this, _this.getValue());
      }
    }
    function onBlur() {
      onFinish();
    }
    function onMouseDrag(e) {
      var diff = prevY - e.clientY;
      _this.setValue(_this.getValue() + diff * _this.__impliedStep);
      prevY = e.clientY;
    }
    function onMouseUp() {
      dom.unbind(window, 'mousemove', onMouseDrag);
      dom.unbind(window, 'mouseup', onMouseUp);
      onFinish();
    }
    function onMouseDown(e) {
      dom.bind(window, 'mousemove', onMouseDrag);
      dom.bind(window, 'mouseup', onMouseUp);
      prevY = e.clientY;
    }
    _this2.__input = document.createElement('input');
    _this2.__input.setAttribute('type', 'text');
    dom.bind(_this2.__input, 'change', onChange);
    dom.bind(_this2.__input, 'blur', onBlur);
    dom.bind(_this2.__input, 'mousedown', onMouseDown);
    dom.bind(_this2.__input, 'keydown', function (e) {
      if (e.keyCode === 13) {
        _this.__truncationSuspended = true;
        this.blur();
        _this.__truncationSuspended = false;
        onFinish();
      }
    });
    _this2.updateDisplay();
    _this2.domElement.appendChild(_this2.__input);
    return _this2;
  }
  createClass(NumberControllerBox, [{
    key: 'updateDisplay',
    value: function updateDisplay() {
      this.__input.value = this.__truncationSuspended ? this.getValue() : roundToDecimal(this.getValue(), this.__precision);
      return get(NumberControllerBox.prototype.__proto__ || Object.getPrototypeOf(NumberControllerBox.prototype), 'updateDisplay', this).call(this);
    }
  }]);
  return NumberControllerBox;
}(NumberController);

function map(v, i1, i2, o1, o2) {
  return o1 + (o2 - o1) * ((v - i1) / (i2 - i1));
}
var NumberControllerSlider = function (_NumberController) {
  inherits(NumberControllerSlider, _NumberController);
  function NumberControllerSlider(object, property, min, max, step) {
    classCallCheck(this, NumberControllerSlider);
    var _this2 = possibleConstructorReturn(this, (NumberControllerSlider.__proto__ || Object.getPrototypeOf(NumberControllerSlider)).call(this, object, property, { min: min, max: max, step: step }));
    var _this = _this2;
    _this2.__background = document.createElement('div');
    _this2.__foreground = document.createElement('div');
    dom.bind(_this2.__background, 'mousedown', onMouseDown);
    dom.bind(_this2.__background, 'touchstart', onTouchStart);
    dom.addClass(_this2.__background, 'slider');
    dom.addClass(_this2.__foreground, 'slider-fg');
    function onMouseDown(e) {
      document.activeElement.blur();
      dom.bind(window, 'mousemove', onMouseDrag);
      dom.bind(window, 'mouseup', onMouseUp);
      onMouseDrag(e);
    }
    function onMouseDrag(e) {
      e.preventDefault();
      var bgRect = _this.__background.getBoundingClientRect();
      _this.setValue(map(e.clientX, bgRect.left, bgRect.right, _this.__min, _this.__max));
      return false;
    }
    function onMouseUp() {
      dom.unbind(window, 'mousemove', onMouseDrag);
      dom.unbind(window, 'mouseup', onMouseUp);
      if (_this.__onFinishChange) {
        _this.__onFinishChange.call(_this, _this.getValue());
      }
    }
    function onTouchStart(e) {
      if (e.touches.length !== 1) {
        return;
      }
      dom.bind(window, 'touchmove', onTouchMove);
      dom.bind(window, 'touchend', onTouchEnd);
      onTouchMove(e);
    }
    function onTouchMove(e) {
      var clientX = e.touches[0].clientX;
      var bgRect = _this.__background.getBoundingClientRect();
      _this.setValue(map(clientX, bgRect.left, bgRect.right, _this.__min, _this.__max));
    }
    function onTouchEnd() {
      dom.unbind(window, 'touchmove', onTouchMove);
      dom.unbind(window, 'touchend', onTouchEnd);
      if (_this.__onFinishChange) {
        _this.__onFinishChange.call(_this, _this.getValue());
      }
    }
    _this2.updateDisplay();
    _this2.__background.appendChild(_this2.__foreground);
    _this2.domElement.appendChild(_this2.__background);
    return _this2;
  }
  createClass(NumberControllerSlider, [{
    key: 'updateDisplay',
    value: function updateDisplay() {
      var pct = (this.getValue() - this.__min) / (this.__max - this.__min);
      this.__foreground.style.width = pct * 100 + '%';
      return get(NumberControllerSlider.prototype.__proto__ || Object.getPrototypeOf(NumberControllerSlider.prototype), 'updateDisplay', this).call(this);
    }
  }]);
  return NumberControllerSlider;
}(NumberController);

var FunctionController = function (_Controller) {
  inherits(FunctionController, _Controller);
  function FunctionController(object, property, text) {
    classCallCheck(this, FunctionController);
    var _this2 = possibleConstructorReturn(this, (FunctionController.__proto__ || Object.getPrototypeOf(FunctionController)).call(this, object, property));
    var _this = _this2;
    _this2.__button = document.createElement('div');
    _this2.__button.innerHTML = text === undefined ? 'Fire' : text;
    dom.bind(_this2.__button, 'click', function (e) {
      e.preventDefault();
      _this.fire();
      return false;
    });
    dom.addClass(_this2.__button, 'button');
    _this2.domElement.appendChild(_this2.__button);
    return _this2;
  }
  createClass(FunctionController, [{
    key: 'fire',
    value: function fire() {
      if (this.__onChange) {
        this.__onChange.call(this);
      }
      this.getValue().call(this.object);
      if (this.__onFinishChange) {
        this.__onFinishChange.call(this, this.getValue());
      }
    }
  }]);
  return FunctionController;
}(Controller);

var ColorController = function (_Controller) {
  inherits(ColorController, _Controller);
  function ColorController(object, property) {
    classCallCheck(this, ColorController);
    var _this2 = possibleConstructorReturn(this, (ColorController.__proto__ || Object.getPrototypeOf(ColorController)).call(this, object, property));
    _this2.__color = new Color(_this2.getValue());
    _this2.__temp = new Color(0);
    var _this = _this2;
    _this2.domElement = document.createElement('div');
    dom.makeSelectable(_this2.domElement, false);
    _this2.__selector = document.createElement('div');
    _this2.__selector.className = 'selector';
    _this2.__saturation_field = document.createElement('div');
    _this2.__saturation_field.className = 'saturation-field';
    _this2.__field_knob = document.createElement('div');
    _this2.__field_knob.className = 'field-knob';
    _this2.__field_knob_border = '2px solid ';
    _this2.__hue_knob = document.createElement('div');
    _this2.__hue_knob.className = 'hue-knob';
    _this2.__hue_field = document.createElement('div');
    _this2.__hue_field.className = 'hue-field';
    _this2.__input = document.createElement('input');
    _this2.__input.type = 'text';
    _this2.__input_textShadow = '0 1px 1px ';
    dom.bind(_this2.__input, 'keydown', function (e) {
      if (e.keyCode === 13) {
        onBlur.call(this);
      }
    });
    dom.bind(_this2.__input, 'blur', onBlur);
    dom.bind(_this2.__selector, 'mousedown', function ()        {
      dom.addClass(this, 'drag').bind(window, 'mouseup', function ()        {
        dom.removeClass(_this.__selector, 'drag');
      });
    });
    dom.bind(_this2.__selector, 'touchstart', function ()        {
      dom.addClass(this, 'drag').bind(window, 'touchend', function ()        {
        dom.removeClass(_this.__selector, 'drag');
      });
    });
    var valueField = document.createElement('div');
    Common.extend(_this2.__selector.style, {
      width: '122px',
      height: '102px',
      padding: '3px',
      backgroundColor: '#222',
      boxShadow: '0px 1px 3px rgba(0,0,0,0.3)'
    });
    Common.extend(_this2.__field_knob.style, {
      position: 'absolute',
      width: '12px',
      height: '12px',
      border: _this2.__field_knob_border + (_this2.__color.v < 0.5 ? '#fff' : '#000'),
      boxShadow: '0px 1px 3px rgba(0,0,0,0.5)',
      borderRadius: '12px',
      zIndex: 1
    });
    Common.extend(_this2.__hue_knob.style, {
      position: 'absolute',
      width: '15px',
      height: '2px',
      borderRight: '4px solid #fff',
      zIndex: 1
    });
    Common.extend(_this2.__saturation_field.style, {
      width: '100px',
      height: '100px',
      border: '1px solid #555',
      marginRight: '3px',
      display: 'inline-block',
      cursor: 'pointer'
    });
    Common.extend(valueField.style, {
      width: '100%',
      height: '100%',
      background: 'none'
    });
    linearGradient(valueField, 'top', 'rgba(0,0,0,0)', '#000');
    Common.extend(_this2.__hue_field.style, {
      width: '15px',
      height: '100px',
      border: '1px solid #555',
      cursor: 'ns-resize',
      position: 'absolute',
      top: '3px',
      right: '3px'
    });
    hueGradient(_this2.__hue_field);
    Common.extend(_this2.__input.style, {
      outline: 'none',
      textAlign: 'center',
      color: '#fff',
      border: 0,
      fontWeight: 'bold',
      textShadow: _this2.__input_textShadow + 'rgba(0,0,0,0.7)'
    });
    dom.bind(_this2.__saturation_field, 'mousedown', fieldDown);
    dom.bind(_this2.__saturation_field, 'touchstart', fieldDown);
    dom.bind(_this2.__field_knob, 'mousedown', fieldDown);
    dom.bind(_this2.__field_knob, 'touchstart', fieldDown);
    dom.bind(_this2.__hue_field, 'mousedown', fieldDownH);
    dom.bind(_this2.__hue_field, 'touchstart', fieldDownH);
    function fieldDown(e) {
      setSV(e);
      dom.bind(window, 'mousemove', setSV);
      dom.bind(window, 'touchmove', setSV);
      dom.bind(window, 'mouseup', fieldUpSV);
      dom.bind(window, 'touchend', fieldUpSV);
    }
    function fieldDownH(e) {
      setH(e);
      dom.bind(window, 'mousemove', setH);
      dom.bind(window, 'touchmove', setH);
      dom.bind(window, 'mouseup', fieldUpH);
      dom.bind(window, 'touchend', fieldUpH);
    }
    function fieldUpSV() {
      dom.unbind(window, 'mousemove', setSV);
      dom.unbind(window, 'touchmove', setSV);
      dom.unbind(window, 'mouseup', fieldUpSV);
      dom.unbind(window, 'touchend', fieldUpSV);
      onFinish();
    }
    function fieldUpH() {
      dom.unbind(window, 'mousemove', setH);
      dom.unbind(window, 'touchmove', setH);
      dom.unbind(window, 'mouseup', fieldUpH);
      dom.unbind(window, 'touchend', fieldUpH);
      onFinish();
    }
    function onBlur() {
      var i = interpret(this.value);
      if (i !== false) {
        _this.__color.__state = i;
        _this.setValue(_this.__color.toOriginal());
      } else {
        this.value = _this.__color.toString();
      }
    }
    function onFinish() {
      if (_this.__onFinishChange) {
        _this.__onFinishChange.call(_this, _this.__color.toOriginal());
      }
    }
    _this2.__saturation_field.appendChild(valueField);
    _this2.__selector.appendChild(_this2.__field_knob);
    _this2.__selector.appendChild(_this2.__saturation_field);
    _this2.__selector.appendChild(_this2.__hue_field);
    _this2.__hue_field.appendChild(_this2.__hue_knob);
    _this2.domElement.appendChild(_this2.__input);
    _this2.domElement.appendChild(_this2.__selector);
    _this2.updateDisplay();
    function setSV(e) {
      if (e.type.indexOf('touch') === -1) {
        e.preventDefault();
      }
      var fieldRect = _this.__saturation_field.getBoundingClientRect();
      var _ref = e.touches && e.touches[0] || e,
          clientX = _ref.clientX,
          clientY = _ref.clientY;
      var s = (clientX - fieldRect.left) / (fieldRect.right - fieldRect.left);
      var v = 1 - (clientY - fieldRect.top) / (fieldRect.bottom - fieldRect.top);
      if (v > 1) {
        v = 1;
      } else if (v < 0) {
        v = 0;
      }
      if (s > 1) {
        s = 1;
      } else if (s < 0) {
        s = 0;
      }
      _this.__color.v = v;
      _this.__color.s = s;
      _this.setValue(_this.__color.toOriginal());
      return false;
    }
    function setH(e) {
      if (e.type.indexOf('touch') === -1) {
        e.preventDefault();
      }
      var fieldRect = _this.__hue_field.getBoundingClientRect();
      var _ref2 = e.touches && e.touches[0] || e,
          clientY = _ref2.clientY;
      var h = 1 - (clientY - fieldRect.top) / (fieldRect.bottom - fieldRect.top);
      if (h > 1) {
        h = 1;
      } else if (h < 0) {
        h = 0;
      }
      _this.__color.h = h * 360;
      _this.setValue(_this.__color.toOriginal());
      return false;
    }
    return _this2;
  }
  createClass(ColorController, [{
    key: 'updateDisplay',
    value: function updateDisplay() {
      var i = interpret(this.getValue());
      if (i !== false) {
        var mismatch = false;
        Common.each(Color.COMPONENTS, function (component) {
          if (!Common.isUndefined(i[component]) && !Common.isUndefined(this.__color.__state[component]) && i[component] !== this.__color.__state[component]) {
            mismatch = true;
            return {};
          }
        }, this);
        if (mismatch) {
          Common.extend(this.__color.__state, i);
        }
      }
      Common.extend(this.__temp.__state, this.__color.__state);
      this.__temp.a = 1;
      var flip = this.__color.v < 0.5 || this.__color.s > 0.5 ? 255 : 0;
      var _flip = 255 - flip;
      Common.extend(this.__field_knob.style, {
        marginLeft: 100 * this.__color.s - 7 + 'px',
        marginTop: 100 * (1 - this.__color.v) - 7 + 'px',
        backgroundColor: this.__temp.toHexString(),
        border: this.__field_knob_border + 'rgb(' + flip + ',' + flip + ',' + flip + ')'
      });
      this.__hue_knob.style.marginTop = (1 - this.__color.h / 360) * 100 + 'px';
      this.__temp.s = 1;
      this.__temp.v = 1;
      linearGradient(this.__saturation_field, 'left', '#fff', this.__temp.toHexString());
      this.__input.value = this.__color.toString();
      Common.extend(this.__input.style, {
        backgroundColor: this.__color.toHexString(),
        color: 'rgb(' + flip + ',' + flip + ',' + flip + ')',
        textShadow: this.__input_textShadow + 'rgba(' + _flip + ',' + _flip + ',' + _flip + ',.7)'
      });
    }
  }]);
  return ColorController;
}(Controller);
var vendors = ['-moz-', '-o-', '-webkit-', '-ms-', ''];
function linearGradient(elem, x, a, b) {
  elem.style.background = '';
  Common.each(vendors, function (vendor) {
    elem.style.cssText += 'background: ' + vendor + 'linear-gradient(' + x + ', ' + a + ' 0%, ' + b + ' 100%); ';
  });
}
function hueGradient(elem) {
  elem.style.background = '';
  elem.style.cssText += 'background: -moz-linear-gradient(top,  #ff0000 0%, #ff00ff 17%, #0000ff 34%, #00ffff 50%, #00ff00 67%, #ffff00 84%, #ff0000 100%);';
  elem.style.cssText += 'background: -webkit-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);';
  elem.style.cssText += 'background: -o-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);';
  elem.style.cssText += 'background: -ms-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);';
  elem.style.cssText += 'background: linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);';
}

var css = {
  load: function load(url, indoc) {
    var doc = indoc || document;
    var link = doc.createElement('link');
    link.type = 'text/css';
    link.rel = 'stylesheet';
    link.href = url;
    doc.getElementsByTagName('head')[0].appendChild(link);
  },
  inject: function inject(cssContent, indoc) {
    var doc = indoc || document;
    var injected = document.createElement('style');
    injected.type = 'text/css';
    injected.innerHTML = cssContent;
    var head = doc.getElementsByTagName('head')[0];
    try {
      head.appendChild(injected);
    } catch (e) {
    }
  }
};

var saveDialogContents = "<div id=\"dg-save\" class=\"dg dialogue\">\n\n  Here's the new load parameter for your <code>GUI</code>'s constructor:\n\n  <textarea id=\"dg-new-constructor\"></textarea>\n\n  <div id=\"dg-save-locally\">\n\n    <input id=\"dg-local-storage\" type=\"checkbox\"/> Automatically save\n    values to <code>localStorage</code> on exit.\n\n    <div id=\"dg-local-explain\">The values saved to <code>localStorage</code> will\n      override those passed to <code>dat.GUI</code>'s constructor. This makes it\n      easier to work incrementally, but <code>localStorage</code> is fragile,\n      and your friends may not see the same values you do.\n\n    </div>\n\n  </div>\n\n</div>";

var ControllerFactory = function ControllerFactory(object, property) {
  var initialValue = object[property];
  if (Common.isArray(arguments[2]) || Common.isObject(arguments[2])) {
    return new OptionController(object, property, arguments[2]);
  }
  if (Common.isNumber(initialValue)) {
    if (Common.isNumber(arguments[2]) && Common.isNumber(arguments[3])) {
      if (Common.isNumber(arguments[4])) {
        return new NumberControllerSlider(object, property, arguments[2], arguments[3], arguments[4]);
      }
      return new NumberControllerSlider(object, property, arguments[2], arguments[3]);
    }
    if (Common.isNumber(arguments[4])) {
      return new NumberControllerBox(object, property, { min: arguments[2], max: arguments[3], step: arguments[4] });
    }
    return new NumberControllerBox(object, property, { min: arguments[2], max: arguments[3] });
  }
  if (Common.isString(initialValue)) {
    return new StringController(object, property);
  }
  if (Common.isFunction(initialValue)) {
    return new FunctionController(object, property, '');
  }
  if (Common.isBoolean(initialValue)) {
    return new BooleanController(object, property);
  }
  return null;
};

function requestAnimationFrame(callback) {
  setTimeout(callback, 1000 / 60);
}
var requestAnimationFrame$1 = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || requestAnimationFrame;

var CenteredDiv = function () {
  function CenteredDiv() {
    classCallCheck(this, CenteredDiv);
    this.backgroundElement = document.createElement('div');
    Common.extend(this.backgroundElement.style, {
      backgroundColor: 'rgba(0,0,0,0.8)',
      top: 0,
      left: 0,
      display: 'none',
      zIndex: '1000',
      opacity: 0,
      WebkitTransition: 'opacity 0.2s linear',
      transition: 'opacity 0.2s linear'
    });
    dom.makeFullscreen(this.backgroundElement);
    this.backgroundElement.style.position = 'fixed';
    this.domElement = document.createElement('div');
    Common.extend(this.domElement.style, {
      position: 'fixed',
      display: 'none',
      zIndex: '1001',
      opacity: 0,
      WebkitTransition: '-webkit-transform 0.2s ease-out, opacity 0.2s linear',
      transition: 'transform 0.2s ease-out, opacity 0.2s linear'
    });
    document.body.appendChild(this.backgroundElement);
    document.body.appendChild(this.domElement);
    var _this = this;
    dom.bind(this.backgroundElement, 'click', function () {
      _this.hide();
    });
  }
  createClass(CenteredDiv, [{
    key: 'show',
    value: function show() {
      var _this = this;
      this.backgroundElement.style.display = 'block';
      this.domElement.style.display = 'block';
      this.domElement.style.opacity = 0;
      this.domElement.style.webkitTransform = 'scale(1.1)';
      this.layout();
      Common.defer(function () {
        _this.backgroundElement.style.opacity = 1;
        _this.domElement.style.opacity = 1;
        _this.domElement.style.webkitTransform = 'scale(1)';
      });
    }
  }, {
    key: 'hide',
    value: function hide() {
      var _this = this;
      var hide = function hide() {
        _this.domElement.style.display = 'none';
        _this.backgroundElement.style.display = 'none';
        dom.unbind(_this.domElement, 'webkitTransitionEnd', hide);
        dom.unbind(_this.domElement, 'transitionend', hide);
        dom.unbind(_this.domElement, 'oTransitionEnd', hide);
      };
      dom.bind(this.domElement, 'webkitTransitionEnd', hide);
      dom.bind(this.domElement, 'transitionend', hide);
      dom.bind(this.domElement, 'oTransitionEnd', hide);
      this.backgroundElement.style.opacity = 0;
      this.domElement.style.opacity = 0;
      this.domElement.style.webkitTransform = 'scale(1.1)';
    }
  }, {
    key: 'layout',
    value: function layout() {
      this.domElement.style.left = window.innerWidth / 2 - dom.getWidth(this.domElement) / 2 + 'px';
      this.domElement.style.top = window.innerHeight / 2 - dom.getHeight(this.domElement) / 2 + 'px';
    }
  }]);
  return CenteredDiv;
}();

var styleSheet = ___$insertStyle(".dg ul{list-style:none;margin:0;padding:0;width:100%;clear:both}.dg.ac{position:fixed;top:0;left:0;right:0;height:0;z-index:0}.dg:not(.ac) .main{overflow:hidden}.dg.main{-webkit-transition:opacity .1s linear;-o-transition:opacity .1s linear;-moz-transition:opacity .1s linear;transition:opacity .1s linear}.dg.main.taller-than-window{overflow-y:auto}.dg.main.taller-than-window .close-button{opacity:1;margin-top:-1px;border-top:1px solid #2c2c2c}.dg.main ul.closed .close-button{opacity:1 !important}.dg.main:hover .close-button,.dg.main .close-button.drag{opacity:1}.dg.main .close-button{-webkit-transition:opacity .1s linear;-o-transition:opacity .1s linear;-moz-transition:opacity .1s linear;transition:opacity .1s linear;border:0;line-height:19px;height:20px;cursor:pointer;text-align:center;background-color:#000}.dg.main .close-button.close-top{position:relative}.dg.main .close-button.close-bottom{position:absolute}.dg.main .close-button:hover{background-color:#111}.dg.a{float:right;margin-right:15px;overflow-y:visible}.dg.a.has-save>ul.close-top{margin-top:0}.dg.a.has-save>ul.close-bottom{margin-top:27px}.dg.a.has-save>ul.closed{margin-top:0}.dg.a .save-row{top:0;z-index:1002}.dg.a .save-row.close-top{position:relative}.dg.a .save-row.close-bottom{position:fixed}.dg li{-webkit-transition:height .1s ease-out;-o-transition:height .1s ease-out;-moz-transition:height .1s ease-out;transition:height .1s ease-out;-webkit-transition:overflow .1s linear;-o-transition:overflow .1s linear;-moz-transition:overflow .1s linear;transition:overflow .1s linear}.dg li:not(.folder){cursor:auto;height:27px;line-height:27px;padding:0 4px 0 5px}.dg li.folder{padding:0;border-left:4px solid rgba(0,0,0,0)}.dg li.title{cursor:pointer;margin-left:-4px}.dg .closed li:not(.title),.dg .closed ul li,.dg .closed ul li>*{height:0;overflow:hidden;border:0}.dg .cr{clear:both;padding-left:3px;height:27px;overflow:hidden}.dg .property-name{cursor:default;float:left;clear:left;width:40%;overflow:hidden;text-overflow:ellipsis}.dg .c{float:left;width:60%;position:relative}.dg .c input[type=text]{border:0;margin-top:4px;padding:3px;width:100%;float:right}.dg .has-slider input[type=text]{width:30%;margin-left:0}.dg .slider{float:left;width:66%;margin-left:-5px;margin-right:0;height:19px;margin-top:4px}.dg .slider-fg{height:100%}.dg .c input[type=checkbox]{margin-top:7px}.dg .c select{margin-top:5px}.dg .cr.function,.dg .cr.function .property-name,.dg .cr.function *,.dg .cr.boolean,.dg .cr.boolean *{cursor:pointer}.dg .cr.color{overflow:visible}.dg .selector{display:none;position:absolute;margin-left:-9px;margin-top:23px;z-index:10}.dg .c:hover .selector,.dg .selector.drag{display:block}.dg li.save-row{padding:0}.dg li.save-row .button{display:inline-block;padding:0px 6px}.dg.dialogue{background-color:#222;width:460px;padding:15px;font-size:13px;line-height:15px}#dg-new-constructor{padding:10px;color:#222;font-family:Monaco, monospace;font-size:10px;border:0;resize:none;box-shadow:inset 1px 1px 1px #888;word-wrap:break-word;margin:12px 0;display:block;width:440px;overflow-y:scroll;height:100px;position:relative}#dg-local-explain{display:none;font-size:11px;line-height:17px;border-radius:3px;background-color:#333;padding:8px;margin-top:10px}#dg-local-explain code{font-size:10px}#dat-gui-save-locally{display:none}.dg{color:#eee;font:11px 'Lucida Grande', sans-serif;text-shadow:0 -1px 0 #111}.dg.main::-webkit-scrollbar{width:5px;background:#1a1a1a}.dg.main::-webkit-scrollbar-corner{height:0;display:none}.dg.main::-webkit-scrollbar-thumb{border-radius:5px;background:#676767}.dg li:not(.folder){background:#1a1a1a;border-bottom:1px solid #2c2c2c}.dg li.save-row{line-height:25px;background:#dad5cb;border:0}.dg li.save-row select{margin-left:5px;width:108px}.dg li.save-row .button{margin-left:5px;margin-top:1px;border-radius:2px;font-size:9px;line-height:7px;padding:4px 4px 5px 4px;background:#c5bdad;color:#fff;text-shadow:0 1px 0 #b0a58f;box-shadow:0 -1px 0 #b0a58f;cursor:pointer}.dg li.save-row .button.gears{background:#c5bdad url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAANCAYAAAB/9ZQ7AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAQJJREFUeNpiYKAU/P//PwGIC/ApCABiBSAW+I8AClAcgKxQ4T9hoMAEUrxx2QSGN6+egDX+/vWT4e7N82AMYoPAx/evwWoYoSYbACX2s7KxCxzcsezDh3evFoDEBYTEEqycggWAzA9AuUSQQgeYPa9fPv6/YWm/Acx5IPb7ty/fw+QZblw67vDs8R0YHyQhgObx+yAJkBqmG5dPPDh1aPOGR/eugW0G4vlIoTIfyFcA+QekhhHJhPdQxbiAIguMBTQZrPD7108M6roWYDFQiIAAv6Aow/1bFwXgis+f2LUAynwoIaNcz8XNx3Dl7MEJUDGQpx9gtQ8YCueB+D26OECAAQDadt7e46D42QAAAABJRU5ErkJggg==) 2px 1px no-repeat;height:7px;width:8px}.dg li.save-row .button:hover{background-color:#bab19e;box-shadow:0 -1px 0 #b0a58f}.dg li.folder{border-bottom:0}.dg li.title{padding-left:16px;background:#000 url(data:image/gif;base64,R0lGODlhBQAFAJEAAP////Pz8////////yH5BAEAAAIALAAAAAAFAAUAAAIIlI+hKgFxoCgAOw==) 6px 10px no-repeat;cursor:pointer;border-bottom:1px solid rgba(255,255,255,0.2)}.dg .closed li.title{background-image:url(data:image/gif;base64,R0lGODlhBQAFAJEAAP////Pz8////////yH5BAEAAAIALAAAAAAFAAUAAAIIlGIWqMCbWAEAOw==)}.dg .cr.boolean{border-left:3px solid #806787}.dg .cr.color{border-left:3px solid}.dg .cr.function{border-left:3px solid #e61d5f}.dg .cr.number{border-left:3px solid #2FA1D6}.dg .cr.number input[type=text]{color:#2FA1D6}.dg .cr.string{border-left:3px solid #1ed36f}.dg .cr.string input[type=text]{color:#1ed36f}.dg .cr.function:hover,.dg .cr.boolean:hover{background:#111}.dg .c input[type=text]{background:#303030;outline:none}.dg .c input[type=text]:hover{background:#3c3c3c}.dg .c input[type=text]:focus{background:#494949;color:#fff}.dg .c .slider{background:#303030;cursor:ew-resize}.dg .c .slider-fg{background:#2FA1D6;max-width:100%}.dg .c .slider:hover{background:#3c3c3c}.dg .c .slider:hover .slider-fg{background:#44abda}\n");

css.inject(styleSheet);
var CSS_NAMESPACE = 'dg';
var HIDE_KEY_CODE = 72;
var CLOSE_BUTTON_HEIGHT = 20;
var DEFAULT_DEFAULT_PRESET_NAME = 'Default';
var SUPPORTS_LOCAL_STORAGE = function () {
  try {
    return !!window.localStorage;
  } catch (e) {
    return false;
  }
}();
var SAVE_DIALOGUE = void 0;
var autoPlaceVirgin = true;
var autoPlaceContainer = void 0;
var hide = false;
var hideableGuis = [];
var GUI = function GUI(pars) {
  var _this = this;
  var params = pars || {};
  this.domElement = document.createElement('div');
  this.__ul = document.createElement('ul');
  this.domElement.appendChild(this.__ul);
  dom.addClass(this.domElement, CSS_NAMESPACE);
  this.__folders = {};
  this.__controllers = [];
  this.__rememberedObjects = [];
  this.__rememberedObjectIndecesToControllers = [];
  this.__listening = [];
  params = Common.defaults(params, {
    closeOnTop: false,
    autoPlace: true,
    width: GUI.DEFAULT_WIDTH
  });
  params = Common.defaults(params, {
    resizable: params.autoPlace,
    hideable: params.autoPlace
  });
  if (!Common.isUndefined(params.load)) {
    if (params.preset) {
      params.load.preset = params.preset;
    }
  } else {
    params.load = { preset: DEFAULT_DEFAULT_PRESET_NAME };
  }
  if (Common.isUndefined(params.parent) && params.hideable) {
    hideableGuis.push(this);
  }
  params.resizable = Common.isUndefined(params.parent) && params.resizable;
  if (params.autoPlace && Common.isUndefined(params.scrollable)) {
    params.scrollable = true;
  }
  var useLocalStorage = SUPPORTS_LOCAL_STORAGE && localStorage.getItem(getLocalStorageHash(this, 'isLocal')) === 'true';
  var saveToLocalStorage = void 0;
  Object.defineProperties(this,
  {
    parent: {
      get: function get$$1() {
        return params.parent;
      }
    },
    scrollable: {
      get: function get$$1() {
        return params.scrollable;
      }
    },
    autoPlace: {
      get: function get$$1() {
        return params.autoPlace;
      }
    },
    closeOnTop: {
      get: function get$$1() {
        return params.closeOnTop;
      }
    },
    preset: {
      get: function get$$1() {
        if (_this.parent) {
          return _this.getRoot().preset;
        }
        return params.load.preset;
      },
      set: function set$$1(v) {
        if (_this.parent) {
          _this.getRoot().preset = v;
        } else {
          params.load.preset = v;
        }
        setPresetSelectIndex(this);
        _this.revert();
      }
    },
    width: {
      get: function get$$1() {
        return params.width;
      },
      set: function set$$1(v) {
        params.width = v;
        setWidth(_this, v);
      }
    },
    name: {
      get: function get$$1() {
        return params.name;
      },
      set: function set$$1(v) {
        params.name = v;
        if (titleRowName) {
          titleRowName.innerHTML = params.name;
        }
      }
    },
    closed: {
      get: function get$$1() {
        return params.closed;
      },
      set: function set$$1(v) {
        params.closed = v;
        if (params.closed) {
          dom.addClass(_this.__ul, GUI.CLASS_CLOSED);
        } else {
          dom.removeClass(_this.__ul, GUI.CLASS_CLOSED);
        }
        this.onResize();
        if (_this.__closeButton) {
          _this.__closeButton.innerHTML = v ? GUI.TEXT_OPEN : GUI.TEXT_CLOSED;
        }
      }
    },
    load: {
      get: function get$$1() {
        return params.load;
      }
    },
    useLocalStorage: {
      get: function get$$1() {
        return useLocalStorage;
      },
      set: function set$$1(bool) {
        if (SUPPORTS_LOCAL_STORAGE) {
          useLocalStorage = bool;
          if (bool) {
            dom.bind(window, 'unload', saveToLocalStorage);
          } else {
            dom.unbind(window, 'unload', saveToLocalStorage);
          }
          localStorage.setItem(getLocalStorageHash(_this, 'isLocal'), bool);
        }
      }
    }
  });
  if (Common.isUndefined(params.parent)) {
    params.closed = false;
    dom.addClass(this.domElement, GUI.CLASS_MAIN);
    dom.makeSelectable(this.domElement, false);
    if (SUPPORTS_LOCAL_STORAGE) {
      if (useLocalStorage) {
        _this.useLocalStorage = true;
        var savedGui = localStorage.getItem(getLocalStorageHash(this, 'gui'));
        if (savedGui) {
          params.load = JSON.parse(savedGui);
        }
      }
    }
    this.__closeButton = document.createElement('div');
    this.__closeButton.innerHTML = GUI.TEXT_CLOSED;
    dom.addClass(this.__closeButton, GUI.CLASS_CLOSE_BUTTON);
    if (params.closeOnTop) {
      dom.addClass(this.__closeButton, GUI.CLASS_CLOSE_TOP);
      this.domElement.insertBefore(this.__closeButton, this.domElement.childNodes[0]);
    } else {
      dom.addClass(this.__closeButton, GUI.CLASS_CLOSE_BOTTOM);
      this.domElement.appendChild(this.__closeButton);
    }
    dom.bind(this.__closeButton, 'click', function () {
      _this.closed = !_this.closed;
    });
  } else {
    if (params.closed === undefined) {
      params.closed = true;
    }
    var _titleRowName = document.createTextNode(params.name);
    dom.addClass(_titleRowName, 'controller-name');
    var titleRow = addRow(_this, _titleRowName);
    var onClickTitle = function onClickTitle(e) {
      e.preventDefault();
      _this.closed = !_this.closed;
      return false;
    };
    dom.addClass(this.__ul, GUI.CLASS_CLOSED);
    dom.addClass(titleRow, 'title');
    dom.bind(titleRow, 'click', onClickTitle);
    if (!params.closed) {
      this.closed = false;
    }
  }
  if (params.autoPlace) {
    if (Common.isUndefined(params.parent)) {
      if (autoPlaceVirgin) {
        autoPlaceContainer = document.createElement('div');
        dom.addClass(autoPlaceContainer, CSS_NAMESPACE);
        dom.addClass(autoPlaceContainer, GUI.CLASS_AUTO_PLACE_CONTAINER);
        document.body.appendChild(autoPlaceContainer);
        autoPlaceVirgin = false;
      }
      autoPlaceContainer.appendChild(this.domElement);
      dom.addClass(this.domElement, GUI.CLASS_AUTO_PLACE);
    }
    if (!this.parent) {
      setWidth(_this, params.width);
    }
  }
  this.__resizeHandler = function () {
    _this.onResizeDebounced();
  };
  dom.bind(window, 'resize', this.__resizeHandler);
  dom.bind(this.__ul, 'webkitTransitionEnd', this.__resizeHandler);
  dom.bind(this.__ul, 'transitionend', this.__resizeHandler);
  dom.bind(this.__ul, 'oTransitionEnd', this.__resizeHandler);
  this.onResize();
  if (params.resizable) {
    addResizeHandle(this);
  }
  saveToLocalStorage = function saveToLocalStorage() {
    if (SUPPORTS_LOCAL_STORAGE && localStorage.getItem(getLocalStorageHash(_this, 'isLocal')) === 'true') {
      localStorage.setItem(getLocalStorageHash(_this, 'gui'), JSON.stringify(_this.getSaveObject()));
    }
  };
  this.saveToLocalStorageIfPossible = saveToLocalStorage;
  function resetWidth() {
    var root = _this.getRoot();
    root.width += 1;
    Common.defer(function () {
      root.width -= 1;
    });
  }
  if (!params.parent) {
    resetWidth();
  }
};
GUI.toggleHide = function () {
  hide = !hide;
  Common.each(hideableGuis, function (gui) {
    gui.domElement.style.display = hide ? 'none' : '';
  });
};
GUI.CLASS_AUTO_PLACE = 'a';
GUI.CLASS_AUTO_PLACE_CONTAINER = 'ac';
GUI.CLASS_MAIN = 'main';
GUI.CLASS_CONTROLLER_ROW = 'cr';
GUI.CLASS_TOO_TALL = 'taller-than-window';
GUI.CLASS_CLOSED = 'closed';
GUI.CLASS_CLOSE_BUTTON = 'close-button';
GUI.CLASS_CLOSE_TOP = 'close-top';
GUI.CLASS_CLOSE_BOTTOM = 'close-bottom';
GUI.CLASS_DRAG = 'drag';
GUI.DEFAULT_WIDTH = 245;
GUI.TEXT_CLOSED = 'Close Controls';
GUI.TEXT_OPEN = 'Open Controls';
GUI._keydownHandler = function (e) {
  if (document.activeElement.type !== 'text' && (e.which === HIDE_KEY_CODE || e.keyCode === HIDE_KEY_CODE)) {
    GUI.toggleHide();
  }
};
dom.bind(window, 'keydown', GUI._keydownHandler, false);
Common.extend(GUI.prototype,
{
  add: function add(object, property) {
    return _add(this, object, property, {
      factoryArgs: Array.prototype.slice.call(arguments, 2)
    });
  },
  addColor: function addColor(object, property) {
    return _add(this, object, property, {
      color: true
    });
  },
  remove: function remove(controller) {
    this.__ul.removeChild(controller.__li);
    this.__controllers.splice(this.__controllers.indexOf(controller), 1);
    var _this = this;
    Common.defer(function () {
      _this.onResize();
    });
  },
  destroy: function destroy() {
    if (this.parent) {
      throw new Error('Only the root GUI should be removed with .destroy(). ' + 'For subfolders, use gui.removeFolder(folder) instead.');
    }
    if (this.autoPlace) {
      autoPlaceContainer.removeChild(this.domElement);
    }
    var _this = this;
    Common.each(this.__folders, function (subfolder) {
      _this.removeFolder(subfolder);
    });
    dom.unbind(window, 'keydown', GUI._keydownHandler, false);
    removeListeners(this);
  },
  addFolder: function addFolder(name) {
    if (this.__folders[name] !== undefined) {
      throw new Error('You already have a folder in this GUI by the' + ' name "' + name + '"');
    }
    var newGuiParams = { name: name, parent: this };
    newGuiParams.autoPlace = this.autoPlace;
    if (this.load &&
    this.load.folders &&
    this.load.folders[name]) {
      newGuiParams.closed = this.load.folders[name].closed;
      newGuiParams.load = this.load.folders[name];
    }
    var gui = new GUI(newGuiParams);
    this.__folders[name] = gui;
    var li = addRow(this, gui.domElement);
    dom.addClass(li, 'folder');
    return gui;
  },
  removeFolder: function removeFolder(folder) {
    this.__ul.removeChild(folder.domElement.parentElement);
    delete this.__folders[folder.name];
    if (this.load &&
    this.load.folders &&
    this.load.folders[folder.name]) {
      delete this.load.folders[folder.name];
    }
    removeListeners(folder);
    var _this = this;
    Common.each(folder.__folders, function (subfolder) {
      folder.removeFolder(subfolder);
    });
    Common.defer(function () {
      _this.onResize();
    });
  },
  open: function open() {
    this.closed = false;
  },
  close: function close() {
    this.closed = true;
  },
  onResize: function onResize() {
    var root = this.getRoot();
    if (root.scrollable) {
      var top = dom.getOffset(root.__ul).top;
      var h = 0;
      Common.each(root.__ul.childNodes, function (node) {
        if (!(root.autoPlace && node === root.__save_row)) {
          h += dom.getHeight(node);
        }
      });
      if (window.innerHeight - top - CLOSE_BUTTON_HEIGHT < h) {
        dom.addClass(root.domElement, GUI.CLASS_TOO_TALL);
        root.__ul.style.height = window.innerHeight - top - CLOSE_BUTTON_HEIGHT + 'px';
      } else {
        dom.removeClass(root.domElement, GUI.CLASS_TOO_TALL);
        root.__ul.style.height = 'auto';
      }
    }
    if (root.__resize_handle) {
      Common.defer(function () {
        root.__resize_handle.style.height = root.__ul.offsetHeight + 'px';
      });
    }
    if (root.__closeButton) {
      root.__closeButton.style.width = root.width + 'px';
    }
  },
  onResizeDebounced: Common.debounce(function () {
    this.onResize();
  }, 50),
  remember: function remember() {
    if (Common.isUndefined(SAVE_DIALOGUE)) {
      SAVE_DIALOGUE = new CenteredDiv();
      SAVE_DIALOGUE.domElement.innerHTML = saveDialogContents;
    }
    if (this.parent) {
      throw new Error('You can only call remember on a top level GUI.');
    }
    var _this = this;
    Common.each(Array.prototype.slice.call(arguments), function (object) {
      if (_this.__rememberedObjects.length === 0) {
        addSaveMenu(_this);
      }
      if (_this.__rememberedObjects.indexOf(object) === -1) {
        _this.__rememberedObjects.push(object);
      }
    });
    if (this.autoPlace) {
      setWidth(this, this.width);
    }
  },
  getRoot: function getRoot() {
    var gui = this;
    while (gui.parent) {
      gui = gui.parent;
    }
    return gui;
  },
  getSaveObject: function getSaveObject() {
    var toReturn = this.load;
    toReturn.closed = this.closed;
    if (this.__rememberedObjects.length > 0) {
      toReturn.preset = this.preset;
      if (!toReturn.remembered) {
        toReturn.remembered = {};
      }
      toReturn.remembered[this.preset] = getCurrentPreset(this);
    }
    toReturn.folders = {};
    Common.each(this.__folders, function (element, key) {
      toReturn.folders[key] = element.getSaveObject();
    });
    return toReturn;
  },
  save: function save() {
    if (!this.load.remembered) {
      this.load.remembered = {};
    }
    this.load.remembered[this.preset] = getCurrentPreset(this);
    markPresetModified(this, false);
    this.saveToLocalStorageIfPossible();
  },
  saveAs: function saveAs(presetName) {
    if (!this.load.remembered) {
      this.load.remembered = {};
      this.load.remembered[DEFAULT_DEFAULT_PRESET_NAME] = getCurrentPreset(this, true);
    }
    this.load.remembered[presetName] = getCurrentPreset(this);
    this.preset = presetName;
    addPresetOption(this, presetName, true);
    this.saveToLocalStorageIfPossible();
  },
  revert: function revert(gui) {
    Common.each(this.__controllers, function (controller) {
      if (!this.getRoot().load.remembered) {
        controller.setValue(controller.initialValue);
      } else {
        recallSavedValue(gui || this.getRoot(), controller);
      }
      if (controller.__onFinishChange) {
        controller.__onFinishChange.call(controller, controller.getValue());
      }
    }, this);
    Common.each(this.__folders, function (folder) {
      folder.revert(folder);
    });
    if (!gui) {
      markPresetModified(this.getRoot(), false);
    }
  },
  listen: function listen(controller) {
    var init = this.__listening.length === 0;
    this.__listening.push(controller);
    if (init) {
      updateDisplays(this.__listening);
    }
  },
  updateDisplay: function updateDisplay() {
    Common.each(this.__controllers, function (controller) {
      controller.updateDisplay();
    });
    Common.each(this.__folders, function (folder) {
      folder.updateDisplay();
    });
  }
});
function addRow(gui, newDom, liBefore) {
  var li = document.createElement('li');
  if (newDom) {
    li.appendChild(newDom);
  }
  if (liBefore) {
    gui.__ul.insertBefore(li, liBefore);
  } else {
    gui.__ul.appendChild(li);
  }
  gui.onResize();
  return li;
}
function removeListeners(gui) {
  dom.unbind(window, 'resize', gui.__resizeHandler);
  if (gui.saveToLocalStorageIfPossible) {
    dom.unbind(window, 'unload', gui.saveToLocalStorageIfPossible);
  }
}
function markPresetModified(gui, modified) {
  var opt = gui.__preset_select[gui.__preset_select.selectedIndex];
  if (modified) {
    opt.innerHTML = opt.value + '*';
  } else {
    opt.innerHTML = opt.value;
  }
}
function augmentController(gui, li, controller) {
  controller.__li = li;
  controller.__gui = gui;
  Common.extend(controller,                                   {
    options: function options(_options) {
      if (arguments.length > 1) {
        var nextSibling = controller.__li.nextElementSibling;
        controller.remove();
        return _add(gui, controller.object, controller.property, {
          before: nextSibling,
          factoryArgs: [Common.toArray(arguments)]
        });
      }
      if (Common.isArray(_options) || Common.isObject(_options)) {
        var _nextSibling = controller.__li.nextElementSibling;
        controller.remove();
        return _add(gui, controller.object, controller.property, {
          before: _nextSibling,
          factoryArgs: [_options]
        });
      }
    },
    name: function name(_name) {
      controller.__li.firstElementChild.firstElementChild.innerHTML = _name;
      return controller;
    },
    listen: function listen() {
      controller.__gui.listen(controller);
      return controller;
    },
    remove: function remove() {
      controller.__gui.remove(controller);
      return controller;
    }
  });
  if (controller instanceof NumberControllerSlider) {
    var box = new NumberControllerBox(controller.object, controller.property, { min: controller.__min, max: controller.__max, step: controller.__step });
    Common.each(['updateDisplay', 'onChange', 'onFinishChange', 'step'], function (method) {
      var pc = controller[method];
      var pb = box[method];
      controller[method] = box[method] = function () {
        var args = Array.prototype.slice.call(arguments);
        pb.apply(box, args);
        return pc.apply(controller, args);
      };
    });
    dom.addClass(li, 'has-slider');
    controller.domElement.insertBefore(box.domElement, controller.domElement.firstElementChild);
  } else if (controller instanceof NumberControllerBox) {
    var r = function r(returned) {
      if (Common.isNumber(controller.__min) && Common.isNumber(controller.__max)) {
        var oldName = controller.__li.firstElementChild.firstElementChild.innerHTML;
        var wasListening = controller.__gui.__listening.indexOf(controller) > -1;
        controller.remove();
        var newController = _add(gui, controller.object, controller.property, {
          before: controller.__li.nextElementSibling,
          factoryArgs: [controller.__min, controller.__max, controller.__step]
        });
        newController.name(oldName);
        if (wasListening) newController.listen();
        return newController;
      }
      return returned;
    };
    controller.min = Common.compose(r, controller.min);
    controller.max = Common.compose(r, controller.max);
  } else if (controller instanceof BooleanController) {
    dom.bind(li, 'click', function () {
      dom.fakeEvent(controller.__checkbox, 'click');
    });
    dom.bind(controller.__checkbox, 'click', function (e) {
      e.stopPropagation();
    });
  } else if (controller instanceof FunctionController) {
    dom.bind(li, 'click', function () {
      dom.fakeEvent(controller.__button, 'click');
    });
    dom.bind(li, 'mouseover', function () {
      dom.addClass(controller.__button, 'hover');
    });
    dom.bind(li, 'mouseout', function () {
      dom.removeClass(controller.__button, 'hover');
    });
  } else if (controller instanceof ColorController) {
    dom.addClass(li, 'color');
    controller.updateDisplay = Common.compose(function (val) {
      li.style.borderLeftColor = controller.__color.toString();
      return val;
    }, controller.updateDisplay);
    controller.updateDisplay();
  }
  controller.setValue = Common.compose(function (val) {
    if (gui.getRoot().__preset_select && controller.isModified()) {
      markPresetModified(gui.getRoot(), true);
    }
    return val;
  }, controller.setValue);
}
function recallSavedValue(gui, controller) {
  var root = gui.getRoot();
  var matchedIndex = root.__rememberedObjects.indexOf(controller.object);
  if (matchedIndex !== -1) {
    var controllerMap = root.__rememberedObjectIndecesToControllers[matchedIndex];
    if (controllerMap === undefined) {
      controllerMap = {};
      root.__rememberedObjectIndecesToControllers[matchedIndex] = controllerMap;
    }
    controllerMap[controller.property] = controller;
    if (root.load && root.load.remembered) {
      var presetMap = root.load.remembered;
      var preset = void 0;
      if (presetMap[gui.preset]) {
        preset = presetMap[gui.preset];
      } else if (presetMap[DEFAULT_DEFAULT_PRESET_NAME]) {
        preset = presetMap[DEFAULT_DEFAULT_PRESET_NAME];
      } else {
        return;
      }
      if (preset[matchedIndex] && preset[matchedIndex][controller.property] !== undefined) {
        var value = preset[matchedIndex][controller.property];
        controller.initialValue = value;
        controller.setValue(value);
      }
    }
  }
}
function _add(gui, object, property, params) {
  if (object[property] === undefined) {
    throw new Error('Object "' + object + '" has no property "' + property + '"');
  }
  var controller = void 0;
  if (params.color) {
    controller = new ColorController(object, property);
  } else {
    var factoryArgs = [object, property].concat(params.factoryArgs);
    controller = ControllerFactory.apply(gui, factoryArgs);
  }
  if (params.before instanceof Controller) {
    params.before = params.before.__li;
  }
  recallSavedValue(gui, controller);
  dom.addClass(controller.domElement, 'c');
  var name = document.createElement('span');
  dom.addClass(name, 'property-name');
  name.innerHTML = controller.property;
  var container = document.createElement('div');
  container.appendChild(name);
  container.appendChild(controller.domElement);
  var li = addRow(gui, container, params.before);
  dom.addClass(li, GUI.CLASS_CONTROLLER_ROW);
  if (controller instanceof ColorController) {
    dom.addClass(li, 'color');
  } else {
    dom.addClass(li, _typeof(controller.getValue()));
  }
  augmentController(gui, li, controller);
  gui.__controllers.push(controller);
  return controller;
}
function getLocalStorageHash(gui, key) {
  return document.location.href + '.' + key;
}
function addPresetOption(gui, name, setSelected) {
  var opt = document.createElement('option');
  opt.innerHTML = name;
  opt.value = name;
  gui.__preset_select.appendChild(opt);
  if (setSelected) {
    gui.__preset_select.selectedIndex = gui.__preset_select.length - 1;
  }
}
function showHideExplain(gui, explain) {
  explain.style.display = gui.useLocalStorage ? 'block' : 'none';
}
function addSaveMenu(gui) {
  var div = gui.__save_row = document.createElement('li');
  dom.addClass(gui.domElement, 'has-save');
  gui.__ul.insertBefore(div, gui.__ul.firstChild);
  dom.addClass(div, 'save-row');
  var gears = document.createElement('span');
  gears.innerHTML = '&nbsp;';
  dom.addClass(gears, 'button gears');
  var button = document.createElement('span');
  button.innerHTML = 'Save';
  dom.addClass(button, 'button');
  dom.addClass(button, 'save');
  var button2 = document.createElement('span');
  button2.innerHTML = 'New';
  dom.addClass(button2, 'button');
  dom.addClass(button2, 'save-as');
  var button3 = document.createElement('span');
  button3.innerHTML = 'Revert';
  dom.addClass(button3, 'button');
  dom.addClass(button3, 'revert');
  var select = gui.__preset_select = document.createElement('select');
  if (gui.load && gui.load.remembered) {
    Common.each(gui.load.remembered, function (value, key) {
      addPresetOption(gui, key, key === gui.preset);
    });
  } else {
    addPresetOption(gui, DEFAULT_DEFAULT_PRESET_NAME, false);
  }
  dom.bind(select, 'change', function () {
    for (var index = 0; index < gui.__preset_select.length; index++) {
      gui.__preset_select[index].innerHTML = gui.__preset_select[index].value;
    }
    gui.preset = this.value;
  });
  div.appendChild(select);
  div.appendChild(gears);
  div.appendChild(button);
  div.appendChild(button2);
  div.appendChild(button3);
  if (SUPPORTS_LOCAL_STORAGE) {
    var explain = document.getElementById('dg-local-explain');
    var localStorageCheckBox = document.getElementById('dg-local-storage');
    var saveLocally = document.getElementById('dg-save-locally');
    saveLocally.style.display = 'block';
    if (localStorage.getItem(getLocalStorageHash(gui, 'isLocal')) === 'true') {
      localStorageCheckBox.setAttribute('checked', 'checked');
    }
    showHideExplain(gui, explain);
    dom.bind(localStorageCheckBox, 'change', function () {
      gui.useLocalStorage = !gui.useLocalStorage;
      showHideExplain(gui, explain);
    });
  }
  var newConstructorTextArea = document.getElementById('dg-new-constructor');
  dom.bind(newConstructorTextArea, 'keydown', function (e) {
    if (e.metaKey && (e.which === 67 || e.keyCode === 67)) {
      SAVE_DIALOGUE.hide();
    }
  });
  dom.bind(gears, 'click', function () {
    newConstructorTextArea.innerHTML = JSON.stringify(gui.getSaveObject(), undefined, 2);
    SAVE_DIALOGUE.show();
    newConstructorTextArea.focus();
    newConstructorTextArea.select();
  });
  dom.bind(button, 'click', function () {
    gui.save();
  });
  dom.bind(button2, 'click', function () {
    var presetName = prompt('Enter a new preset name.');
    if (presetName) {
      gui.saveAs(presetName);
    }
  });
  dom.bind(button3, 'click', function () {
    gui.revert();
  });
}
function addResizeHandle(gui) {
  var pmouseX = void 0;
  gui.__resize_handle = document.createElement('div');
  Common.extend(gui.__resize_handle.style, {
    width: '6px',
    marginLeft: '-3px',
    height: '200px',
    cursor: 'ew-resize',
    position: 'absolute'
  });
  function drag(e) {
    e.preventDefault();
    gui.width += pmouseX - e.clientX;
    gui.onResize();
    pmouseX = e.clientX;
    return false;
  }
  function dragStop() {
    dom.removeClass(gui.__closeButton, GUI.CLASS_DRAG);
    dom.unbind(window, 'mousemove', drag);
    dom.unbind(window, 'mouseup', dragStop);
  }
  function dragStart(e) {
    e.preventDefault();
    pmouseX = e.clientX;
    dom.addClass(gui.__closeButton, GUI.CLASS_DRAG);
    dom.bind(window, 'mousemove', drag);
    dom.bind(window, 'mouseup', dragStop);
    return false;
  }
  dom.bind(gui.__resize_handle, 'mousedown', dragStart);
  dom.bind(gui.__closeButton, 'mousedown', dragStart);
  gui.domElement.insertBefore(gui.__resize_handle, gui.domElement.firstElementChild);
}
function setWidth(gui, w) {
  gui.domElement.style.width = w + 'px';
  if (gui.__save_row && gui.autoPlace) {
    gui.__save_row.style.width = w + 'px';
  }
  if (gui.__closeButton) {
    gui.__closeButton.style.width = w + 'px';
  }
}
function getCurrentPreset(gui, useInitialValues) {
  var toReturn = {};
  Common.each(gui.__rememberedObjects, function (val, index) {
    var savedValues = {};
    var controllerMap = gui.__rememberedObjectIndecesToControllers[index];
    Common.each(controllerMap, function (controller, property) {
      savedValues[property] = useInitialValues ? controller.initialValue : controller.getValue();
    });
    toReturn[index] = savedValues;
  });
  return toReturn;
}
function setPresetSelectIndex(gui) {
  for (var index = 0; index < gui.__preset_select.length; index++) {
    if (gui.__preset_select[index].value === gui.preset) {
      gui.__preset_select.selectedIndex = index;
    }
  }
}
function updateDisplays(controllerArray) {
  if (controllerArray.length !== 0) {
    requestAnimationFrame$1.call(window, function () {
      updateDisplays(controllerArray);
    });
  }
  Common.each(controllerArray, function (c) {
    c.updateDisplay();
  });
}

var color = {
  Color: Color,
  math: ColorMath,
  interpret: interpret
};
var controllers = {
  Controller: Controller,
  BooleanController: BooleanController,
  OptionController: OptionController,
  StringController: StringController,
  NumberController: NumberController,
  NumberControllerBox: NumberControllerBox,
  NumberControllerSlider: NumberControllerSlider,
  FunctionController: FunctionController,
  ColorController: ColorController
};
var dom$1 = { dom: dom };
var gui = { GUI: GUI };
var GUI$1 = GUI;
var index = {
  color: color,
  controllers: controllers,
  dom: dom$1,
  gui: gui,
  GUI: GUI$1
};


/* harmony default export */ __webpack_exports__["default"] = (index);
//# sourceMappingURL=dat.gui.module.js.map


/***/ }),

/***/ "./node_modules/debounce/index.js":
/*!****************************************!*\
  !*** ./node_modules/debounce/index.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * Returns a function, that, as long as it continues to be invoked, will not
 * be triggered. The function will be called after it stops being called for
 * N milliseconds. If `immediate` is passed, trigger the function on the
 * leading edge, instead of the trailing. The function also has a property 'clear' 
 * that is a function which will clear the timer to prevent previously scheduled executions. 
 *
 * @source underscore.js
 * @see http://unscriptable.com/2009/03/20/debouncing-javascript-methods/
 * @param {Function} function to wrap
 * @param {Number} timeout in ms (`100`)
 * @param {Boolean} whether to execute at the beginning (`false`)
 * @api public
 */

module.exports = function debounce(func, wait, immediate){
  var timeout, args, context, timestamp, result;
  if (null == wait) wait = 100;

  function later() {
    var last = Date.now() - timestamp;

    if (last < wait && last >= 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      if (!immediate) {
        result = func.apply(context, args);
        context = args = null;
      }
    }
  };

  var debounced = function(){
    context = this;
    args = arguments;
    timestamp = Date.now();
    var callNow = immediate && !timeout;
    if (!timeout) timeout = setTimeout(later, wait);
    if (callNow) {
      result = func.apply(context, args);
      context = args = null;
    }

    return result;
  };

  debounced.clear = function() {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
  };
  
  debounced.flush = function() {
    if (timeout) {
      result = func.apply(context, args);
      context = args = null;
      
      clearTimeout(timeout);
      timeout = null;
    }
  };

  return debounced;
};


/***/ }),

/***/ "./node_modules/micromodal/dist/micromodal.es.js":
/*!*******************************************************!*\
  !*** ./node_modules/micromodal/dist/micromodal.es.js ***!
  \*******************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
var version="0.3.1",classCallCheck=function(e,o){if(!(e instanceof o))throw new TypeError("Cannot call a class as a function")},createClass=function(){function e(e,o){for(var t=0;t<o.length;t++){var i=o[t];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(o,t,i){return t&&e(o.prototype,t),i&&e(o,i),o}}(),toConsumableArray=function(e){if(Array.isArray(e)){for(var o=0,t=Array(e.length);o<e.length;o++)t[o]=e[o];return t}return Array.from(e)},MicroModal=function(){var e=["a[href]","area[href]",'input:not([disabled]):not([type="hidden"]):not([aria-hidden])',"select:not([disabled]):not([aria-hidden])","textarea:not([disabled]):not([aria-hidden])","button:not([disabled]):not([aria-hidden])","iframe","object","embed","[contenteditable]",'[tabindex]:not([tabindex^="-"])'],o=function(){function o(e){var t=e.targetModal,i=e.triggers,n=void 0===i?[]:i,a=e.onShow,r=void 0===a?function(){}:a,s=e.onClose,l=void 0===s?function(){}:s,c=e.openTrigger,d=void 0===c?"data-micromodal-trigger":c,u=e.closeTrigger,h=void 0===u?"data-micromodal-close":u,f=e.disableScroll,v=void 0!==f&&f,g=e.disableFocus,m=void 0!==g&&g,b=e.awaitCloseAnimation,y=void 0!==b&&b,k=e.debugMode,w=void 0!==k&&k;classCallCheck(this,o),this.modal=document.getElementById(t),this.config={debugMode:w,disableScroll:v,openTrigger:d,closeTrigger:h,onShow:r,onClose:l,awaitCloseAnimation:y,disableFocus:m},n.length>0&&this.registerTriggers.apply(this,toConsumableArray(n)),this.onClick=this.onClick.bind(this),this.onKeydown=this.onKeydown.bind(this)}return createClass(o,[{key:"registerTriggers",value:function(){for(var e=this,o=arguments.length,t=Array(o),i=0;i<o;i++)t[i]=arguments[i];t.forEach(function(o){o.addEventListener("click",function(){return e.showModal()})})}},{key:"showModal",value:function(){this.activeElement=document.activeElement,this.modal.setAttribute("aria-hidden","false"),this.modal.classList.add("is-open"),this.setFocusToFirstNode(),this.scrollBehaviour("disable"),this.addEventListeners(),this.config.onShow(this.modal)}},{key:"closeModal",value:function(){var e=this.modal;this.modal.setAttribute("aria-hidden","true"),this.removeEventListeners(),this.scrollBehaviour("enable"),this.activeElement.focus(),this.config.onClose(this.modal),this.config.awaitCloseAnimation?this.modal.addEventListener("animationend",function o(){e.classList.remove("is-open"),e.removeEventListener("animationend",o,!1)},!1):e.classList.remove("is-open")}},{key:"scrollBehaviour",value:function(e){if(this.config.disableScroll){var o=document.querySelector("body");switch(e){case"enable":Object.assign(o.style,{overflow:"initial",height:"initial"});break;case"disable":Object.assign(o.style,{overflow:"hidden",height:"100vh"})}}}},{key:"addEventListeners",value:function(){this.modal.addEventListener("touchstart",this.onClick),this.modal.addEventListener("click",this.onClick),document.addEventListener("keydown",this.onKeydown)}},{key:"removeEventListeners",value:function(){this.modal.removeEventListener("touchstart",this.onClick),this.modal.removeEventListener("click",this.onClick),document.removeEventListener("keydown",this.onKeydown)}},{key:"onClick",value:function(e){e.target.hasAttribute(this.config.closeTrigger)&&(this.closeModal(),e.preventDefault())}},{key:"onKeydown",value:function(e){27===e.keyCode&&this.closeModal(e),9===e.keyCode&&this.maintainFocus(e)}},{key:"getFocusableNodes",value:function(){var o=this.modal.querySelectorAll(e);return Object.keys(o).map(function(e){return o[e]})}},{key:"setFocusToFirstNode",value:function(){if(!this.config.disableFocus){var e=this.getFocusableNodes();e.length&&e[0].focus()}}},{key:"maintainFocus",value:function(e){var o=this.getFocusableNodes();if(this.modal.contains(document.activeElement)){var t=o.indexOf(document.activeElement);e.shiftKey&&0===t&&(o[o.length-1].focus(),e.preventDefault()),e.shiftKey||t!==o.length-1||(o[0].focus(),e.preventDefault())}else o[0].focus()}}]),o}(),t=null,i=function(e,o){var t=[];return e.forEach(function(e){var i=e.attributes[o].value;void 0===t[i]&&(t[i]=[]),t[i].push(e)}),t},n=function(e){if(!document.getElementById(e))return console.warn("MicroModal v"+version+": ❗Seems like you have missed %c'"+e+"'","background-color: #f8f9fa;color: #50596c;font-weight: bold;","ID somewhere in your code. Refer example below to resolve it."),console.warn("%cExample:","background-color: #f8f9fa;color: #50596c;font-weight: bold;",'<div class="modal" id="'+e+'"></div>'),!1},a=function(e){if(e.length<=0)return console.warn("MicroModal v"+version+": ❗Please specify at least one %c'micromodal-trigger'","background-color: #f8f9fa;color: #50596c;font-weight: bold;","data attribute."),console.warn("%cExample:","background-color: #f8f9fa;color: #50596c;font-weight: bold;",'<a href="#" data-micromodal-trigger="my-modal"></a>'),!1},r=function(e,o){if(a(e),!o)return!0;for(var t in o)n(t);return!0};return{init:function(e){var t=Object.assign({},{openTrigger:"data-micromodal-trigger"},e),n=[].concat(toConsumableArray(document.querySelectorAll("["+t.openTrigger+"]"))),a=i(n,t.openTrigger);if(!0!==t.debugMode||!1!==r(n,a))for(var s in a){var l=a[s];t.targetModal=s,t.triggers=[].concat(toConsumableArray(l)),new o(t)}},show:function(e,i){var a=i||{};a.targetModal=e,!0===a.debugMode&&!1===n(e)||(t=new o(a)).showModal()},close:function(){t.closeModal()}}}();/* harmony default export */ __webpack_exports__["default"] = (MicroModal);


/***/ })

/******/ });
//# sourceMappingURL=bundle.js.map