
import { Utils } from './utils'

import gsap from "gsap"
import CustomEase from 'gsap/CustomEase'

import * as PIXI from 'pixi.js'
import { StartPage } from './start-page'
import { GameScore } from './game-score'
import { GameReady } from './game-ready'
import { GameEnd } from './game-end'
import { GameBgMove } from './game-bg-move'
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

        //Delegate

        this.eneDelegate = {
            onEneRemoved: self.onEneRemoved,
        }

        this.pageDelegate = {
            onPageTransitionIn: self.onPageTransitionIn,
            onPageTransitionOut: self.onPageTransitionOut,
        }

        this.gameReadyDelegate = {
            onReadyCountFinish: self.onReadyCountFinish,
        }

        this.gameEndDelegate = {
            onEndGameFadeOut: self.onEndGameFadeOut,
        }
        //Delegate

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


        //Count Second
        this.totalTime = 30
        
        this.countingTxt = new PIXI.Text(this.totalTime.toString(), { fontFamily: 'Arial', fontSize: 10, fontWeight: 'bold', fill: '#000000', align: 'center', stroke: '#FFFFFF', strokeThickness: 3 })
        this.countingTxt.anchor.set(0.5)

        this.countingTxt.position.x = this.gW - this.countingTxt.width - 10
        this.countingTxt.position.y = 0 + this.countingTxt.height/2 + 10
        this.addChild(this.countingTxt)

        

        this.phase = "READY"
        //Count Second

        this.gameBgMove = new GameBgMove( this.screenID, this.resources, this.sizes, null )
        this.addChild( this.gameBgMove )

        
        //Char

        this.char = new Char( this.resources )
        //this.char.scale.set( 0.5 )
        this.char.position.x = this.gW/2
        this.char.position.y = this.gH - this.char.height/2 - 40

        this.addChild( this.char )

        //Char


        //Score

        

        this.score = 0
        this.gameScore = new GameScore(this.screenID, this.resources, this.sizes, null)
        this.addChild( this.gameScore )

        //Count Ready
        this.gameReady = new GameReady( this.screenID, this.resources, this.sizes, this.gameReadyDelegate)
        this.addChild( this.gameReady )
        //Count Ready


        //Game End
       this.gameEnd = new GameEnd( this.screenID, this.resources, this.sizes, this.gameEndDelegate )
       this.addChild( this.gameEnd )
        

        console.log(`Game ${ this.screenID } Ready!`)


        //Drop Objs Map
        this.eneMap = new Map()
        this.eneTickCount = 0
        this.eneTickMax = 60

        this.isFever = false
        this.isReward = false
        

        //Start Page
        //this.startPage = new StartPage(this.screenID, this.resources, this.sizes, this.pageDelegate)
        //this.addChild( this.startPage )
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

    onQRCodeFadeOut( pObj ){
        pObj.startCountReady()
    }

    onPageTransitionIn( page ){
        console.log( `Page Name: ${ page.pageName }` )
    }

    onPageTransitionOut( page ){
        console.log( `Page Name: ${ page.pageName }` )
        // console.log( this )
        const pObj = page.parent
        pObj.removeChild( page )
        switch ( page.pageName ) {
            case "StartPage":
                pObj.startPage = null
                break;
        
            default:
                break;
        }
    }

    onReadyCountFinish( cObj ){

        const pObj = cObj.parent
        pObj.initEvent()
        console.log("Game Start")
        
        pObj.removeChild( cObj )
        pObj.gameReady = null

        pObj.startGame()
    }
    //Count Ready

    startGame(){
        this.phase = "START"
    }

    endGame(){
        console.log("Game End !")
        this.offEvent()
        this.clearAllEne()
        this.gameEnd.showEnd()

    }

    onEndGameFadeOut( pObj ){

    }

    updateGame2(deltaTime){
        
    }

    updateGame(deltaTime){

        this.totalTime -= (deltaTime)
        let restTime = Math.round(this.totalTime)

        if( this.totalTime <= 0 ){
            this.totalTime = 0
            restTime = 0;
            //console.log(restTime);
            this.phase = "END"
            this.endGame()
        
        }else{
            //console.log(restTime);
            
            if( this.gameBgMove ){
                this.gameBgMove.update( 0.5 )
            }
            
            this.genEne()

        }

        this.countingTxt.text = restTime.toString()
        



    }

    clearAllEne(){
        const eneCount = this.eneMap.size
        if(eneCount > 0){
            for (const [key, obj] of this.eneMap.entries()) {
                obj.destroyEne()
            }
        }
    }

    genEne(){
        this.eneTickCount += 1;
        if(this.eneTickCount >= this.eneTickMax){

            const dateTime = Date.now()
            const timestamp = Math.floor(dateTime).toString()
            //console.log( timestamp );
            this.eneTickCount = 0
            
            const eneVy = Math.random()*3+3
            const ene = new Ene(timestamp, this.resources, this.eneDelegate, this.gameBgMove, this.sizes, this.screenID, this.char, this.isFever, this.isReward, eneVy)
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

            if( this.phase != "END" ){
                pObj.score += 1
            }else if( this.phase == "START" ){

            }
            
            //pObj.scoreTxt.text = pObj.score.toString()
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