import gsap from "gsap"
import * as PIXI from 'pixi.js'

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

        if( ! isReward ){
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
    
                //this.textTypeAll.push(this.resources["esp"].texture)
    
            }else{
                
                this.textTypeAll.push(this.resources["eg1"].texture)
                this.textTypeAll.push(this.resources["eg2"].texture)
                this.textTypeAll.push(this.resources["eg3"].texture)
                this.textTypeAll.push(this.resources["eg4"].texture)
                this.textTypeAll.push(this.resources["eg5"].texture)
                this.textTypeAll.push(this.resources["eg6"].texture)
            }
        }else{
            this.textTypeAll.push(this.resources["esp"].texture)
        }
        
        

        this.eneID = eneID
        this.eneTypesCount = this.textTypeAll.length
        this.textID = Math.floor( Math.random()*this.eneTypesCount )
        
        this.eneSp = new PIXI.Sprite( this.textTypeAll[this.textID] )
        this.eneSp.anchor.set(0.5)
        this.eneSp.scale.set( Math.random() * 0.5 + 0.7 )
        this.addChild(this.eneSp)
        this.delegate = delegate

        this.vy = speed
        this.isRemoved = false

        this.char = char

        parentObj.addChild(this)

        const monArr = parentObj.monPosiArr

        this.eneChooseID = Math.floor(( Math.random()*monArr.length ))


        //this.position.x = Math.random() * this.gW
        this.position.x = monArr[ this.eneChooseID ].position.x + (Math.random()*40-20)
        this.position.y = monArr[ this.eneChooseID ].position.y + 20
        parentObj.swapChildren( monArr[ this.eneChooseID ], this )

    }

    destroyEne(){
        //this.visible = false;
        
        if( ! this.isRemoved ){
            this.isRemoved = true
            gsap.to( this.scale, {x: 0, y: 0, duration: 0.6, ease: "cubic.in", onComplete: this.onEneDestroy, onCompleteParams: [ this ]})
        }
        

        
    }

    onEneDestroy( pObj ){
        
        pObj.delegate.onEneRemoved( pObj.eneID, pObj.char.parent, "get" )
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
                    this.destroyEne()
                }

            }
        }
        
    }


}