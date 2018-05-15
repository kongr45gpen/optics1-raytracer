console.log("'ello");

import dat from 'dat.gui';

class Config {
    constructor() {
        this.torchX = 100;
        this.torchY = 100;
        this.torchRot = 0;

        this.mirrorX = 300;
        this.mirrorY = 100;
        this.mirrorRot = 45;
    }
}
let conf = new Config();
window.conf = conf;

let canvas = document.getElementById('app');
let ctx = canvas.getContext('2d');

const draw = function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'rgb(200, 0, 0)';
    // ctx.fillRect(conf.torchX - 25, conf.torchY - 25, 50, 50);
    ctx.translate(conf.torchX, conf.torchY);
    ctx.rotate(conf.torchRot * Math.PI / 180);
    ctx.drawImage(torchImg, -25, -25,50,50);
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    // Create gradient
    let gradient = ctx.createLinearGradient(0.000, 0.000, 15.000, 15.000);

    // Add colors
    gradient.addColorStop(0.000, 'rgba(191, 191, 191, 1.000)');
    gradient.addColorStop(0.274, 'rgba(178, 178, 178, 1.000)');
    gradient.addColorStop(0.652, 'rgba(142, 142, 142, 1.000)');
    gradient.addColorStop(1.000, 'rgba(219, 219, 219, 1.000)');
    ctx.fillStyle = gradient;
    ctx.translate(conf.mirrorX, conf.mirrorY);
    ctx.rotate(conf.mirrorRot * Math.PI / 180);
    ctx.fillRect(- 5, - 25, 10, 50);
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    // Mathematical representation of mirror
    let mAng =  (90 - conf.mirrorRot) * Math.PI / 180;
    let mPoints = [
        [conf.mirrorX + 25 * Math.cos(mAng) - 5 * Math.sin(mAng), conf.mirrorY - 25 * Math.sin(mAng) - 5 * Math.cos(mAng)],
        [conf.mirrorX + 25 * Math.cos(mAng) + 5 * Math.sin(mAng), conf.mirrorY - 25 * Math.sin(mAng) + 5 * Math.cos(mAng)],
        [conf.mirrorX - 25 * Math.cos(mAng) - 5 * Math.sin(mAng), conf.mirrorY + 25 * Math.sin(mAng) - 5 * Math.cos(mAng)],
        [conf.mirrorX - 25 * Math.cos(mAng) + 5 * Math.sin(mAng), conf.mirrorY + 25 * Math.sin(mAng) + 5 * Math.cos(mAng)],
    ];
    let mLines = [
        Math.atan((mPoints[2][1] - mPoints[0][1])/(mPoints[2][0] - mPoints[0][0])),
        Math.atan((mPoints[3][1] - mPoints[1][1])/(mPoints[3][0] - mPoints[1][0]))  ];

    // Draw mirror edges
    let edger = 300;
    ctx.strokeStyle = 'rgb(10,110,40)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(mPoints[0][0] + edger * Math.cos(mLines[0]), mPoints[0][1] + edger * Math.sin(mLines[0]));
    ctx.lineTo(mPoints[2][0] - edger * Math.cos(mLines[0]), mPoints[2][1] - edger * Math.sin(mLines[0]));
    ctx.stroke();
    // ctx.beginPath();
    // ctx.moveTo(mPoints[1][0] + edger * Math.cos(mLines[0]), mPoints[1][1] + edger * Math.sin(mLines[1]));
    // ctx.lineTo(mPoints[3][0] - edger * Math.cos(mLines[0]), mPoints[3][1] - edger * Math.sin(mLines[1]));
    // ctx.stroke();
    ctx.setLineDash([]);

    // ctx.fillStyle = 'rgb(200, 0, 0)';
    // mPoints.forEach(function(mPoint) {
    //     ctx.beginPath();
    //     ctx.arc(mPoint[0], mPoint[1], 2, 0, 2 * Math.PI);
    //     ctx.fill();
    // });

    // Raytracing
    const r = 300;
    let ang = conf.torchRot * Math.PI / 180;
    let a = [conf.torchX + 25 * Math.cos(ang), conf.torchY + 25 * Math.sin(ang) ];
    let b = [ a[0] + r * Math.cos(ang), a[1] + r * Math.sin(ang) ];

    // Find intersection point
    let intersectionExists;
    let intersection = [];
    let slopTor = -Math.tan(ang);
    let slopMir = Math.tan(mAng);
    if (slopTor === slopMir || (isNaN(slopTor) && isNaN(slopMir))) {
        intersectionExists = false;
    } else {
        if (isNaN(slopTor) || Math.abs(slopTor) > 100000) {
            intersection = [ a[0], (mPoints[0][1] + slopMir * (a[0] - mPoints[0][0])) ];
        } else if (isNaN(slopMir) || Math.abs(slopMir) > 100000) {
            intersection = [ mPoints[0][0], - (-a[1] + slopTor * (mPoints[0][0] - a[0])) ];
        } else {
            intersection[0] = (-mPoints[0][1] + a[1] + slopTor * a[0] - slopMir * mPoints[0][0]) / (slopTor - slopMir);
            intersection[1] = - (slopTor * (intersection[0] - a[0]) - a[1]);
        }

        intersectionExists = true;

        if ((intersection[0] > mPoints[0][0] + 0.1 || intersection[0] < mPoints[2][0] - 0.1) && (intersection[0] < mPoints[0][0] - 0.1 || intersection[0] > mPoints[2][0] + 0.1)) {
            intersectionExists = false;
        }
    }

    if (intersectionExists) {
        b = intersection;
    }

    ctx.strokeStyle = 'rgb(255,70,20)';
    ctx.lineWidth = 5;
    ctx.lineJoin = 'round';
    ctx.beginPath();


    if (intersectionExists) {
        const ir = 300;
        let incidence = -mAng + -ang + Math.PI/2;
        let interAngle = (ang + 2 * incidence);

        let factorX = (incidence > Math.PI/4) ? -1 : -1;
        let factorY = (incidence > Math.PI/4) ? -1 : -1;

        ctx.moveTo(a[0], a[1]);
        ctx.lineTo(b[0], b[1]);
        b = [ intersection[0] + factorX * ir * Math.cos(interAngle), intersection[1] + factorY * ir * Math.sin(interAngle)];
        ctx.lineTo(b[0], b[1]);
        ctx.stroke();
    } else {
        ctx.moveTo(a[0], a[1]);
        ctx.lineTo(b[0], b[1]);
        ctx.stroke();
    }

    // if (intersectionExists) {
    //     ctx.fillStyle = 'rgba(10, 100, 200, 0.4)';
    //     ctx.beginPath();
    //     ctx.arc(intersection[0], intersection[1], 3, 0, 2 * Math.PI);
    //     ctx.fill();
    // }
};

let torchImg = new Image();
torchImg.src = 'imgs/torch.svg';
torchImg.addEventListener('load', draw, false);

const gui = new dat.GUI();
gui.add(conf, 'torchX', 0, 300).onChange(draw);
gui.add(conf, 'torchY', 0, 300).onChange(draw);
gui.add(conf, 'torchRot', -180, 180).onChange(draw);
gui.add(conf, 'mirrorX', 0, 500).onChange(draw);
gui.add(conf, 'mirrorY', 0, 500).onChange(draw);
gui.add(conf, 'mirrorRot', -180, 180).onChange(draw);
gui.remember(conf);

