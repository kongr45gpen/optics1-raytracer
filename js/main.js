console.log("'ello");

import dat from 'dat.gui';

import { drawLegacy } from './legacy.js';
import { Torch } from './torch.js';

const gui = new dat.GUI();

class Config {
    constructor() {
        this.torchX = 100;
        this.torchY = 100;
        this.torchRot = 0;

        this.mirrorX = 300;
        this.mirrorY = 100;
        this.mirrorRot = 45;

        this.addTorch = function()
        {
            let object = new Torch(0, 5);
            objects.push(object);

            let folder = gui.addFolder('Torch #' + object.id);
            object.exportedProperties.forEach(function(prop) {
                if (prop === 'x' || prop === 'y') {
                    folder.add(object, prop, 0, 300).onChange(draw);
                } else if (prop === 'rot') {
                    folder.add(object, prop, 0, 360).onChange(draw);
                } else if (prop === 'intensity') {
                    folder.add(object, prop, 0.0, 1.0).onChange(draw);
                } else if (prop === 'wavelength') {
                    folder.add(object, prop, 380, 780).onChange(draw);
                }
            })
        };
    }
}
let conf = new Config();
window.conf = conf;

let canvas = document.getElementById('app');
let ctx = canvas.getContext('2d');

let objects = [];

const draw = function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    objects.forEach(function (obj) {
        console.log("Drawing object #" + obj.id);
        obj.draw(ctx);
    })

    // drawLegacy(ctx, conf, torchImg);
};

let torchImg = new Image();
torchImg.src = 'imgs/torch.svg';
torchImg.addEventListener('load', draw, false);




gui.add(conf, 'torchX', 0, 300).onChange(draw);
gui.add(conf, 'torchY', 0, 300).onChange(draw);
gui.add(conf, 'torchRot', -180, 180).onChange(draw);
gui.add(conf, 'mirrorX', 0, 500).onChange(draw);
gui.add(conf, 'mirrorY', 0, 500).onChange(draw);
gui.add(conf, 'mirrorRot', -180, 180).onChange(draw);
gui.add(conf, 'addTorch');
gui.remember(conf);

