let globalId = 1;


export class Instrument {
    constructor(x, y) {
        this.id = (globalId++);
        this.affectsLight = true;
        this.isMirror = false;

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
        this.maxVerticalDistance = 0.0;
    }

    draw(ctx) {
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

    getRays() {
        return [];
    }

    prepareRayTracingPoints() {
        let self = this;

        this.points.forEach(function (point) {
            // Find out the largest distance of the farthest away point
            let distance = Math.pow(point[0] - self.x, 2) + Math.pow(point[1] - self.y, 2);
            if (distance > self.maxDistance) {
                self.maxDistance = distance;
            }
            if (Math.abs(point[1] - self.y) > self.maxVerticalDistance) {
                self.maxVerticalDistance = Math.abs(point[1] - self.y);
            }
        });
    }

    clear() {
        this.points = [];
        this.maxDistance = 0;
        this.maxVerticalDistance = 0;
    }

    // TODO: onLoad function for callbacks

    // Get important attributes of this object so they can be used for JSON exports
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

    static reset() {
        globalId = 1;
    }
}
