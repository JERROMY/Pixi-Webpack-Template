import { Utils } from './utils'

import gsap from "gsap"
import CustomEase from 'gsap/CustomEase'

import { GameBall } from './game-ball'
import { GameSocket } from '../game-main/game-socket'
import { DeviceContol } from './device-control'
import { GameEnd } from './game-end'
import { EndPage } from './end-page'

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
            onJoinedGame: self.onJoinedGame,
            onStartGame: self.onStartGame,
            onEndGame: self.onEndGame,
        }


        //Device Control

        this.deviceControlDelegate = {
            onGetAcc: self.onGetAcc,
            onGetOri: self.onGetOri,
            onClickStart: self.onClickStart
        }

        this.pageDelegate = {
            onPageTransitionIn: self.onPageTransitionIn,
            onPageTransitionOut: self.onPageTransitionOut,
        }
        

        this.deviceControl = new DeviceContol( this.screenID, this.resources, this.sizes, this.deviceControlDelegate )
        this.addChild(  this.deviceControl )

         //End Page
        this.endPage = null

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

    showEndPage( score, listNum, rank ){

        if(this.endPage){
            this.removeChild( this.endPage )
            this.endPage = null
        }

        this.endPage = new EndPage( this.screenID, this.resources, this.sizes, this.pageDelegate )
        this.addChild( this.endPage )

        this.endPage.visible = true
        this.endPage.isMobile = true
        this.endPage.startPageTransitionIn( score, listNum, rank )
        
    }

    onPageTransitionIn( page ){
        console.log( `Page Name: ${ page.pageName }` )
    }

    onPageTransitionOut( page ){
        console.log( `Page Name: ${ page.pageName }` )
        // console.log( this )
        const pObj = page.parent
        //pObj.removeChild( page )
        page.visible = false
        page.alpha = 0
        
        
        switch ( page.pageName ) {
           
            case "EndPage":

                pObj.restartGame()
                //pObj.endPage = null
                break;
        
            default:
                break;
        }
    }

    onClickStart( pObj ){
        console.log( "Click Start" )
        pObj.gameSocket.startGame()
        
    }

    onEndGame( score, listNum, rank, r, pObj ){

        pObj.phase = "END"
        console.log( "Score: " + score + " listNum: " + listNum + " Rank:" + rank + " " + r )
        pObj.showEndPage( score, listNum, rank )
    }

    onStartGame( gameID, pObj, r  ){
        console.log( "GameID Mobile: " + gameID + " Start" )
        pObj.phase = "START"
        pObj.initEvent()
    }

    onJoinedGame( gameID, pObj, r ){
        console.log( "GameID: " + gameID + " Joined" )
        if( r == 0 ){
            
        } else if( r == 1 ) {
            pObj.deviceControl.startBtn.visible = true
        } else {
            
        }
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

        if( parent.phase == "START" ){
            parent.gameSocket.updateGame( parent.ball.position.x )
        }

        
    }

    updateGame(deltaTime){

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
        this.ball.position.x = localPosi.x

        if( this.phase == "START" ){
            this.gameSocket.updateGame( this.ball.position.x )
        }
        
    }

    resizeGame(aW, aH){

        const percentScale = aH / this.gH
        //console.log(`Scale Percentage: ${ percentScale }`);
        this.height = aH
        this.width = this.gW * percentScale
        

    }




}