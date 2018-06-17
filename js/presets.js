export let presets = {};

presets['Simple'] = [
    {
        type: 'Torch',
        id: 1,
        x: 150,
        y: 150,
        rot: 0,
        intensity: 0.9,
        wavelength: 595
    },
    {
        type: 'Torch',
        id: 2,
        x: 150,
        y: 180,
        rot: 0,
        intensity: 0.9,
        wavelength: 487
    },
    {
        type: 'Torch',
        id: 3,
        x: 150,
        y: 120,
        rot: 0,
        intensity: 0.9,
        wavelength: 536
    },
    {
        type: 'Mirror',
        id: 4,
        x: 400,
        y: 150,
        rot: -45,
        size: 100
    },
    {
        type: 'Absorber',
        id: 5,
        x: 400,
        y: 420,
        rot: 90,
        size: 100
    }
];

presets['Complex'] = [
    {
        type: 'Torch',
        id: 1,
        x: 50,
        y: 250,
        rot: -10,
        intensity: 1,
        wavelength: 616
    },
    {
        type: 'Torch',
        id: 2,
        x: 50,
        y: 250,
        rot: 0,
        intensity: 1,
        wavelength: 567
    },
    {
        type: 'Torch',
        id: 3,
        x: 50,
        y: 250,
        rot: 10,
        intensity: 1,
        wavelength: 479
    },
    {
        type: 'LensCircular',
        id: 4,
        x: 200,
        y: 250,
        rot: 0,
        radius: 120,
        size: 70,
        n: 1.68,
        dispersion: false
    },
    {
        type: 'LensConcave',
        id: 5,
        x: 300,
        y: 250,
        rot: 0,
        radius: 120,
        size: 70,
        n: 1.7,
        dispersion: false
    },
    {
        type: 'Mirror',
        id: 6,
        x: 500,
        y: 250,
        rot: 45,
        size: 100
    },
    {
        type: 'MirrorCircular',
        id: 7,
        x: 489,
        y: 100,
        rot: 45,
        radius: 200,
        size: 50
    },
    {
        type: 'LensCircular',
        id: 8,
        x: 650,
        y: 104,
        rot: 0,
        radius: 120,
        size: 70,
        n: 1.6,
        dispersion: false
    },
    {
        type: 'Absorber',
        id: 9,
        x: 808,
        y: 100,
        rot: 0,
        size: 100
    }
];

presets['Dispersion'] = [
    {
        type: 'Torch',
        id: 1,
        x: 95,
        y: 160,
        rot: -10,
        intensity: 0.6,
        wavelength: 780
    },
    {
        type: 'Torch',
        id: 2,
        x: 50,
        y: 168,
        rot: -10,
        intensity: 0.48,
        wavelength: 558
    },
    {
        type: 'Torch',
        id: 3,
        x: 150,
        y: 150,
        rot: -10,
        intensity: 0.39,
        wavelength: 474
    },
    {
        type: 'LensCircular',
        id: 4,
        x: 300,
        y: 150,
        rot: 0,
        radius: 120,
        size: 70,
        n: 1.4,
        dispersion: true
    },
    {
        type: 'MirrorCircular',
        id: 5,
        x: 725,
        y: 125,
        rot: -47,
        radius: 120,
        size: 70
    }
];

presets['Return Path'] = [
    {
        type: 'Torch',
        id: 1,
        x: 150,
        y: 150,
        rot: -10,
        intensity: 0.9,
        wavelength: 595
    },
    {
        type: 'MirrorCircular',
        id: 2,
        x: 300,
        y: 150,
        rot: 0.23,
        radius: 120,
        size: 70
    },
    {
        type: 'Mirror',
        id: 3,
        x: 154,
        y: 32,
        rot: 64,
        size: 111
    },
    {
        type: 'Mirror',
        id: 4,
        x: 88,
        y: 294,
        rot: -24,
        size: 200
    },
    {
        type: 'LensCircular',
        id: 5,
        x: 257,
        y: 472,
        rot: 61,
        radius: 120,
        size: 70,
        n: 1.4,
        dispersion: false
    },
    {
        type: 'Torch',
        id: 6,
        x: 426,
        y: 617,
        rot: -131,
        intensity: 0.9,
        wavelength: 536
    }
];

presets['Internal Reflection'] = [
    {
        type: 'Torch',
        id: 1,
        x: 150,
        y: 400,
        rot: -10,
        intensity: 1,
        wavelength: 479
    },
    {
        type: 'LensCircular',
        id: 2,
        x: 500,
        y: 400,
        rot: 0,
        radius: 200,
        size: 110,
        n: 3.6,
        dispersion: false
    },
    {
        type: 'Torch',
        id: 3,
        x: 416,
        y: 407,
        rot: 24,
        intensity: 0.9,
        wavelength: 595
    },
    {
        type: 'Absorber',
        id: 4,
        x: 659.8789202060972,
        y: 378.68061422612703,
        rot: 0,
        size: 100
    },
    {
        type: 'Absorber',
        id: 5,
        x: 350,
        y: 458,
        rot: 0,
        size: 45
    }
];

presets['Mirrors'] = [
    {
        type: 'Mirror',
        id: 1,
        x: 400,
        y: 150,
        rot: 90,
        size: 200
    },
    {
        type: 'Mirror',
        id: 2,
        x: 600,
        y: 150,
        rot: 90,
        size: 200
    },
    {
        type: 'Mirror',
        id: 3,
        x: 400,
        y: 250,
        rot: -90,
        size: 200
    },
    {
        type: 'Mirror',
        id: 4,
        x: 600,
        y: 250,
        rot: -90,
        size: 200
    },
    {
        type: 'Torch',
        id: 5,
        x: 266,
        y: 266,
        rot: -71,
        intensity: 0.9,
        wavelength: 595
    },
    {
        type: 'Absorber',
        id: 6,
        x: 700,
        y: 200,
        rot: 0,
        size: 108
    },
    {
        type: 'Torch',
        id: 87,
        x: 450,
        y: 400,
        rot: 0,
        intensity: 0.9,
        wavelength: 585
    },
    {
        type: 'Mirror',
        id: 8,
        x: 200,
        y: 400,
        rot: 0,
        size: 100
    },
    {
        type: 'Mirror',
        id: 9,
        x: 700,
        y: 400,
        rot: 0,
        size: 100
    }
];
