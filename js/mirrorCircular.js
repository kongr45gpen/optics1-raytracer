import {InstrumentBiconvex} from './instrumentBiconvex.js'

export class MirrorCircular extends InstrumentBiconvex {
    constructor() {
        super();
        this.isMirror = true;
    }

    newAngle(incident) {
        return Math.PI / 2.0 - incident;
    }
}
