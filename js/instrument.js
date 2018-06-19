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
                ctx.arc(point[0], point[1], 1.5, 0, 2 * Math.PI, false);
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
