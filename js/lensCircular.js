import { MirrorCircular } from './mirrorCircular.js'
import {getCauchyB, getDispersion} from "./utilities";


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

    prepareRayTracingPoints() {
        // Calculate Cauchy's Equation factors
        if (this.dispersion) {
            this.CauchyB = getCauchyB(this.n);
        }

        super.prepareRayTracingPoints(); // call parent method
    }

    newAngle(incident, wavelength) {
        // if (Math.abs(incident) < 0.01) return Math.PI / 2.0;

        // Calculate refractive index based on Cauchy's Equation, if needed
        let n = (this.dispersion) ? getDispersion(this.CauchyB, wavelength) : this.n;

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
