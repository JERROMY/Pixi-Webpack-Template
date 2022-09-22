import { Utils } from '../game-main/utils'

import * as PIXI from 'pixi.js'
import AssetsLoader from '../../assetsLoader'
import { GameMain } from '../game-main/game-main-mobile'
import gsap from "gsap"
import CustomEase from 'gsap/CustomEase'


class PixiMain {

    App_Width = 400
    App_Height = 300
    
    baseBgW = 481
    baseBgH = 1080

    canvasContainer
    app
    stage
    loadingTxt

    assetsLoader
    alDelegate
    gameStages = []

    constructor( pixiData ){

        // this.joinGameID = Utils.QueryString("rndCode")
        // console.log( this.joinGameID )

        const url = new URL(location.href);
        this.joinGameID  = url.searchParams.get("rndCode");
        if( !this.joinGameID ){
            alert("There is no Game There!")
            return
        }


        console.log(this.joinGameID);

        gsap.registerPlugin(CustomEase)

        this.pixiData = pixiData
        console.log("Pixi Mobile Ready")
        
        this.initObj()
        this.initEvent()
        this.onWindowResize()

    }

    initObj(){

        console.log( "Init Mobile Game !" )

        this.canvasContainer = document.getElementById('container-2d')

        const rendererOptions = {
            width: this.App_Width,
            height: this.App_Height,
            antialias: true,
            resolution: 1,
            resizeTo: this.canvasContainer,
            backgroundColor: 0xFFFFFF
        }

        this.app = new PIXI.Application(rendererOptions);

        PIXI.settings.ROUND_PIXELS = true
        PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.LINEAR

        this.stage = this.app.stage

        this.loadingTxt = new PIXI.Text('Loading.. 0%', 
        { 
            fontFamily: 'Arial', 
            fontSize: 14, 
            fontWeight: 'bold', 
            fill: '#000000', 
            align: 'center', 
            stroke: '#FFFFFF', 
            strokeThickness: 3 
        });

        this.loadingTxt.anchor.set(0.5)
        this.stage.addChild( this.loadingTxt )
        
        this.app.view.style.height = "100%";
        this.canvasContainer.appendChild(this.app.view);
        
        //$('#canvas-container').append();

        this.app.ticker.add( this.animate.bind(this) )
    }

    initEvent() {

        const self = this;

        this.alDelegate = {
            main: self,
            onLoadStart: self.onLoadStart,
            onLoadFinish: self.onLoadFinish
        }

        this.assetsLoader = new AssetsLoader( this.alDelegate, this.loadingTxt )
        this.assetsLoader.startLoadAssets()

        window.addEventListener( 'resize', this.onWindowResize.bind( this ) )
    }

    onLoadStart(){
        console.log("Loaded Start")
    }
    onLoadFinish(){
        //console.log("Loaded Finished")
        //console.log( this );
        this.main.loadingComplete();
    }

    loadingComplete(){
  

        // Sprite Usage Example
        // console.log("Loaded Finish 2");
        let tween = gsap.to(this.loadingTxt, {alpha: 0, duration: 0.8, delay:0, ease: "circ.in", onComplete: this.onPercentageTxtFadeOut, onCompleteParams: [ this.loadingTxt, this ]})
      
        // let sprite = new PIXI.Sprite(resources.ball.texture);
        // stage.addChild(sprite);
        // let bgTex = resources["hBg"+(i+1)].texture;
        // let bgSp = new PIXI.Sprite(bgTex);
      
        
      
        this.onWindowResize()
      
    }

    onPercentageTxtFadeOut( obj, gameMain ){
        obj.visible = false
        //this.assetsLoader.isLoadingReady = true;
        console.log("Loading Complete!");
      
        gameMain.initGameObj()
    }

    initGameObj(){


        const game1 = new GameMain(1, this.assetsLoader.resources, this.joinGameID)
        this.stage.addChild(game1)

        this.gameStages.push(game1)

        // const game2 = new GameMain(2, this.assetsLoader.resources)
        // this.stage.addChild(game2)

        // this.gameStages.push(game2)

        // const game3 = new GameMain(3, this.assetsLoader.resources)
        // this.stage.addChild(game3)

        // this.gameStages.push(game3)

        // const game4 = new GameMain(4, this.assetsLoader.resources)
        // this.stage.addChild(game4)

        // this.gameStages.push(game4)


        this.resizeGame()

    }



    animate(delta) {

        //console.log( delta );
        //console.log( this );

        if(this.assetsLoader){

            //console.log( this.assetsLoader.isLoadingReady );
            //this.assetsLoader.isLoadingReady;

            if( this.assetsLoader.isLoadingReady ){
                const deltaTime = delta / this.app.ticker.FPS
                this.updateGame(deltaTime)
            }
        }
        
        
      
        // console.log(elapsed);
        // elapsed += Number(delta);
        // console.log("Time: " + elapsed );
        // console.log(typeof elapsed);
      
    }

    updateGame( deltaTime ){

        

        let gameStageCount = this.gameStages.length;
        if( gameStageCount > 0 ){
            for(let i = 0 ; i < gameStageCount ; i++){
                const gameStage = this.gameStages[i];
                if(gameStage.phase == "START"){
                    gameStage.updateGame( deltaTime );
                }else{
                    //gameStage.updateGame2( deltaTime );
                }
            }
            
        }

    }

    onWindowResize(){


        //2048 1448
        this.App_Width = window.innerWidth
        this.App_Height = window.innerHeight
        
      
        if(this.loadingTxt != null){
          this.loadingTxt.position.x = this.App_Width/2
          this.loadingTxt.position.y = this.App_Height/2
        }
        
        console.log("Resize!: w: " + this.App_Width + " h: " + this.App_Height)
        //renderer.resize(App_Width, App_Height);
        //renderer.view.style.height = "100%";
      
        this.resizeGame();
      
    }

    resizeGame(){
  
        const gameStageCount = this.gameStages.length
        //console.log(`Stage Count: ${ gameStageCount }`);
      
        const spaceW = 35
        let totalGameW = 0
        let spaceTotal = 0
      
        spaceTotal = ( gameStageCount - 1 ) * spaceW

        const sAppH = this.App_Height * 0.9;
      
        if(gameStageCount > 0){
          for(let i = 0 ; i < gameStageCount ; i++){
            const gameStage = this.gameStages[i]
            gameStage.resizeGame(this.App_Width, sAppH)
            gameStage.position.x = this.App_Width / 2 + i * ( gameStage.width + spaceW )
            totalGameW += gameStage.width
          }
      
          totalGameW += spaceTotal
      
          for(let i = 0 ; i < gameStageCount ; i++){
            const gameStage = this.gameStages[i]
            gameStage.position.x -= totalGameW/2
            gameStage.position.y = this.App_Height / 2 - sAppH / 2
            gameStage.initObj()
            //gameStage.startCountReady();
            //totalGameW += gameStage.width;
          }
      
          
      
      
          
        } 
      
      
    }

}

export default PixiMain