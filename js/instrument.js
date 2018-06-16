let globalId = 1;


export class Instrument {
    constructor(x, y) {
        this.id = (globalId++);

        this.x = x;
        this.y = y;
        this.rot = 0;
    }

    draw(ctx) {
        ctx.fillStyle = 'rgb(200, 0, 0)';
        ctx.fillRect(this.x - 25, this.y - 25, 50, 50);
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rot * Math.PI / 180);
        // ctx.drawImage(torchImg, -25, -25,50,50);
        ctx.setTransform(1, 0, 0, 1, 0, 0);
    }

    // onLoad
}
