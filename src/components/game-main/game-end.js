import { Utils } from './utils'

import gsap from "gsap"
import CustomEase from 'gsap/CustomEase'

import * as PIXI from 'pixi.js'

export class GameEnd extends PIXI.Container {
    constructor(screenID, resources, sizes, delegate){
        
        super()

        const self = this
        this.screenID = screenID
        this.resources = resources
        // console.log(this.resources);
        this.gW = sizes.gW
        this.gH = sizes.gH
        this.delegate = delegate

        this.endTxt = new PIXI.BitmapText( "TIME's UP", { fontName: 'GameFont2', fontSize: 80, align: 'center' })
        this.endTxt.anchor.set(0.5)
        this.addChild(this.endTxt)

        this.position.x = this.gW/2
        this.position.y = this.gH/2
        this.alpha = 0
        this.visible = false

        this.aniT1
        this.aniT2

    }

    showEnd(){
        this.visible = true
        this.alpha = 0

        if(this.aniT1){
            this.aniT1.kill()
            this.aniT1 = null
        }

        if(this.aniT2){
            this.aniT2.kill()
            this.aniT2 = null
        }


        this.aniT1 = gsap.to( this, {alpha: 1, duration: 0.6, delay: 1, ease: "cubic.in"})
        this.aniT2 = gsap.to( this, {alpha: 0, duration: 1.0, delay: 1.6, ease: "cubic.in", onComplete: this.onEndGameSpFadeOut, onCompleteParams: [this]})
    }

    onEndGameSpFadeOut( pObj ){
        pObj.delegate.onEndGameFadeOut( pObj )
    }

}