import { MirrorCircular } from './mirrorCircular.js'

// Constants for dispersion calculation based on Cauchy's equation
// Source: https://en.wikipedia.org/wiki/Cauchy%27s_equation
const AvgWavelength = 580;
const CauchyC = 0.1 * 1000000; // set to 0.01 for a more realistic value

export class LensCircular extends MirrorCircular {
    constructor() {
        super();
        this.isMirror = false;

        this.n = 1.4;
        this.dispersion = false;

        this.exportedProperties = [
            'x', 'y', 'rot', 'radius', 'size', 'n', 'dispersion'
        ];
    }

    prepareRayTraycingPoints() {
        // Calculate Cauchy's Equation factors
        if (this.dispersion) {
            this.CauchyB = this.n - CauchyC / Math.pow(AvgWavelength, 2);
        }

        super.prepareRayTraycingPoints(); // call parent method
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
}
