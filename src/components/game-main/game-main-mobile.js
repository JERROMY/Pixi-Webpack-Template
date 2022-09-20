import { Utils } from './utils'

import gsap from "gsap"
import CustomEase from 'gsap/CustomEase'
import { DeviceContol } from './device-control'

import * as PIXI from 'pixi.js'


export class GameMain extends PIXI.Container{

    constructor(screenID, resources){
        super()
        const self = this

        this.screenID = screenID
        this.resources = resources
        //console.log(this.resources)
        this.bg = new PIXI.Sprite( this.resources["GameMainBg"].texture )
        //this.mask = new PIXI.Sprite( this.resources["testBg"].texture );
        this.bg.alpha = 0.5
        this.gW = this.bg.width
        this.gH = this.bg.height
        this.sizes = {
            "gW": this.gW,
            "gH": this.gH,
        }
        //console.log(`G W: ${ this.gW } G H: ${ this.gH }`);
        this.addChild( this.bg )

        this.phase = "READY"


        //Device Control

        this.deviceControlDelegate = {
            onGetAcc: self.onGetAcc,
        }

        this.deviceControl = new DeviceContol( this.screenID, this.resources, this.sizes, this.deviceControlDelegate )
        this.addChild(  this.deviceControl )

        //Device Control


        //Mask
        this.maskGraphic = new PIXI.Graphics()
        this.maskGraphic.beginFill(0xffffff)
        this.maskGraphic.drawRect(0, 0, this.gW, this.gH)
        this.maskGraphic.endFill()

        this.addChild( this.maskGraphic )
        this.mask = this.maskGraphic
        
        console.log(`Game ${ this.screenID } Mobile Ready!`)

        

    }

    onGetAcc( xVal, yVal ){
        console.log( xVal + " " + yVal )
    }

    updateGame(deltaTime){

    }

    initObj(){

        //this.ball.position.x = 0;
        //this.ball.position.y = 0;
    }

    resizeGame(aW, aH){

        const percentScale = aH / this.gH
        //console.log(`Scale Percentage: ${ percentScale }`);
        this.height = aH
        this.width = this.gW * percentScale
        

    }


}