console.log("'ello");

import dat from 'dat.gui';

import { drawLegacy } from './legacy.js';
import { Torch } from './torch.js';
import { Mirror } from './mirror.js';

const gui = new dat.GUI();

function addObject(object)
{
    objects.push(object);
    console.log("Adding object " + object.name);

    let folder = gui.addFolder(object.name);
    object.exportedProperties.forEach(function(prop) {
        if (prop === 'x' || prop === 'y') {
            folder.add(object, prop, 0, 300).onChange(draw);
        } else if (prop === 'rot') {
            folder.add(object, prop, 0, 360).onChange(draw);
        } else if (prop === 'intensity') {
            folder.add(object, prop, 0.0, 1.0).onChange(draw);
        } else if (prop === 'wavelength') {
            folder.add(object, prop, 380, 780).onChange(draw);
        } else if (prop === 'size') {
            folder.add(object, prop, 0, 200).onChange(draw);
        }
    });
    folder.open();

    draw();
}

class Config {
    constructor() {
        this.debug = true;
        this.resolution = 5.0;

        this.stepsLo = 4.0;
        this.stepsHi = 6.0;

        this.redraw = function() { draw() };

        this.addTorch = function()
        {
            addObject(new Torch(0, 5));
        };

        this.addMirror = function() { addObject(new Mirror()); };
    }
}
let conf = new Config();
window.conf = conf; // Make the variable globally accessible

let canvas = document.getElementById('app');
let ctx = canvas.getContext('2d');
window.ctx = ctx;

let objects = [];

const draw = function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    objects.forEach(function (obj) {
        obj.clear();
        obj.prepareRayTraycingPoints();
        obj.draw(ctx);
    });

    objects.forEach(function (obj) {
        obj.getRays().forEach(function (ray) {
            ray.draw(ctx, objects);
        })
    });

    // drawLegacy(ctx, conf, torchImg);
};

let torchImg = new Image();
torchImg.src = 'imgs/torch.svg';
torchImg.addEventListener('load', draw, false);




// gui.add(conf, 'torchX', 0, 300).onChange(draw);
// gui.add(conf, 'torchY', 0, 300).onChange(draw);
// gui.add(conf, 'torchRot', -180, 180).onChange(draw);
// gui.add(conf, 'mirrorX', 0, 500).onChange(draw);
// gui.add(conf, 'mirrorY', 0, 500).onChange(draw);
// gui.add(conf, 'mirrorRot', -180, 180).onChange(draw);
gui.add(conf, 'debug').onChange(draw);
gui.add(conf, 'resolution', 0.0, 10.0).onChange(draw);
gui.add(conf, 'stepsLo', 0.0, 10.0).onChange(draw);
gui.add(conf, 'stepsHi', 0.0, 20.0).onChange(draw);
gui.add(conf, 'addTorch');
gui.add(conf, 'addMirror');
gui.add(conf, 'redraw');
gui.remember(conf);

