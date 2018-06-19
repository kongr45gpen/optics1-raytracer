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
        x: 395,
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
        rot: -10.02, // this slight difference in rotation accounts for differences in the incident angle
                     // since the torches are not placed directly behind one another
        intensity: 0.48,
        wavelength: 558
    },
    {
        type: 'Torch',
        id: 3,
        x: 150,
        y: 150,
        rot: -10.15,
        intensity: 0.39,
        wavelength: 485
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

presets['Mess'] = [
    {
        type: 'Torch',
        id: 1,
        x: 150,
        y: 150,
        rot: -10,
        intensity: 0.9,
        wavelength: 571.4355034466466
    },
    {
        type: 'MirrorCircular',
        id: 2,
        x: 284.94784556613695,
        y: 125.6021388441539,
        rot: -33,
        radius: 120,
        size: 40.58082898215268
    },
    {
        type: 'Mirror',
        id: 3,
        x: 59.989200782160864,
        y: 425.54699855612205,
        rot: -27.55733908483947,
        size: 84.69036717508918
    },
    {
        type: 'Torch',
        id: 4,
        x: 116.22886197815488,
        y: 134.9754157101529,
        rot: -3.7381884606537596,
        intensity: 0.9,
        wavelength: 531.7369190730037
    },
    {
        type: 'Torch',
        id: 5,
        x: 472.41338288611706,
        y: 150,
        rot: -180,
        intensity: 0.9,
        wavelength: 456.7507041450117
    },
    {
        type: 'Mirror',
        id: 6,
        x: 350.56078362813,
        y: 106.85558511215588,
        rot: 101,
        size: 25.14249061462491
    },
    {
        type: 'LensConcave',
        id: 7,
        x: 463.04010602011806,
        y: 406.800444824124,
        rot: 180,
        radius: 160,
        size: 49.40273662073999,
        n: 1.5510578875430903,
        dispersion: true
    },
    {
        type: 'Mirror',
        id: 8,
        x: 716.1185814020911,
        y: 275.57456870013795,
        rot: -55.346348146389474,
        size: 80
    },
    {
        type: 'Mirror',
        id: 9,
        x: 678.6254739380951,
        y: 388.053891092126,
        rot: -47.4066312716609,
        size: 33.96439825321222
    },
    {
        type: 'Mirror',
        id: 10,
        x: 716.1185814020911,
        y: 472.41338288611706,
        rot: -39.46691439693234,
        size: 20.731536795331266
    },
    {
        type: 'Torch',
        id: 11,
        x: 547.399597814109,
        y: 669.2521970720961,
        rot: -114.89422470685373,
        intensity: 0.9,
        wavelength: 769.9284253148608
    },
    {
        type: 'MirrorCircular',
        id: 12,
        x: 491.15993661811507,
        y: 284.94784556613695,
        rot: 24.050820600896202,
        radius: 35,
        size: 29.553444433918564
    },
    {
        type: 'LensCircular',
        id: 13,
        x: 706.7453045360921,
        y: 584.892705278105,
        rot: -138.71337533103943,
        radius: 120,
        size: 62.63559807862094,
        n: 1.2345719510087712,
        dispersion: true
    },
    {
        type: 'Mirror',
        id: 14,
        x: 753.6116888660872,
        y: 669.2521970720961,
        rot: 39.93025435035335,
        size: 185.5912338792443
    },
    {
        type: 'Torch',
        id: 15,
        x: 191.21507690614692,
        y: 622.385812742101,
        rot: 4.201528414074801,
        intensity: 0.9,
        wavelength: 595
    },
    {
        type: 'Mirror',
        id: 17,
        x: 556.7728746801081,
        y: 172.4685231741489,
        rot: -106.65,
        size: 38.375352072505855
    },
    {
        type: 'Torch',
        id: 18,
        x: 125.6021388441539,
        y: 69.36247764815987,
        rot: 38.75,
        intensity: 0.9,
        wavelength: 496.44928851865455
    },
    {
        type: 'Torch',
        id: 19,
        x: 631.7590896081001,
        y: 150,
        rot: 137.7,
        intensity: 0.9,
        wavelength: 483.21642706077364
    },
    {
        type: 'Absorber',
        id: 20,
        x: 60,
        y: 25,
        rot: 45,
        size: 40
    }
];
