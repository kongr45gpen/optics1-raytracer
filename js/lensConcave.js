import { Instrument } from './instrument.js'

const depth = 16;

// Constants for dispersion calculation based on Cauchy's equation
// Source: https://en.wikipedia.org/wiki/Cauchy%27s_equation
const AvgWavelength = 580;
const CauchyC = 0.1 * 1000000; // set to 0.01 for a more realistic value

export class LensConcave extends Instrument {
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
            this.CauchyB = this.n - CauchyC / Math.pow(AvgWavelength, 2);
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
        let n;
        if (this.dispersion) {
            // n(l) = B + C/(l^2)
            n = this.CauchyB + CauchyC / Math.pow(wavelength, 2);
        } else {
            n = this.n;
        }

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
