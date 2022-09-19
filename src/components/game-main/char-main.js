import gsap from "gsap"
import * as PIXI from 'pixi.js'

export class Char extends PIXI.Container{


    constructor(resources){
        super();

        this.resources = resources;

        this.tex1 = this.resources["Char1"].texture
        this.tex2 = this.resources["Char2"].texture

        this.charSp = new PIXI.Sprite( this.tex1)
        this.charSp.anchor.set(0.5)
        this.addChild(this.charSp)
        this.charStatus = "normal"
        this.hitDurationMax = 0.5
        this.hitDuration = 0

        this.ani1
        this.ani2

        
        // this.scale.set( 3 )

    }

    setCharStauts( charS ){

        this.charStatus = charS

        if( this.charStatus == "normal" ){

        }else{
            this.hitDuration = this.hitDurationMax
            this.charSp.texture = this.tex2
        }

    }

    showScore( scoreNum ){
        let scoreStr = ""
        if(scoreNum > 0){
            scoreStr = "+" + scoreNum.toString()
        }else{
            scoreStr = scoreNum.toString()
        }
        

        const scoreTxt = new PIXI.BitmapText( scoreStr, { fontName: 'GameFont2', fontSize: 40, align: 'center' })
        scoreTxt.anchor.x = 1
        scoreTxt.anchor.y = 1
        scoreTxt.position.x = Math.random()* -24 - 12
        this.addChild(scoreTxt)

        //onComplete: this.onEneDestroy, onCompleteParams: [ this ]
        this.ani1 = gsap.to( scoreTxt, {y: -150, duration: 0.6, ease: "cubic.inout"})
        this.ani2 = gsap.to( scoreTxt, {alpha: 0.5, duration: 0.8, ease: "cubic.inout", onComplete: this.onShowScore, onCompleteParams: [scoreTxt, this]})

    }

    onShowScore( sObj, pObj ){
        pObj.removeChild( sObj )
    }

    update( deltaTime ){

        //console.log( deltaTime )
        if( this.charStatus == "hit" ){
            this.hitDuration -= deltaTime

            //console.log( this.hitDuration )
            
            if(this.hitDuration <= 0){
                this.charStatus = "normal"
                this.hitDuration = 0
                this.charSp.texture = this.tex1
            }
        }
        

    }


}