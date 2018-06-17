import { MirrorCircular } from './mirrorCircular.js'

export class LensCircular extends MirrorCircular {
    constructor() {
        super();

        this.n = 1.4;

        this.exportedProperties = [
            'x', 'y', 'rot', 'radius', 'size', 'n'
        ];
    }

    newAngle(incident) {
        // if (Math.abs(incident) < 0.01) return Math.PI / 2.0;

        // Find out if the ray is coming from inside or outside the lens
        const rayInside = Math.cos(incident) < 0;
        const ratio = (!rayInside) ? conf.n / this.n : this.n / conf.n; // n1/n2 ratio

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
