import { Instrument } from './instrument.js'
import { Ray } from './ray.js'
import { wlToRgb } from './lookup.js'

let torchImg = new Image();
torchImg.src = 'imgs/torch.svg';
// torchImg.addEventListener('load', draw, false);

export class Torch extends Instrument {
    constructor(x, y) {
        super(150, 150);
        this.affectsLight = false;

        this.rot = -10;

        this.intensity = 0.9;
        this.wavelength = 595;

        this.exportedProperties = [
            'x', 'y', 'rot', 'intensity', 'wavelength'
        ];
    }

    draw(ctx) {
        super.draw(ctx); // Call parent class function

        // ctx.fillRect(this.x - 25, this.y - 25, 50, 50);
        ctx.translate(this.x - 25 * Math.cos(this.rot / 180 * Math.PI), this.y - 25 * Math.sin(this.rot / 180 * Math.PI));
        ctx.rotate(this.rot * Math.PI / 180);
        ctx.drawImage(torchImg, -25, -25,50,50);
        ctx.setTransform(1, 0, 0, 1, 0, 0);
    }

    getRays() {
        return [
            new Ray(this.x, this.y, this.rot, this.intensity, this.wavelength)
        ];
    }
}
