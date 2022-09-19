import { Utils } from './utils'

import gsap from "gsap"
import CustomEase from 'gsap/CustomEase'

import * as PIXI from 'pixi.js'

export class GameBgMove extends PIXI.Container {
    constructor(screenID, resources, sizes, delegate){

        super()

        const self = this
        this.screenID = screenID
        this.resources = resources
        // console.log(this.resources);
        this.gW = sizes.gW
        this.gH = sizes.gH
        this.delegate = delegate

        this.roadsContainer = new PIXI.Container()
        this.addChild( this.roadsContainer )

        this.roadsAll = [];

        this.road1 = new Road( "road1", this.resources, sizes )
        this.roadsContainer.addChild( this.road1 )
        this.roadsAll.push( this.road1 )

        this.road2 = new Road( "road2", this.resources, sizes )
        this.roadsContainer.addChild( this.road2 )
        this.road2.position.x = this.road1.width - 24
        this.roadsAll.push( this.road2 )

        this.road3 = new Road( "road1", this.resources, sizes )
        this.roadsContainer.addChild( this.road3 )
        this.road3.position.x = this.road2.position.x + this.road2.width - 23
        this.roadsAll.push( this.road3 )

        this.roadsContainer.setChildIndex( this.road2, 0 )

        this.maskG = new PIXI.Graphics()
        this.maskG.beginFill(0xFFFFFF)
        this.maskG.drawRect(0, 250, this.gW, this.road1.roadH)
        this.maskG.endFill();

        this.roadsContainer.addChild( this.maskG )
        this.roadsContainer.mask = this.maskG

        this.monPosiArr = []

        this.mon1 = new PIXI.Sprite( this.resources[ "Mon1" ].texture ) 
        this.mon1.anchor.set( 0.5 )
        this.mon1.position.x = 92
        this.mon1.position.y = 210
        this.addChild( this.mon1 )

        this.mon2 = new PIXI.Sprite( this.resources[ "Mon2" ].texture ) 
        this.mon2.anchor.set( 0.5 )
        this.mon2.position.x = 242
        this.mon2.position.y = 213
        this.addChild( this.mon2 )

        this.mon3 = new PIXI.Sprite( this.resources[ "Mon3" ].texture ) 
        this.mon3.anchor.set( 0.5 )
        this.mon3.position.x = 392
        this.mon3.position.y = 220
        this.addChild( this.mon3 )

        this.monPosiArr.push( this.mon1 )
        this.monPosiArr.push( this.mon2 )
        this.monPosiArr.push( this.mon3 )

    }

    update( vy ){
        let roadCount = this.roadsAll.length;
        for( let i = 0 ; i < roadCount ; i++  ){
            const road = this.roadsAll[i]
            road.update( vy )
        }
    }
}


class Road extends PIXI.Container {

    constructor( roadName, resources, sizes ){
        
        super()
        this.resources = resources
        this.cullable = false
        this.roadsAll = []

        this.gW = sizes.gW
        this.gH = sizes.gH
        this.vy = 0.5

        this.roadsContainer = new PIXI.Container()
        this.addChild( this.roadsContainer )
        
        this.roadW = 0
        this.roadH = 0

        for(let i = 0 ; i < 3 ; i++){
            
            const road = new PIXI.Sprite( this.resources[ roadName ].texture )
            if( i == 0 ){
                this.roadW = road.width
                this.roadH = road.height
            }
            this.roadsContainer.addChild( road )
            road.position.y = ( i * road.height ) - road.height
            this.roadsAll.push(road )
        }

        this.maskG = new PIXI.Graphics()
        this.maskG.beginFill(0xFFFFFF)
        this.maskG.drawRect(0, 0, this.roadW, sizes.gH)
        this.maskG.endFill();

        this.addChild( this.maskG )
        this.mask = this.maskG


        
    }

    update( vy ){
        //console.log("Update Road");
        
        if( this.roadsContainer.position.y >= this.roadH){
            this.roadsContainer.position.y = 0
        }

        this.roadsContainer.position.y += vy
    }


}