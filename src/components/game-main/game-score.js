import { Utils } from './utils'

import gsap from "gsap"
import CustomEase from 'gsap/CustomEase'

import * as PIXI from 'pixi.js'
import { CircleUI } from './circle-ui'

export class GameScore extends PIXI.Container {
    constructor(screenID, resources, sizes, delegate){
        
        super()
        this.screenID = screenID
        this.resources = resources

        this.gW = sizes.gW
        this.gH = sizes.gH

        this.scoreMask = new PIXI.Sprite( this.resources["GameScoreMask"].texture )
        this.scoreMask.anchor.set( 0.5 )
        this.scoreMask.alpha = 1

        this.scoreBg = new PIXI.Sprite( this.resources["GameScore"].texture )
        this.scoreBg.anchor.set( 0.5 )
        this.scoreBg.alpha = 1

        this.bottomBg = new PIXI.Graphics()
        this.bottomBg.beginFill(0x565656)
        this.bottomBg.drawRect(-this.scoreBg.width/2, -this.scoreBg.height/2, this.scoreBg.width, this.scoreBg.height)
        this.addChild( this.bottomBg )

        this.circleUI = new CircleUI( this.resources, sizes, delegate )
        this.addChild( this.circleUI )
        this.circleUI.scale.y = 0.17
        this.circleUI.scale.x = 1.1 
        //this.circleUI.position.y = 100

        this.addChild(this.scoreBg)

        this.score = 0

        this.scoreTxt = new PIXI.BitmapText( Utils.zeroPad( this.score, 4 ), { fontName: 'GameFont', fontSize: 25, align: 'center' })
        this.scoreTxt.tint = 0xFFDB00
        this.scoreTxt.anchor.set(0.5)
        this.addChild(this.scoreTxt)

        this.addChild( this.scoreMask )
        this.mask = this.scoreMask

        

        //arc.lineStyle(5, 0xAA00BB, 1);

        

        this.position.x = this.gW/2
        this.position.y = this.scoreBg.height/2 + 20

        

        this.delegate = delegate

    }

    setGameScore( score ){
        this.score = score
        this.scoreTxt.text = Utils.zeroPad( this.score, 4 )
    }

    


}