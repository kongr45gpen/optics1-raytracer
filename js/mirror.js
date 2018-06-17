import {Instrument} from './instrument.js'
import {Ray} from './ray.js'
import {wlToRgb} from './lookup.js'

const depth = 8;

export class Mirror extends Instrument {
    constructor() {
        super(400, 150);

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
    prepareRayTraycingPoints() {
        const angle = this.rot * Math.PI / 180; // angle in radians

        // These variables will be needed later
        const sin = Math.sin(angle);
        const cos = Math.cos(angle);

        // Calculate angles of the 4 points of the mirror, based on trigonometry
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

        super.prepareRayTraycingPoints(); // call parent method
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
