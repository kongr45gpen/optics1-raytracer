import {wlToRgb} from "./lookup";
import {RayAbsorbed} from "./absorber";

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

        // Threshold for considering we are close to a point
        const threshold = Math.pow(2 / parseFloat(conf.stepsHi), 2);

        for (let i = 0; i < object.points.length; i++) { // for every point of the object...
            let point = object.points[i];

            if (Math.pow(x - point[0], 2) + Math.pow(y - point[1], 2) <= threshold) {
                // We found an intersection!
                if (conf.debug) {
                    // Mark the precise points for debugging, if enabled
                    ctx.fillStyle = 'rgb(50,255,255)';
                    ctx.fillRect(x - 4, y - 4, 8, 8);
                }

                // Find the angle of incidence
                // First, we need to find the adjacent point of the intersecting point
                let secondPoint;
                if (i < object.points.length - 1) {
                    secondPoint = object.points[i + 1];
                } else {
                    // swap the points
                    secondPoint = point;
                    point = object.points[i - 1];
                }

                if (conf.debug) {
                  // Color the intersecting points of the OBJECT, so we can see which points the algorithm
                  // considers first
                  ctx.fillStyle = 'rgb(200,150,50)';
                  ctx.fillRect(point[0] - 5, point[1] - 3, 10, 6);
                  ctx.fillRect(secondPoint[0] - 5, secondPoint[1] - 3, 10, 6);
                }

                // Find the angle of the object's line
                let ang1 = - Math.atan2(secondPoint[1] - point[1], secondPoint[0] - point[0]);

                let incident = - rot - ang1 + Math.PI / 2.0;
                let newAngle = object.newAngle(incident, this.wavelength);

                if (isFinite(newAngle)) {
                    return - newAngle - ang1;
                }

                // If the angle is not a number (e.g. an instance of RayAbsorbed), return it unchanged
                return newAngle;
            }
        }

        return null;
    }

    draw(ctx, objects) {
        // Display parameters of the ray
        ctx.strokeStyle = 'rgba(' + this.colour[0] + ',' + this.colour[1] + ',' + this.colour[2] + ',' + (0.2 + 0.8 * this.intensity) + ')';
        ctx.lineWidth = 0.5 + 3 * this.intensity;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);

        let rotation = this.rot; // current rotation
        let x = this.x;
        let y = this.y;
        let cooldown = 0;

        const step = 1 / parseFloat(conf.stepsLo);
        const smallStep = 1 / parseFloat(conf.stepsHi);
        const max = conf.maxSteps;

        let self = this;
        let rayAbsorbed = false;

        for (let i = 0; i < max; i++) {
            // A list of objects that are close to our ray and should be examined for intersection
            let closeObjects = [];
            if (cooldown === 0) {
                objects.every(function (object) { // for each object...
                    if (!object.affectsLight) return true; // We don't care about torches

                    if (Math.pow(x - object.x, 2) + Math.pow(y - object.y, 2) <= object.maxDistance + 10.0) {
                        // We are close!
                        closeObjects.push(object);

                        // Find all the points of the object. If we are close enough to one of them,
                        // perform the intersection.
                        let result = self._findCollisions(x, y, rotation, object);
                        if (result instanceof RayAbsorbed) {
                            // The ray has been absorbed -- no more points to draw!
                            rayAbsorbed = true;

                            if (conf.debug) {
                                // Mark the precise points for debugging, if enabled
                                ctx.fillStyle = 'rgb(255,0,0)';
                                ctx.fillRect(x - 3, y - 3, 6, 6);
                            }

                            return false;
                        } else if (result !== null) {
                            // Intersection found!
                            rotation = result; // Change the orientation of the ray

                            // Prevent a second collision from occuring, since we are still very
                            // close to the specified object
                            cooldown += 3;

                            // Don't look for more intersections
                            return false;
                        }
                    }

                    return true;
                });
            } else {
                cooldown--;
            }

            if (rayAbsorbed) {
                // The ray has been absorbed. Don't continue to draw anything.
                break;
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

                if (conf.debug) {
                    // Mark the precise points for debugging, if enabled
                    ctx.fillStyle = 'rgb(0,0,50)';
                    ctx.fillRect(x - 3, y - 3, 6, 6);
                }
            }

            if (x < 0 || x > conf.canvasWidth || y < 0 || y > conf.canvasHeight) {
                // Got outside of bounds!

                if (conf.debug) {
                    // Mark the precise points for debugging, if enabled
                    ctx.fillStyle = 'rgb(200,0,0)';
                    ctx.fillRect(x - 8, y - 8, 16, 16);
                }

                // Don't continue rendering
                break;
            }

            ctx.lineTo(x, y);
        }

        ctx.stroke();
    }
}
