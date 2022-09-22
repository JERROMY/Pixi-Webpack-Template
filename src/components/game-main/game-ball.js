import { Utils } from './utils'

import gsap from "gsap"
import CustomEase from 'gsap/CustomEase'

import * as PIXI from 'pixi.js'

export class GameBall extends PIXI.Container {
    constructor(screenID, resources, sizes, delegate){
        
        super()

        const self = this
        this.screenID = screenID
        this.resources = resources
        // console.log(this.resources);
        this.gW = sizes.gW
        this.gH = sizes.gH
        this.delegate = delegate

        this.ball = new PIXI.Sprite( this.resources[ "Char1" ].texture )
        this.ball.anchor.set( 0.5 )
        this.addChild( this.ball )

        this.position.x = this.gW/2
        this.position.y = this.gH - this.ball.height

        this.cacheAsBitmap = true
        this.vx = 0
        this.f = 0.9


    }

    update( diffX ){
        this.vx += diffX
        this.position.x += this.vx


        if( this.position.x <= 0 ){
            this.position.x = 0
        }

        if( this.position.x >= this.gW){
            this.position.x = this.gW
        }



        this.vx *= this.f
    }

    

}