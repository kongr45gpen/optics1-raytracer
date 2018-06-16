import { Instrument } from './instrument.js'
import { wlToRgb } from './lookup.js'

let torchImg = new Image();
torchImg.src = 'imgs/torch.svg';
// torchImg.addEventListener('load', draw, false);

export class Torch extends Instrument {
    constructor(x, y) {
        super(150, 150); // call the super class constructor and pass in the name parameter

        this.intensity = 1.0;
        this.wavelength = 595;

        this.exportedProperties = [
            'x', 'y', 'rot', 'intensity', 'wavelength'
        ];
    }

    draw(ctx) {
        ctx.fillStyle = 'rgb(' + 200 * this.intensity + ', 0, 0)';

        let lutValues = wlToRgb[parseInt(this.wavelength) - 380];
        ctx.fillStyle = 'rgb(' + lutValues[0] * this.intensity + ',' + lutValues[1] * this.intensity + ',' + lutValues[2] * this.intensity;
        console.log(lutValues);


        ctx.fillRect(this.x - 25, this.y - 25, 50, 50);
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rot * Math.PI / 180);
        ctx.drawImage(torchImg, -25, -25,50,50);
        ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
}
