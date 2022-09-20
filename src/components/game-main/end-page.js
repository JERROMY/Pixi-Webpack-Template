import { Utils } from './utils'

import gsap from "gsap"
import CustomEase from 'gsap/CustomEase'

import * as PIXI from 'pixi.js'

export class EndPage extends PIXI.Container {
    constructor(screenID, resources, sizes, delegate){
        
        super()

        const self = this
        this.screenID = screenID
        this.resources = resources
        // console.log(this.resources);
        this.gW = sizes.gW
        this.gH = sizes.gH
        this.pageName = "EndPage"

        this.bottomBg = new PIXI.Graphics()
        this.bottomBg.beginFill(0xffffff)
        this.bottomBg.drawRect(-this.gW/2, -this.gH/2, this.gW, this.gH)
        this.addChild( this.bottomBg )
        this.bottomBg.interactive = true
        this.bottomBg.buttonMode = true
        this.bottomBg.on( 'pointerdown', this.onBgClick )

        this.bg = new PIXI.Sprite( this.resources["EndPage"].texture )
        this.bg.anchor.set( 0.5 )
        this.position.set( this.gW/2, this.gH/2 )
        this.bg.alpha = 0
        this.addChild(this.bg)

        this.logo = new PIXI.Sprite( this.resources["GameLogo"].texture )
        this.logo.anchor.set( 0.5 )
        this.logo.scale.set( 0.0 )
        this.logo.position.y -= 260
        this.addChild( this.logo )

        this.endScoreBg = new PIXI.Sprite( this.resources["EndScore"].texture )
        this.endScoreBg.anchor.set( 0.5 )
        this.endScoreBg.alpha = 0
        //this.logo.scale.set( 0.0 )
        this.endScoreBg.position.y -= 15
        this.addChild( this.endScoreBg )

        this.score = 0

        this.scoreTxt = new PIXI.BitmapText( "", { fontName: 'GameFont', fontSize: 73, align: 'center' })
        this.scoreTxt.tint = 0xFFFF00
        this.scoreTxt.anchor.set(0.5)
        this.scoreTxt.alpha = 0
        this.addChild(this.scoreTxt)

        this.rank = 1

        this.endRankTexArr = []
        this.endRank1Tex = this.resources["rank1"].texture
        this.endRank2Tex = this.resources["rank2"].texture
        this.endRank3Tex = this.resources["rank3"].texture
        this.endRank4Tex = this.resources["rank4"].texture

        this.endRankTexArr.push(this.endRank1Tex)
        this.endRankTexArr.push(this.endRank2Tex)
        this.endRankTexArr.push(this.endRank3Tex)
        this.endRankTexArr.push(this.endRank4Tex)


        this.rankSp = new PIXI.Sprite( this.resources["EndScore"].texture )
        this.rankSp.anchor.set( 0.5 )
        this.rankSp.alpha = 0
        //this.logo.scale.set( 0.0 )
        this.rankSp.position.y = 265
        this.addChild( this.rankSp )

        this.playerStr = `PLAYER ${ this.screenID }`

        this.playerTxt = new PIXI.BitmapText( this.playerStr, { fontName: 'GameFont', fontSize: 50, align: 'center' })
        this.playerTxt.tint = 0xFFFFFF
        this.playerTxt.anchor.set(0.5)
        this.playerTxt.position.y = this.gH/2 - this.playerTxt.height - 50
        this.addChild(this.playerTxt)


        this.maskG = new PIXI.Graphics()
        this.maskG.beginFill(0xFFFFFF)
        this.maskG.drawRect(-this.gW/2, -this.gH/2, this.gW, this.gH)
        this.maskG.endFill()

        this.addChild( this.maskG )
        this.mask = this.maskG


        this.aniScore
        this.aniTitle
        this.aniPage
        this.t1
        this.delegate = delegate

        this.setScore( this.score )
        this.setRank( this.rank )
        
        this.alpha = 0
        this.targetScore = 0
    
    }

    onBgClick(){
        console.log('bg click')
        this.parent.startPageTransitionOut()
    }

    setRank( rank ){
        const rankTex = this.endRankTexArr[ rank-1 ]
        this.rankSp.texture = rankTex
    }

    setScore( score ){
        this.scoreTxt.text = Utils.zeroPad( score, 6 ).toString()
    }

    setGameScore( score ){
        //this.score = score
        if(this.aniScore){
            this.aniScore.kill()
            this.aniScore = null
        }
        this.aniScore = gsap.to( this, { score: this.targetScore, duration: 0.8, delay: 0, ease: "cubic.in",onUpdate: this.onScoreUpdate, onUpdateParams: [ this ] , onComplete: this.onScoreAniFinish, onCompleteParams: [ this ]})

        
    }

    onScoreUpdate( pObj ){
        const scoreNum = Math.floor( pObj.score )
        pObj.scoreTxt.text = Utils.zeroPad( scoreNum, 6 ).toString()
    }

    onScoreAniFinish( pObj ){
        //pObj.startPageTransitionOut()
    }

    //Transition Ani

    startLogoAnimation(){
        this.aniTitle = gsap.to( this.logo.scale, { x: 1.1, y: 1.1, yoyo: true, repeat: -1, ease: "cube.easeinout", duration:0.6 } )
    }

    onLogoTransitionIn(){

   
        this.playerTxt.alpha = 0
        this.endScoreBg.alpha = 0
        this.scoreTxt.alpha = 0
        this.rankSp.alpha = 0
        
        this.bg.alpha = 0
        this.logo.scale.set( 0 )

        this.t1 = gsap.timeline( { onComplete: this.onTransitionInComplete, onCompleteParams: [ this ]} )
        this.t1.to(this, { alpha: 1, duration:0.6, ease: "cubic.in" })
                .to(this.bg, { alpha: 1, duration:0.6, ease: "cubic.in" })
               .to(this.logo.scale, { x: 1.0, y: 1.0, duration:0.8, ease: "back.out"}, "-=0.3")
               .to(this.endScoreBg, { alpha: 1.0, duration:0.8, ease: "cubic.out"}, "-=0.6")
               .to(this.scoreTxt, { alpha: 1.0, duration:0.8, ease: "cubic.out"}, "-=0.6")
               .to(this.rankSp, { alpha: 1.0, duration:0.8, ease: "cubic.out"}, "-=0.6")
               .to(this.playerTxt, { alpha: 1.0, duration:0.8, ease: "cubic.out"}, "-=0.1")

               
               
    }

    stopLoopAnimations(){
        if(this.aniTitle){
            this.aniTitle.kill()
            this.aniTitle = null
        }
        if(this.aniScore){
            this.aniScore.kill()
            this.aniScore = null
        }
    }

    onTransitionInComplete( pObj ){
        pObj.startLogoAnimation()
        pObj.setGameScore( pObj.score )
    }

    //Page

    startPageTransitionIn( score ){

        //gsap.globalTimeline.getChildren().forEach(t => t.kill());
        this.score = 0
        this.setScore( this.score )
        this.targetScore = score
        this.onLogoTransitionIn()
    }

    onPageTransitionIn(){

    }

    startPageTransitionOut(){

        this.stopLoopAnimations()
        this.aniPage = gsap.to( this, { alpha:0, onComplete:this.onPageTransitionOut, onCompleteParams: [ this ], ease: "cube.easeinout", duration:0.6 } )
    }

    onPageTransitionOut( pObj ){
        if(pObj.t1){
            pObj.t1.kill()
            pObj.t1 = null
        }

        pObj.delegate.onPageTransitionOut( pObj );
    }

}