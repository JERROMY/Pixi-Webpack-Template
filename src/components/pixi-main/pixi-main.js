
import * as PIXI from 'pixi.js'
import AssetsLoader from '../../assetsLoader'
import gsap from "gsap"
import { GameMain } from '../game-main/game-main'


class PixiMain {

    App_Width = 400
    App_Height = 300
    
    baseBgW = 720
    baseBgH = 1280

    canvasContainer
    app
    stage
    loadingTxt

    assetsLoader;
    alDelegate
    gameStages = []

    constructor( pixiData ){

        this.pixiData = pixiData
        console.log("Pixi Ready")
        this.initObj()
        this.initEvent()
        this.onWindowResize()

    }

    initObj(){

        console.log( "Init Game !" )

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

        this.app.ticker.add( this.animate )
    }

    initEvent() {

        const self = this;

        this.alDelegate = {
            main: self,
            onLoadStart: self.onLoadStart,
            onLoadFinish: self.onLoadFinish
        }

        this.assetsLoader = new AssetsLoader( this.alDelegate, this.loadingTxt );
        this.assetsLoader.startLoadAssets()

        window.addEventListener( 'resize', this.onWindowResize.bind( this ) )
    }

    onLoadStart(){
        console.log("Loaded Start")
    }
    onLoadFinish(){
        console.log("Loaded Finished")
        //console.log( this );
        this.main.loadingComplete();
    }

    loadingComplete(){
  

        // Sprite Usage Example
        console.log("Loaded Finish 2");
        let tween = gsap.to(this.loadingTxt, {alpha: 0, duration: 0.8, delay:0, ease: "circ.in", onComplete: this.onPercentageTxtFadeOut, onCompleteParams: [ this.loadingTxt, this ]})
      
        // let sprite = new PIXI.Sprite(resources.ball.texture)
        // stage.addChild(sprite)
        // let bgTex = resources["hBg"+(i+1)].texture
        // let bgSp = new PIXI.Sprite(bgTex)
      
        
      
        this.onWindowResize()
      
    }

    onPercentageTxtFadeOut( obj, p ){
        obj.visible = false
        //this.assetsLoader.isLoadingReady = true;
        console.log("Loading Complete!")
      
        p.initGameObj();
    }

    initGameObj(){
        
        // console.log( 'init Game Object' )
        const game1 = new GameMain( this.assetsLoader.resources )
        this.stage.addChild( game1 )


        this.gameStages.push( game1 )

        this.resizeGame()


    }

    animate(delta) {

        //console.log( delta );

        if(this.assetsLoader){
          if( this.assetsLoader.isLoadingReady ){
            const deltaTime = delta / this.app.ticker.FPS
            updateGame(deltaTime)
          }
        }
        
        
      
        // console.log(elapsed);
        // elapsed += Number(delta);
        // console.log("Time: " + elapsed );
        // console.log(typeof elapsed);
      
    }

    updateGame( deltaTime ){

    

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
      
        if(gameStageCount > 0){
          for(let i = 0 ; i < gameStageCount ; i++){
            const gameStage = this.gameStages[i]
            gameStage.resizeGame(this.App_Width, this.App_Height)
            gameStage.position.x = this.App_Width / 2 + i * ( gameStage.width + spaceW )
            totalGameW += gameStage.width
          }
      
          totalGameW += spaceTotal
      
          for(let i = 0 ; i < gameStageCount ; i++){
            const gameStage = this.gameStages[i]
            gameStage.position.x -= totalGameW/2
            gameStage.initObj()
            //gameStage.startCountReady();
            //totalGameW += gameStage.width;
          }
      
          
      
      
          
        } 
      
      
    }

}

export default PixiMain