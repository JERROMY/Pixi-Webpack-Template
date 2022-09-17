
import { Utils } from './utils'

import gsap from "gsap"
import CustomEase from 'gsap/CustomEase'

import * as PIXI from 'pixi.js'
import { Char } from './char-main'
import { Ene } from './ene-main'


export class GameMain extends PIXI.Container{

    constructor(screenID, resources){
        super()

        const self = this

        this.screenID = screenID
        this.resources = resources
        console.log(this.resources)
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

        this.ball = new PIXI.Sprite( this.resources["Ball"].texture )
        this.ball.anchor.x = this.ball.anchor.y = 0.5
        
        this.ball.position.x = this.ball.width/2
        this.ball.position.y = this.ball.height/2
        this.ball.visible = false

        this.addChild( this.ball )

        //Mask
        this.maskGraphic = new PIXI.Graphics()
        this.maskGraphic.beginFill(0x00ff00)
        this.maskGraphic.drawRect(0, 0, this.gW, this.gH)
        this.maskGraphic.endFill()

        this.addChild( this.maskGraphic )
        this.mask = this.maskGraphic

        //Count Ready
        this.readyCountSec = 3
        this.readyCounterSp = new PIXI.Sprite( this.resources["Ball"].texture )
        this.addChild( this.readyCounterSp )
        this.readyCounterSp.anchor.x = this.readyCounterSp.anchor.y = 0.5
        this.readyCounterSp.position.x = this.gW / 2
        this.readyCounterSp.position.y = this.gH / 2
        this.readyCountTween
        this.readyCountStepTween
        //Count Ready

        //Count Second

        this.totalTime = 30;
        
        this.countingTxt = new PIXI.Text(this.totalTime.toString(), { fontFamily: 'Arial', fontSize: 90, fontWeight: 'bold', fill: '#000000', align: 'center', stroke: '#FFFFFF', strokeThickness: 3 })
        this.countingTxt.anchor.set(0.5)

        this.countingTxt.position.x = this.gW/2
        this.countingTxt.position.y = 0 + this.countingTxt.height/2 + 20
        this.addChild(this.countingTxt)

        

        this.phase = "READY"


        //Count Second

        
        //Char

        this.char = new Char( this.resources )
        this.char.scale.set( 0.5 )
        this.char.position.x = this.gW/2
        this.char.position.y = this.gH - this.char.height

        this.addChild( this.char )

        //Char


        //Score
        this.score = 0
        
        this.scoreTxt = new PIXI.Text(this.score.toString(), { fontFamily: 'Arial', fontSize: 140, fontWeight: 'bold', fill: '#000000', align: 'center', stroke: '#FFFFFF', strokeThickness: 3 })
        this.scoreTxt.anchor.set(0.5)

        this.scoreTxt.position.x = this.gW/2
        this.scoreTxt.position.y = this.countingTxt.position.y + this.scoreTxt.height/2 + 70
        this.addChild(this.scoreTxt)


        //Game End
        this.endGameSp = new PIXI.Sprite( this.resources["end"].texture );
        this.endGameSp.anchor.x = this.endGameSp.anchor.y = 0.5
        this.endGameSp.position.x = this.gW/2
        this.endGameSp.position.y = this.gH/2
        this.addChild(this.endGameSp)
        this.endGameSp.alpha = 0;
        

        console.log(`Game ${ this.screenID } Ready!`)


        //Drop Objs Map
        this.eneMap = new Map()
        this.eneTickCount = 0
        this.eneTickMax = 60

        this.eneDelegate = {
            onEneRemoved: self.onEneRemoved,
        }

        this.startPageDelegate = {
            onStartGameClick: self.onStartGameClick,
        }

        //Start Page
        this.startPage = new StartPage(this.screenID, this.resources, this.sizes, this.startPageDelegate)
        this.addChild( this.startPage )
    }

    initObj(){

        //this.ball.position.x = 0;
        //this.ball.position.y = 0;
    }

    initEvent(){
        this.interactive = true;
        this.on('pointermove', this.onPointMove)
    }

    offEvent(){
        this.off('pointermove', this.onPointMove)
    }

    onPointMove(e){
        //console.log(e);
        //console.log(e.global);

        const localPosi = new PIXI.Point()

        const globalPosi = e.data.global

        this.toLocal(globalPosi ,this.parent, localPosi)
        //console.log(`G: ${ localPosi.x } ${ localPosi.y }`);
        if(localPosi.x <= 0 || localPosi.x >= this.gW){
            return
        }
        this.char.position.x = localPosi.x
    }

