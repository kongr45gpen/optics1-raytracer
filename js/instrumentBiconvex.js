import {Instrument} from './instrument.js'

export class InstrumentBiconvex extends Instrument {
    constructor() {
        super(300, 150);

        // Default values for some parameters
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
