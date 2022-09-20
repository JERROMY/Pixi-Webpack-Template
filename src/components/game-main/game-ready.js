import { Utils } from './utils'

import gsap from "gsap"
import CustomEase from 'gsap/CustomEase'

import * as PIXI from 'pixi.js'

export class GameReady extends PIXI.Container {
    constructor(screenID, resources, sizes, delegate){
        
        super()

        const self = this
        this.screenID = screenID
        this.resources = resources
        // console.log(this.resources);
        this.gW = sizes.gW
        this.gH = sizes.gH
        this.delegate = delegate

        this.readyTxt = new PIXI.BitmapText( "READY?", { fontName: 'GameFont2', fontSize: 90, align: 'center' })
        this.readyTxt.anchor.set(0.5)
        this.addChild(this.readyTxt)

        this.countNum = 3

        this.countTxt = new PIXI.BitmapText( "3", { fontName: 'GameFont3', fontSize: 120, align: 'center' })
        this.countTxt.anchor.set(0.5)
        this.addChild(this.countTxt)
        this.countTxt.position.y = this.countTxt.height + this.readyTxt.position.y + 5

        this.position.x = this.gW/2
        this.position.y = this.gH/2 - 100

        this.alpha = 0

        this.aniTIn
        this.aniTOut
        this.aniReady

        //this.startTransitionIn();

    }

    startTransitionIn(){
        this.countNum = 3
        this.readyTxt.text = "READY?"
        this.scale.set( 1 )
        this.alpha = 0
        this.visible = true
        this.countTxt.text = "3"
        this.countTxt.scale.set( 1 )
        this.aniTIn = gsap.to(this, {alpha: 1.0, ease: "circ.inout", onComplete: this.onTrasitionIn, onCompleteParams: [ this ]})
    }

    onTrasitionIn( pObj ){
        pObj.startCountReady();
    }

    startTransitionOut(){
        this.aniTOut = gsap.to(this.scale, {x: 0, y: 0, ease: "back.in(1.7)", delay:1.0, onComplete: this.onTrasitionOut, onCompleteParams: [ this ]})
    }

    onTrasitionOut( pObj ){

        if(pObj.aniTIn){
            pObj.aniTIn.kill()
        }

        if(pObj.aniReady){
            pObj.aniReady.kill()
        }

        if(pObj.aniTOut){
            pObj.aniTOut.kill()
        }


        pObj.visible = false
        pObj.delegate.onReadyCountFinish( pObj )
    }

    startCountReady(){
        this.countNum -= 1
        this.aniReady = gsap.to( this.countTxt.scale, {x: 0, y: 0, duration: 1.0, delay:0, repeatDelay: 0.4, onRepeat: this.onReadyCountStep, onRepeatParams: [ this ], ease: CustomEase.create("custom", "M0,0 C0.46,0.094 0.283,1 0.5,1 0.704,1 0.554,0.098 1,0 "), repeat: this.countNum, onUpdate: this.onReadyCountUpdate, onUpdateParams: [ this ], onComplete: this.onReadyCountStepFinish, onCompleteParams: [ this ] })
    }

    onReadyCountStep( pObj ){
        pObj.countNum -= 1
        

    }

    onReadyCountUpdate( pObj ){

        if( pObj.countTxt.scale.x <= 0.1 ){
            pObj.countTxt.text = pObj.countNum.toString()
        }

    }

    onReadyCountStepFinish( pObj){
        //pObj.aniReady = gsap.to( pObj.countTxt, {alpha:0, duration: 1.0, delay:0, ease:"cubic.easeinout"})
        pObj.readyTxt.text = "START"
        pObj.startTransitionOut()
    }
}