    onQRCodeClick(){
        const pObj = this.parent
        //console.log(pObj);
        gsap.to( this, {alpha: 0, duration: 0.6, ease: "cubic.in", onComplete: pObj.onQRCodeFadeOut, onCompleteParams: [pObj]})
    }

    onQRCodeFadeOut(pObj){
        pObj.startCountReady()
    }

    onStartGameClick(){
        console.log( "Start Game Click" )
    }

    //Count Ready
    startCountReady(){
        this.readyCountTween = gsap.to( this.readyCounterSp.scale, {x: 0, y: 0, duration: 1.0, delay:0, repeatDelay: 0.4, onRepeat: this.onReadyCountStep, onRepeatParams: [ this.readyCounterSp, this ], ease: CustomEase.create("custom", "M0,0 C0.46,0.094 0.283,1 0.5,1 0.704,1 0.554,0.098 1,0 "), repeat: 4, onComplete: this.onReadyCountStepFinish, onCompleteParams: [ this ] })
    }

    onReadyCountStep(cObj, pObj){
        console.log(`${ pObj.screenID } Count Step!`)
    }

    onReadyCountStepFinish(pObj){
        this.readyCountStepTween = gsap.to( pObj.readyCounterSp.scale, {x: 0, y: 0, duration: 1.0, ease: "cubic.inout", delay:0.4, onComplete: pObj.onReadyCountFinish, onCompleteParams: [ pObj.readyCounterSp, pObj ]})
    }

    onReadyCountFinish(cObj, pObj){

        pObj.initEvent()
        gsap.killTweensOf(pObj.readyCountTween)
        gsap.killTweensOf(pObj.readyCountStepTween)
        pObj.readyCountTween = null
        pObj.readyCountStepTween = null
        console.log("Game Start")
        cObj.visible = false
        pObj.startGame()
    }
    //Count Ready

    startGame(){
        this.phase = "START"
    }

    endGame(){
        console.log("Game End !")
        this.offEvent()
        gsap.to( this.endGameSp, {alpha: 1, duration: 0.6, ease: "cubic.in", onComplete: this.onEndGameSpFadeOut, onCompleteParams: [this]})
    }

    onEndGameSpFadeOut(pObj){

    }

    updateGame(deltaTime){

        this.totalTime -= (deltaTime)
        let restTime = Math.round(this.totalTime)


        if( this.totalTime <= 0 ){
            this.totalTime = 0;
            restTime = 0;
            //console.log(restTime);
            this.phase = "END"

            this.endGame()
        
        }else{
            //console.log(restTime);
            this.genEne()
        }

        this.countingTxt.text = restTime.toString()
        



    }

    genEne(){
        this.eneTickCount += 1;
        if(this.eneTickCount >= this.eneTickMax){

            const dateTime = Date.now()
            const timestamp = Math.floor(dateTime).toString()
            //console.log( timestamp );
            this.eneTickCount = 0
            
            
            const ene = new Ene(timestamp, this.resources, this.eneDelegate)
            this.addChild(ene)
            ene.position.x = Math.random() * this.gW
            this.eneMap.set(timestamp, ene)
            //console.log( this.eneMap );
        }

        const eneCount = this.eneMap.size
        if(eneCount > 0){
            for (const [key, obj] of this.eneMap.entries()) {
                obj.update()

                
        

            }
        }
    }

    onEneRemoved( eneID, pObj, getType ){
        //console.log(` ${ eneID } Removed! `);
        //console.log( this );
        const eneObj = pObj.eneMap.get( eneID )

        pObj.removeChild( eneObj )
        pObj.eneMap.delete( eneID )

        if( getType == "get" ){
            pObj.score += 1
            pObj.scoreTxt.text = pObj.score.toString()
        }else{

        }
        
    }
    

    resizeGame(aW, aH){

        const percentScale = aH / this.gH
        //console.log(`Scale Percentage: ${ percentScale }`);
        this.height = aH
        this.width = this.gW * percentScale
        

    }



}


