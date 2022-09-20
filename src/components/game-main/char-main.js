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
            this.charSp.texture = this.tex1
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
        scoreTxt.position.x = this.position.x + ( Math.random()* -24 - 12 )
        scoreTxt.position.y = this.position.y
        this.parent.addChild(scoreTxt)
        

        //onComplete: this.onEneDestroy, onCompleteParams: [ this ]
        //this.ani1 = gsap.to( scoreTxt, {y: this.position.y - 150, duration: 0.4, ease: "cubic.inout" , onComplete: this.onShowPreScore, onCompleteParams: [scoreTxt, this]})
        //this.ani2 = gsap.to( scoreTxt, {alpha: 0, duration: 0.6, ease: "cubic.inout", onComplete: this.onShowScore, onCompleteParams: [scoreTxt, this]})

        const t1 = gsap.timeline( { onComplete: this.onShowScore, onCompleteParams: [ scoreTxt, this ]} )
        t1.to(scoreTxt, { y: this.position.y - 150, duration:0.4, ease: "cubic.inout" })
                .to(scoreTxt, { alpha: 0, duration:0.5, ease: "cubic.inout" }, "-= 0.2")

    }

    onShowPreScore( sObj, pObj ){
        pObj.parent.removeChild( sObj )
        this.kill()
    }

    onShowScore( sObj, pObj ){
        pObj.parent.removeChild( sObj )
        this.kill()
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