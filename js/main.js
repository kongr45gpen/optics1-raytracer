console.log("Welcome to optics1-raytracer");

import dat from 'dat.gui';

import { drawLegacy } from './legacy.js';
import { Torch } from './torch.js';
import { Mirror } from './mirror.js';
import { MirrorCircular } from './mirrorCircular.js';
import { LensCircular } from './lensCircular.js';
import { LensConcave } from './lensConcave.js';

const gui = new dat.GUI();

function addObject(object)
{
    const id = object.id;
    const name = object.name;

    objects.push(object);
    console.log("Adding object " + object.name);

    const folder = gui.addFolder(object.name);
    object.exportedProperties.forEach(function(prop) {
        if (prop === 'x' || prop === 'y') {
            folder.add(object, prop, 0, conf.canvasSize).onChange(draw);
        } else if (prop === 'rot') {
            folder.add(object, prop, -180, 180).onChange(draw);
        } else if (prop === 'intensity') {
            folder.add(object, prop, 0.0, 1.0).onChange(draw);
        } else if (prop === 'wavelength') {
            folder.add(object, prop, 380, 780).onChange(draw);
        } else if (prop === 'size') {
            folder.add(object, prop, 0, 200).onChange(draw);
        } else if (prop === 'radius') {
            folder.add(object, prop, 0, 200).onChange(draw);
        } else if (prop === 'n') {
            folder.add(object, prop, 0.9, 5.0).onChange(draw);
        } else {
            folder.add(object, prop).onChange(draw);
        }
    });
    object.remove = function() {
        // Delete the object from the list of objects
        objects = objects.filter(function(item) { return item.id !== id });
        draw();
        gui.removeFolder(folder);
    };
    folder.add(object, 'remove');
    folder.open();

    draw();
}

let canvas = document.getElementById('app');
let ctx = canvas.getContext('2d');
window.ctx = ctx;

class Config {
    constructor() {
        this.canvasSize = 700;
        this.canvasWidth = canvas.scrollWidth;
        this.canvasHeight = canvas.scrollHeight;

        this.debug = true;
        this.resolution = 5.0;
        this.stepsLo = 1.0;
        this.stepsHi = 5.0;
        this.maxSteps = 20000;

        this.n = 1.0;

        this.redraw = function() { draw() };

        this.addTorch = function()
        {
            addObject(new Torch(0, 5));
        };

        this.addMirror = function() { addObject(new Mirror()); };
        this.addCircularMirror = function() { addObject(new MirrorCircular()); };
        this.addCircularLens = function() { addObject(new LensCircular()); };
        this.addConcaveLens = function() { addObject(new LensConcave()); };
    }
}
let conf = new Config();
window.conf = conf; // Make the variable globally accessible

let objects = []; // The list of optical instruments
window.objects = objects;

const draw = function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Prepare and draw all optical instruments
    objects.forEach(function (obj) {
        obj.clear();
        obj.prepareRayTraycingPoints();
        obj.draw(ctx);
    });

    // Draw all rays
    objects.forEach(function (obj) {
        obj.getRays().forEach(function (ray) {
            ray.draw(ctx, objects);
        })
    });
};

// Set up dat.gui configuration
gui.add(conf, 'n', 1.0, 2.0).onChange(draw);
let folder = gui.addFolder('Configuration');
folder.add(conf, 'debug').onChange(draw);
folder.add(conf, 'resolution', 0.0, 10.0).onChange(draw);
folder.add(conf, 'stepsLo', 0.0, 10.0).onChange(draw);
folder.add(conf, 'stepsHi', 0.0, 20.0).onChange(draw);
folder.add(conf, 'maxSteps', 100, 100000).onChange(draw);
folder.open();
gui.add(conf, 'addTorch');
gui.add(conf, 'addMirror');
gui.add(conf, 'addCircularMirror');
gui.add(conf, 'addCircularLens');
gui.add(conf, 'addConcaveLens');
gui.add(conf, 'redraw');

// Export functions
document.getElementById('export').addEventListener('click', function() {
   console.log(JSON.stringify(objects.map(function(object) {
       return object.export();
   })));
});
