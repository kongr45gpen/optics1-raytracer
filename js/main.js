console.log("Welcome to optics1-raytracer");

import dat from 'dat.gui';
import MicroModal from 'micromodal';
import debounce from 'debounce';

import { presets } from './presets.js';
import { Instrument } from './instrument.js';
import { Torch } from './torch.js';
import { Mirror } from './mirror.js';
import { MirrorCircular } from './mirrorCircular.js';
import { LensCircular } from './lensCircular.js';
import { LensConcave } from './lensConcave.js';
import { Absorber } from './absorber.js';

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
        this.canvasSize = 850;
        this.canvasWidth = canvas.scrollWidth;
        this.canvasHeight = canvas.scrollHeight;

        this.debug = false;
        this.resolution = 4.0;
        this.stepsLo = 1.0;
        this.stepsHi = 5.0;
        this.maxSteps = 9000;

        this.n = 1.0;

        this.redraw = function() { draw() };
        this.reset  = function() { reset(); draw(); };

        this.addTorch = function() { addObject(new Torch()); };
        this.addMirror = function() { addObject(new Mirror()); };
        this.addCircularMirror = function() { addObject(new MirrorCircular()); };
        this.addCircularLens = function() { addObject(new LensCircular()); };
        this.addConcaveLens = function() { addObject(new LensConcave()); };
        this.addAbsorber = function() { addObject(new Absorber()); };
    }
}
let conf = new Config();
window.conf = conf; // Make the variable globally accessible

let objects = []; // The list of optical instruments
window.objects = objects;

const performStorage = debounce(function() {
    localStorage.setItem('optics1_raytracer.system', exportData());
}, 250);

const draw = function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Prepare and draw all optical instruments
    objects.forEach(function (obj) {
        obj.clear();
        obj.prepareRayTracingPoints();
        obj.draw(ctx);
    });

    // Draw all rays
    objects.forEach(function (obj) {
        obj.getRays().forEach(function (ray) {
            ray.draw(ctx, objects);
        })
    });

    // Store changes in the local storage
    performStorage();
};

// Set up dat.gui configuration
gui.add(conf, 'n', 1.0, 2.0).onChange(draw);
gui.add(conf, 'debug').onChange(draw);
let folder = gui.addFolder('Configuration');
folder.add(conf, 'resolution', 0.0, 10.0).onChange(draw);
folder.add(conf, 'stepsLo', 0.0, 10.0).onChange(draw);
folder.add(conf, 'stepsHi', 0.0, 20.0).onChange(draw);
folder.add(conf, 'maxSteps', 100, 100000).onChange(draw);
folder.add(conf, 'redraw');
gui.add(conf, 'addTorch');
gui.add(conf, 'addMirror');
gui.add(conf, 'addCircularMirror');
gui.add(conf, 'addCircularLens');
gui.add(conf, 'addConcaveLens');
gui.add(conf, 'addAbsorber');

// Reset function to remove all instruments
function reset()
{
    objects.forEach(function(object) {
        // This might be dangerous
        object.remove();
    });

    Instrument.reset();
}
window.reset = reset;


// Export functions
function exportData()
{
    return JSON.stringify(objects.map(function(object) {
        return object.export();
    }), null, 1).replace(/\n/g, ' ');
}

document.getElementById('export').addEventListener('click', function() {
   document.getElementById('exported-json').innerHTML = exportData();

   MicroModal.show('modal-1');
});

// Import functions
let json = localStorage.getItem('optics1_raytracer.system');
if (json !== undefined && json !== null) {
    importData(JSON.parse(json));
}
// TODO: Use an actual callback instead of this workaround
setTimeout(draw, 1000); // redraw after all elements have loaded
setTimeout(draw, 2000); // 2nd try

document.getElementById('import').addEventListener('click', function() {
    MicroModal.show('modal-2');
});

document.getElementById('import-form').addEventListener('submit', function() {
    MicroModal.close('modal-2');
    importData(JSON.parse(this.elements['import-json'].value));
});

function importData(data) {
    reset();

    data.forEach(function(datum) {
        let object;
        switch (datum.type) {
            case "Mirror":
                object = new Mirror();
                break;
            case "MirrorCircular":
                object = new MirrorCircular();
                break;
            case "LensCircular":
                object = new LensCircular();
                break;
            case "LensConcave":
                object = new LensConcave();
                break;
            case "Torch":
                object = new Torch();
                break;
            case "Absorber":
                object = new Absorber();
                break;
        }

        // Copy properties
        Object.keys(datum).forEach(function(property) {
            if (property === 'id') return; // Don't copy ID, use the already existing one
           object[property] = datum[property];
        });

        addObject(object);
    });
}

// Populate list of presets
const originalButton = document.getElementById('preset-preset');
console.log(originalButton);
for (let key in presets) {
    const configuration = presets[key];

    let button = originalButton.cloneNode(true);
    button.innerText = key; //.replace( /([A-Z])/g, " $1");
    button.id = null;
    button.addEventListener('click', function() {
        importData(configuration);
    });


    originalButton.parentNode.appendChild(button);
}
