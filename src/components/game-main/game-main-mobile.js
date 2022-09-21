import { Utils } from './utils'

import gsap from "gsap"
import CustomEase from 'gsap/CustomEase'

import { GameBall } from './game-ball'
import { GameSocket } from '../game-main/game-socket'
import { DeviceContol } from './device-control'

import * as PIXI from 'pixi.js'


export class GameMain extends PIXI.Container{

    constructor(screenID, resources, joinGameID){
        super()
        const self = this

        this.screenID = screenID
        this.resources = resources
        //console.log(this.resources)
        this.bg = new PIXI.Sprite( this.resources[ "GameMainBg" ].texture )
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

        this.ball = new GameBall( this.screenID, this.resources, this.sizes, null )
        this.addChild( this.ball )

        this.tempX = 0
        

        this.phase = "READY"

        this.socketDelegate = {
            onJoinGame: self.onJoinGame,
        }


        //Device Control

        this.deviceControlDelegate = {
            onGetAcc: self.onGetAcc,
            onGetOri: self.onGetOri,
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

        this.joinGameID = joinGameID

        this.gameSocket = new GameSocket( 1, this, this.socketDelegate, this.joinGameID )

        

    }

    onJoinGame( gameID, pObj ){

    }

    onGetAcc( xVal, yVal ){
        //console.log( xVal + " " + yVal )
    }

    onGetOri( r, xVal, yVal, parent ){


        const diffX = xVal - parent.tempX
        //console.log( diffX )
        //console.log( parent )

        parent.ball.update( diffX )

        parent.tempX = xVal

        //const 
        //console.log( r + " " + xVal + " " + yVal )
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