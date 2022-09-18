import { Utils } from './utils'

import gsap from "gsap"
import CustomEase from 'gsap/CustomEase'

import * as PIXI from 'pixi.js'

export class CircleUI extends PIXI.Container {

    constructor(resources, sizes, delegate){
        
        super()
        this.resources = resources

        this.c1 = 0xffdb00
        this.c2 = 0x565656

        this.gW = sizes.gW
        this.gH = sizes.gH

        this.cirSize = 210

        this.circ1 = new circle(this.cirSize ,Math.PI/2, this.c1)
        this.addChild( this.circ1 )

        this.circ3 = new circle(this.cirSize ,Math.PI/2, this.c2)
        this.addChild( this.circ3 )

        this.circ2 = new circle(this.cirSize ,-Math.PI/2, this.c1)
        this.addChild( this.circ2 )

        this.circ4 = new circle(this.cirSize ,-Math.PI/2, this.c2)
        this.addChild( this.circ4 )

        // this.circleMask = new PIXI.Sprite( this.resources["piMask"].texture )
        // this.circleMask.anchor.set( 0.5 )
        // this.circleMask.scale.set( 0.88 )
        // this.addChild( this.circleMask )
        // this.mask = this.circleMask


        this.rot = 0
        this.moveSeg = 1;

        
    }

    update(){
        //console.log( "update circ" )
        
        this.rot += this.moveSeg

        if(this.rot >= 360){
            this.rot = 0
            this.circ3.rotation = 0
            this.circ4.rotation = 0
        }

        if(this.rot > 180){
            
            this.circ4.rotation = Utils.degrees_to_radians( this.rot - 180 )
            
            this.setChildIndex(this.circ1, 3)
            this.setChildIndex(this.circ4, 2)
            this.setChildIndex(this.circ2, 1)
            this.setChildIndex(this.circ3, 0)
            
        }else{

            this.circ3.rotation = Utils.degrees_to_radians( this.rot )

            this.setChildIndex(this.circ4, 3)
            this.setChildIndex(this.circ3, 2)
            this.setChildIndex(this.circ2, 1)
            this.setChildIndex(this.circ1, 0)
            

        }
        
        //this.circ3.rotation += 0.001
    }

}

class circle extends PIXI.Container{
    constructor(r, rot, c){

        super()
        this.circ = new PIXI.Graphics()
        this.circ.beginFill(c)
        this.circ.arc(0, 0, r, Math.PI, 2 * Math.PI)
        this.circ.endFill()
        this.circ.rotation = rot
        this.addChild(this.circ)
    }
}