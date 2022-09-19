import gsap from "gsap"
import * as PIXI from 'pixi.js'
import { GlowFilter } from 'pixi-filters'

export class Ene extends PIXI.Container{


    constructor(eneID, resources, delegate, parentObj, sizes, screenID, char, isFever, isReward, speed){
        super()
        
        const self = this
        this.screenID = screenID
        this.resources = resources
        this.gW = sizes.gW
        this.gH = sizes.gH

        this.resources = resources
        this.textTypeAll = []
        this.scoreMap = new Map();
        this.glowFilter = new GlowFilter(15, 2, 1, 0xff9999, 0.5);

        this.scoreMap.set( "eb1",  -400);
        this.scoreMap.set( "eb2",  -100);
        this.scoreMap.set( "eb3",  -400);
        this.scoreMap.set( "eb4",  -200);
        this.scoreMap.set( "eb5",  -100);
        this.scoreMap.set( "eb6",  -300);

        this.scoreMap.set( "eg1",  300);
        this.scoreMap.set( "eg2",  400);
        this.scoreMap.set( "eg3",  400);
        this.scoreMap.set( "eg4",  200);
        this.scoreMap.set( "eg5",  200);
        this.scoreMap.set( "eg6",  100);
        this.scoreMap.set( "eg7",  100);
        this.scoreMap.set( "esp",  500);

        this.isReward = isReward

        if( ! this.isReward ){
            if(! isFever){

                this.textTypeAll.push(this.resources["eb1"].texture)
                this.textTypeAll.push(this.resources["eb2"].texture)
                this.textTypeAll.push(this.resources["eb3"].texture)
                this.textTypeAll.push(this.resources["eb4"].texture)
                this.textTypeAll.push(this.resources["eb5"].texture)
                this.textTypeAll.push(this.resources["eb6"].texture)
    
                this.textTypeAll.push(this.resources["eg1"].texture)
                this.textTypeAll.push(this.resources["eg2"].texture)
                this.textTypeAll.push(this.resources["eg3"].texture)
                this.textTypeAll.push(this.resources["eg4"].texture)
                this.textTypeAll.push(this.resources["eg5"].texture)
                this.textTypeAll.push(this.resources["eg6"].texture)
                this.textTypeAll.push(this.resources["eg7"].texture)
    
                //this.textTypeAll.push(this.resources["esp"].texture)
    
            }else{
                
                this.textTypeAll.push(this.resources["eg1"].texture)
                this.textTypeAll.push(this.resources["eg2"].texture)
                this.textTypeAll.push(this.resources["eg3"].texture)
                this.textTypeAll.push(this.resources["eg4"].texture)
                this.textTypeAll.push(this.resources["eg5"].texture)
                this.textTypeAll.push(this.resources["eg6"].texture)
                this.textTypeAll.push(this.resources["eg7"].texture)
            }
        }else{
            this.textTypeAll.push(this.resources["esp"].texture)
        }
        
        

        this.eneID = eneID
        this.eneTypesCount = this.textTypeAll.length
        this.textID = Math.floor( Math.random()*this.eneTypesCount )
        this.texture = this.textTypeAll[this.textID]
        this.eneName = this.texture.textureCacheIds[0]
        this.eneSp = new PIXI.Sprite( this.texture )
        this.eneSp.anchor.set(0.5)
        this.eneSp.scale.set( Math.random() * 0.5 + 0.7 )
        this.addChild(this.eneSp)
        this.delegate = delegate

        this.vy = speed
        this.isRemoved = false

        this.char = char
        this.scoreNum = this.scoreMap.get( this.eneName )

        parentObj.addChild(this)

        const monArr = parentObj.monPosiArr

        this.eneChooseID = Math.floor(( Math.random()*monArr.length ))


        //this.position.x = Math.random() * this.gW
        this.position.x = monArr[ this.eneChooseID ].position.x + (Math.random()*40-20)
        this.position.y = monArr[ this.eneChooseID ].position.y + 20
        parentObj.swapChildren( monArr[ this.eneChooseID ], this )

        if(isFever){
            this.filters = [ this.glowFilter ]
            this.vy *= 1.5
        }

    }

    destroyEne(){
        //this.visible = false;

        let eneStatus = "get"
        
        if(this.eneName.indexOf("eg") != -1){
            eneStatus = "get"
        }else if(this.eneName.indexOf("eb") != -1){
            eneStatus = "hit"
        }else if(this.eneName.indexOf("esp") != -1){
            eneStatus = "sp"
        }else{
            eneStatus = "out"
        }
        
        this.delegate.onBeforeRemoved( this.char.parent, eneStatus, this.scoreNum)
        
        
        if( ! this.isRemoved ){
            this.isRemoved = true
            gsap.to( this.scale, {x: 0, y: 0, duration: 0.6, ease: "cubic.in", onComplete: this.onEneDestroy, onCompleteParams: [ this ]})
        }
        

        
    }

    onEneDestroy( pObj ){

        pObj.delegate.onEneRemoved( pObj.eneID, pObj.char.parent )
   
   
    }

    update(){
        if( ! this.isRemoved ){
            this.position.y += this.vy
            if(this.position.y > this.gH + 100){
                this.visible = false
                this.isRemoved = true
                this.delegate.onEneRemoved( this.eneID, this.char.parent, "out" )
            }else{

                const p1 = this.char.position
                const p2 = this.position
                
                const a = p1.x - p2.x
                const b = p1.y - p2.y

                const c = Math.sqrt( a*a + b*b )
                const minDist = ( ( this.char.width + this.width ) / 2 ) * 0.8

                if(c < minDist){
                    // if(  ){

                    // }
                    this.destroyEne()
                }

            }
        }
        
    }


}