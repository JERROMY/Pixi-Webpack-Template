import { Utils } from './utils'

import gsap from "gsap"
import CustomEase from 'gsap/CustomEase'

import * as PIXI from 'pixi.js'


export class StartPage extends PIXI.Container {
    constructor(screenID, resources, sizes, delegate){
        
        super()

        const self = this
        this.screenID = screenID
        this.resources = resources
        // console.log(this.resources);
        this.gW = sizes.gW
        this.gH = sizes.gH
        this.pageName = "StartPage"

        this.bottomBg = new PIXI.Graphics()
        this.bottomBg.beginFill(0xffffff)
        this.bottomBg.drawRect(-this.gW/2, -this.gH/2, this.gW, this.gH)
        this.addChild( this.bottomBg )
        this.bottomBg.interactive = true
        this.bottomBg.buttonMode = true
        this.bottomBg.on( 'pointerdown', this.onBgClick )

        this.bg = new PIXI.Sprite( this.resources["StartPageBg"].texture )
        this.bg.anchor.set( 0.5 )
        this.position.set( this.gW/2, this.gH/2 )
        this.bg.alpha = 0;
        this.addChild(this.bg)

        this.logo = new PIXI.Sprite( this.resources["GameLogo"].texture )
        this.logo.anchor.set( 0.5 )
        this.logo.scale.set( 0.0 )
        this.logo.position.y -= 260
        this.addChild( this.logo )

        this.monsterSp = new PIXI.Sprite( this.resources["StartPageMonster"].texture )
        this.monsterSp.anchor.set( 0.5 )
        this.monsterSp.position.y = 0
        this.monsterSp.ty = 220
        this.monsterSp.alpha = 0;
        this.monsterSp.position.x -= 11
        this.monsterSp.scale.set( 0.9 )
        this.addChild( this.monsterSp )

        //QRCode
        this.randomCode = "1234";
        this.hostName = location.href
        //this.qrCodeURL = this.hostName + "m/" + "?rndCode="
        this.qrCodeURL = this.hostName + "index-mobile.html" + "?rndCode="
        
        this.qrcodeSp;
        

        //Start Button
        this.startBtn = new PIXI.Sprite( this.resources["GameStartBtn"].texture )
        this.startBtn.anchor.set( 0.5 )
        this.startBtn.position.y = 185
        this.startBtn.ty = 185 + 220
        this.startBtn.alpha = 0
        this.startBtn.visible = false
        this.startBtn.interactive = true
        this.startBtn.buttonMode = true
        this.addChild( this.startBtn )

        this.playerTxt = new PIXI.BitmapText('PLAYER 1', { fontName: 'GameFont', fontSize: 55, align: 'center' })
        this.playerTxt.anchor.set( 0.5 )
        this.playerTxt.position.y -= 110
        this.playerTxt.tint = 0xFFFF00
        this.playerTxt.alpha = 0
        this.playerTxt.text = `PLAYER ${ this.screenID }`
        this.addChild( this.playerTxt )


        this.aniPage

        this.t1
        this.t2
        this.aniTitle
        this.aniPlayerTxt
        this.aniStartBtn

        this.alpha = 0

        this.delegate = delegate

        

    }

    //Page

    startPageTransitionIn( listNum ){
        //this.onLogoTransitionIn()
        //gsap.globalTimeline.getChildren().forEach(t => t.kill());
        this.playerTxt.text = `PLAYER ${  ( parseInt( listNum ) ) }`
        this.randomCode = this.qrCodeURL + this.randomCode
        //console.log( this.randomCode  )
        this.startCreateQRCode()
    }

    onPageTransitionIn(){

    }

    startPageTransitionOut(){

        this.stopLoopAnimations()
        this.aniPage = gsap.to( this, { alpha:0, onComplete:this.onPageTransitionOut, onCompleteParams: [ this ], ease: "cube.easeinout", duration:0.6 } )
    }

    onPageTransitionOut( pObj ){
        pObj.delegate.onPageTransitionOut( pObj );
    }

    stopLoopAnimations(){

        if(this.t1){
            this.t1.kill()
            this.t1 = null
        }

        if(this.t2){
            this.t2.kill()
            this.t2 = null
        }

        if(this.aniTitle){
            this.aniTitle.kill()
            this.aniTitle = null
        }

        if(this.aniPlayerTxt){
            this.aniPlayerTxt.kill()
            this.aniPlayerTxt = null
        }

        if(this.aniStartBtn){
            this.aniStartBtn.kill()
            this.aniStartBtn = null
        }
    }

    //Page

    onBgClick(){
        console.log('bg click')
        this.parent.startCreateQRCode()
    }

