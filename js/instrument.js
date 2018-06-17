let globalId = 1;


export class Instrument {
    constructor(x, y) {
        this.id = (globalId++);
        this.affectsLight = true;

        this.x = x;
        this.y = y;
        this.rot = 0;

        // Utility properties
        this.name = this.constructor.name + " #" + this.id;
        console.log(this.name);

        this.points = [];

        // The (squared) distance of the farthest away point of this object;
        // used to speed up collision detection
        this.maxDistance = 0.0;
    }

    draw(ctx) {
        // ctx.fillStyle = 'rgb(200, 0, 0)';
        // ctx.fillRect(this.x - 25, this.y - 25, 50, 50);
        // ctx.translate(this.x, this.y);
        // ctx.rotate(this.rot * Math.PI / 180);
        // // ctx.drawImage(torchImg, -25, -25,50,50);
        // ctx.setTransform(1, 0, 0, 1, 0, 0);

        if (conf.debug) {
            this.points.forEach(function (point) {
                // console.log("Found point " + point[0]);

                ctx.beginPath();
                ctx.arc(point[0], point[1], 1.5, 0, 2 * Math.PI, false);
                ctx.fillStyle = 'rgb(20,215,50)';
                ctx.fill();
                // ctx.lineWidth = 5;
                // ctx.strokeStyle = '#003300';
                // ctx.stroke();
            });
        }
    }

    getRays() {
        return [];
    }

    prepareRayTraycingPoints() {
        let self = this;

        this.points.forEach(function (point) {
            // Find out the largest distance of the farthest away point
            let distance = Math.pow(point[0] - self.x, 2) + Math.pow(point[1] - self.y, 2);
            if (distance > self.maxDistance) {
                self.maxDistance = distance;
            }
        });
    }

    clear() {
        this.points = [];
        this.maxDistance = 0;
    }

    // onLoad
}
