import * as PIXI from 'pixi.js'





export class GameMain extends PIXI.Container{

    constructor( resources ){
        super()

        //console.log( 'Game Main' )
        this.resources = resources
        this.bg = new PIXI.Sprite( this.resources[ 'TestBg' ].texture )
        
        console.log( `Bg W: ${ this.bg.width } H: ${ this.bg.height }` )
        this.w = this.bg.width
        this.h = this.bg.height
        this.sizes = {
            'w': this.w,
            'h': this.h
        }


        this.addChild( this.bg )

    }

    initObj(  ){

    }

    resizeGame( w, h ){

        console.log( this.w + ' ' + this.h )
        console.log( w + ' ' + h )

        const percentScale = h / this.h
        this.height = h
        this.width = this.w * percentScale


    }




}