import * as PIXI from 'pixi.js'

export class Char extends PIXI.Container{


    constructor(resources){
        super();

        this.resources = resources;
        this.charSp = new PIXI.Sprite( this.resources["char"].texture );
        this.charSp.anchor.set(0.5);
        this.addChild(this.charSp);

    }


}