class StartPage extends PIXI.Container {
    constructor(screenID, resources, sizes, delegate){
        
        super()

        const self = this
        this.screenID = screenID
        this.resources = resources
        // console.log(this.resources);
        this.gW = sizes.gW
        this.gH = sizes.gH

        this.bottomBg = new PIXI.Graphics()
        this.bottomBg.beginFill(0xffffff)
        this.bottomBg.drawRect(-this.gW/2, -this.gH/2, this.gW, this.gH)
        this.addChild( this.bottomBg )
        this.bottomBg.interactive = true
        this.bottomBg.buttonMode = true
        this.bottomBg.on( 'pointerdown', this.onBgClick )

        //this.bottomBg.alpha = 0



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
        this.qrcodeSp;
        

        //Start Button
        this.startBtn = new PIXI.Sprite( this.resources["GameStartBtn"].texture )
        this.startBtn.anchor.set( 0.5 )
        this.startBtn.position.y = 190
        this.startBtn.ty = 190 + 220
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

        this.t1;
        this.t2;
        this.aniTitle;
        this.aniPlayerTxt;
        this.aniStartBtn;

        this.delegate = delegate;

        

    }

    onBgClick(){
        console.log('bg click')
        this.parent.startCreateQRCode()
    }

    startCreateQRCode(){
        const rndCode = Math.floor( ( Math.random() * 10000 ) ).toString()
        this.randomCode = rndCode
        Utils.createQRCode(this.randomCode, this)
    }

    setQRCodePosition( qrcodeSp ){


        this.qrcodeSp = qrcodeSp

        this.qrcodeSp.position.y = this.gH/2 - this.qrcodeSp.height/2 - 70
        this.qrcodeSp.visible = true
        this.qrcodeSp.interactive = true
        this.qrcodeSp.buttonMode = true
        this.qrcodeSp.alpha = 0;
        
        

        this.startTransitionIn()

    }

    onQRCodeClick(){
        const pObj = this.parent

        this.off( 'pointerdown' )
        pObj.startGameTransitionIn();

    }

    onQRCodeFadeOut(pObj){
        //pObj.startCountReady()
    }

    startTransitionIn(){

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
        this.startBtn.position.y = 190
        this.monsterSp.position.y = 0
        this.startBtn.alpha = 0
        this.startBtn.visible = false
        this.startBtn.off( 'pointerdown' )
        this.playerTxt.alpha = 0
        
        this.bg.alpha = 0
        this.logo.scale.set( 0 )
        this.monsterSp.alpha = 0

        this.t1 = gsap.timeline( { onComplete: this.onTransitionInComplete, onCompleteParams: [ this ]} )
        this.t1.to(this.bg, { alpha: 1, duration:0.6, ease: "cubic.in" })
               .to(this.logo.scale, { x: 0.25, y: 0.25, duration:0.8, ease: "back.out"}, "-=0.3")
               .to(this.monsterSp, { alpha: 1.0, duration:0.8, ease: "back.out"}, "-=0.6")
               .to(this.qrcodeSp, { alpha: 1.0, duration:0.8, ease: "back.out"}, "-=0.8")
               
               
    }

    onStartGameClick(){
        //console.log("Start Game Click");
        this.parent.delegate.onStartGameClick()
        //this.off( 'pointerdown' )
    }

    startGameTransitionIn(){

        this.startBtn.visible = true
        this.t2 = gsap.timeline( { onComplete: this.onStartGameTransitionInComplete, onCompleteParams: [ this ]} )
        this.t2.to(this.qrcodeSp, { alpha: 0, duration:0.8, ease: "Cubic.out"})
                .to(this.startBtn, { alpha: 1, duration:0.8, ease: "Cubic.out"}, "-=0.5")
                .to(this.startBtn, { y:this.startBtn.ty, duration:0.8, ease: "Cubic.out"}, "-=0.5")
                .to(this.monsterSp, { y:this.monsterSp.ty, duration:0.8, ease: "Cubic.out"}, "-=0.8")
                .to(this.playerTxt, { alpha: 1, duration:0.8, ease: "Cubic.out"}, "-=0.4")
        

    }

    startLogoAnimation(){
        this.aniTitle = gsap.to( this.logo.scale, { x: 0.26, y: 0.26, yoyo: true, repeat: -1, ease: "cube.easeinout", duration:0.6 } )
    }

    startPlayerTxtAnimation(){
        this.aniPlayerTxt = gsap.to( this.playerTxt, { alpha:0, yoyo: true, repeat: -1, ease: "cube.easeinout", duration:1.2 } )
        this.aniStartBtn = gsap.to( this.startBtn.scale, { x: 1.05, y: 1.05, yoyo: true, repeat: -1, ease: "cube.easeinout", duration:0.6 } )
    }

    onStartGameTransitionInComplete( pObj ){

        pObj.qrcodeSp.visible = false
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