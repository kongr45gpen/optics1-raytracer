import {wlToRgb} from "./lookup";

export class Ray {
    constructor(startX, startY, rot, intensity, wavelength = 595) {
        this.x = startX;
        this.y = startY;

        // Store rotation in radians
        this.rot = rot / 180 * Math.PI;

        this.intensity = intensity;
        this.wavelength = wavelength;

        // The RGB colour of the ray
        this.colour = wlToRgb[parseInt(wavelength) - 380];
    }

    /**
     * Given a ray point, find intersections with an object
     */
    _findCollisions(x, y, rot, object) {
        if (object.points.length <= 1) throw new Error("An instrument needs at least 2 points.");

        const threshold = Math.pow(2 / parseFloat(conf.stepsHi), 2);

        for (let i = 0; i < object.points.length; i++) {
            let point = object.points[i];

            if (Math.pow(x - point[0], 2) + Math.pow(y - point[1], 2) <= threshold) {
                // We found an intersection!
                if (conf.debug) {
                    // Mark the precise points for debugging, if enabled
                    ctx.fillStyle = 'rgb(50,255,255)';
                    ctx.fillRect(x - 4, y - 4, 8, 8);
                }

                // Find the angle of incidence
                // First, we need to find the closest point on the line
                let secondPoint;
                if (i < object.points.length - 1) {
                    secondPoint = object.points[i + 1];
                } else {
                    // swap the points
                    secondPoint = point;
                    point = object.points[i - 1];
                }

                // Find the angle of the object line
                let ang1 = -Math.atan2(secondPoint[1] - point[1], secondPoint[0] - point[0]);

                // incidentAngle = 180o + rayAngle - objectAngle - 90o
                let incident = -rot - ang1 + Math.PI / 2.0;
                let newAngle = object.newAngle(incident) + ang1;

                return -newAngle;
            }
        }

        return null;
    }

    draw(ctx, objects) {
        ctx.strokeStyle = 'rgba(' + this.colour[0] + ',' + this.colour[1] + ',' + this.colour[2] + ',' + this.intensity + ')';
        ctx.lineWidth = Math.max(3.5 * this.intensity, 1);
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);

        let rotation = this.rot; // current rotation
        let x = this.x;
        let y = this.y;
        let cooldown = 0;

        const step = 1 / parseFloat(conf.stepsLo);
        const smallStep = 1 / parseFloat(conf.stepsHi);

        let self = this;

        for (let i = 0; i < 1000; i++) {
            // A list of objects that are close to our ray and should be examined for intersection
            let closeObjects = [];
            if (cooldown === 0) {
                objects.forEach(function (object) {
                    if (!object.affectsLight) return; // We don't care about torches

                    if (Math.pow(x - object.x, 2) + Math.pow(y - object.y, 2) <= object.maxDistance + 10.0) {
                        // We are close!
                        closeObjects.push(object);

                        // Find all the points of the object. If we are close enough to one of them,
                        // perform the intersection.
                        let result = self._findCollisions(x, y, rotation, object);
                        if (result !== null) {
                            // Intersection found!
                            rotation = result;

                            // Prevent a second collision from occuring, since we are still very
                            // close to the specified object
                            cooldown += 3;
                        }
                    }
                });
            } else {
                cooldown--;
            }

            if (closeObjects.length !== 0) {
                // An object is close. Reduce the step for increased precision.
                x += smallStep * Math.cos(rotation);
                y += smallStep * Math.sin(rotation);

                if (conf.debug) {
                    // Mark the precise points for debugging, if enabled
                    ctx.fillStyle = 'rgb(50,50,255)';
                    ctx.fillRect(x - 3, y - 3, 6, 6);
                }
            } else {
                // No objects are close; continue running in a linear trajectory
                x += step * Math.cos(rotation);
                y += step * Math.sin(rotation);
            }

            ctx.lineTo(x, y);
        }

        // ctx.lineTo(this.x + 250 * Math.cos(this.rot), this.y + 250 * Math.sin(this.rot));
        ctx.stroke();
    }
}
