import {Instrument} from './instrument.js'
import {Ray} from './ray.js'
import {wlToRgb} from './lookup.js'

const depth = 8;

export class Absorber extends Instrument {
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
export class RayAbsorbed {}