    startCreateQRCode(){
        //const rndCode = Math.floor( ( Math.random() * 10000 ) ).toString()
        //this.randomCode = rndCode
        Utils.createQRCode(this.randomCode, this)
    }

    setQRCodePosition( qrcodeSp ){


        this.qrcodeSp = qrcodeSp

        this.qrcodeSp.position.y = this.gH/2 - this.qrcodeSp.height/2 - 70
        this.qrcodeSp.visible = true
        this.qrcodeSp.interactive = true
        this.qrcodeSp.buttonMode = true
        this.qrcodeSp.alpha = 0;

        this.onLogoTransitionIn()

    }

    onQRCodeClick(){
        const pObj = this.parent
        console.log( pObj.randomCode )
        this.off( 'pointerdown' )
        Utils.redirect_blank( pObj.randomCode )
        //window.location.href = this.randomCode
        //pObj.onStartButtonTransitionIn();

    }

    onLogoTransitionIn(){

        if(this.aniTitle){
            this.aniTitle.kill()
            this.aniTitle = null
        }

        if(this.aniPlayerTxt){
            this.aniPlayerTxt.kill()
            this.aniPlayerTxt = null
        }

        if(this.aniStartBtn){
            this.aniStartBtn.kill()
            this.aniStartBtn = null
        }
        
        this.qrcodeSp.visible = true
        this.startBtn.position.y = 185
        this.monsterSp.position.y = 0
        this.startBtn.alpha = 0
        this.startBtn.visible = false
        this.startBtn.off( 'pointerdown' )
        this.playerTxt.alpha = 0
        
        this.bg.alpha = 0
        this.logo.scale.set( 0 )
        this.monsterSp.alpha = 0

        this.t1 = gsap.timeline( { onComplete: this.onTransitionInComplete, onCompleteParams: [ this ]} )
        this.t1.to(this, { alpha: 1, duration:0.6, ease: "cubic.in" })
                .to(this.bg, { alpha: 1, duration:0.6, ease: "cubic.in" })
               .to(this.logo.scale, { x: 1.0, y: 1.0, duration:0.8, ease: "back.out"}, "-=0.3")
               .to(this.monsterSp, { alpha: 1.0, duration:0.8, ease: "back.out"}, "-=0.6")
               .to(this.qrcodeSp, { alpha: 1.0, duration:0.8, ease: "back.out"}, "-=0.8")
               
               
    }

    onStartGameClick(){
        this.parent.startPageTransitionOut();
    }
    
    startGame(){
        this.startPageTransitionOut();
    }

    onStartButtonTransitionIn(){

        this.startBtn.visible = true
        this.t2 = gsap.timeline( { onComplete: this.onStartGameTransitionInComplete, onCompleteParams: [ this ]} )
        this.t2.to(this.qrcodeSp, { alpha: 0, duration:0.8, ease: "Cubic.out"})
                .to(this.startBtn, { alpha: 1, duration:0.8, ease: "Cubic.out"}, "-=0.5")
                .to(this.startBtn, { y:this.startBtn.ty, duration:0.8, ease: "Cubic.out"}, "-=0.5")
                .to(this.monsterSp, { y:this.monsterSp.ty, duration:0.8, ease: "Cubic.out"}, "-=0.8")
                .to(this.playerTxt, { alpha: 1, duration:0.8, ease: "Cubic.out"}, "-=0.4")
        

    }

    startLogoAnimation(){
        this.aniTitle = gsap.to( this.logo.scale, { x: 1.1, y: 1.1, yoyo: true, repeat: -1, ease: "cube.easeinout", duration:0.6 } )
    }

    startPlayerTxtAnimation(){
        this.aniPlayerTxt = gsap.to( this.playerTxt, { alpha:0, yoyo: true, repeat: -1, ease: "cube.easeinout", duration:1.2 } )
        this.aniStartBtn = gsap.to( this.startBtn.scale, { x: 1.05, y: 1.05, yoyo: true, repeat: -1, ease: "cube.easeinout", duration:0.6 } )
    }

    onStartGameTransitionInComplete( pObj ){

        pObj.qrcodeSp.visible = false
        pObj.parent.phase = "READY"
        pObj.initStartBtnEvent()
        pObj.startPlayerTxtAnimation()
    }

    onTransitionInComplete( pObj ){
        pObj.startLogoAnimation()
        pObj.initQRCodeEvent()
    }

    initStartBtnEvent(){
        this.startBtn.on( 'pointerdown', this.onStartGameClick )
    }

    initQRCodeEvent(){
        this.qrcodeSp.on( 'pointerdown', this.onQRCodeClick )
    }
}