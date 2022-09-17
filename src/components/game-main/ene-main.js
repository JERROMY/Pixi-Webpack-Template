import gsap from "gsap"
import * as PIXI from 'pixi.js'

export class Ene extends PIXI.Container{


    constructor(eneID, resources, delegate){
        super();

        this.resources = resources;
        this.textType = [];
        this.textType.push(this.resources["enemyType1"].texture);
        this.textType.push(this.resources["enemyType2"].texture);
        this.textType.push(this.resources["enemyType3"].texture);

        this.eneID = eneID;
        this.textID = Math.floor(Math.random()*3);
        
        this.eneSp = new PIXI.Sprite( this.textType[this.textID] );
        this.eneSp.anchor.set(0.5);
        this.eneSp.scale.set( Math.random() * 0.5 + 0.5 );
        this.addChild(this.eneSp);
        this.delegate = delegate;

        this.vy = Math.random()*3+3;
        this.isRemoved = false;

    }

    destroyEne(){
        //this.visible = false;
        
        if( ! this.isRemoved ){
            this.isRemoved = true;
            gsap.to( this.scale, {x: 0, y: 0, duration: 0.6, ease: "cubic.in", onComplete: this.onEneDestroy, onCompleteParams: [ this ]});
        }
        

        
    }

    onEneDestroy( pObj ){
        
        pObj.delegate.onEneRemoved( pObj.eneID, pObj.parent, "get" );
    }

    update(){
        if( ! this.isRemoved ){
            this.position.y += this.vy;
            if(this.position.y > this.parent.gH + 100){
                this.visible = false;
                this.isRemoved = true;
                this.delegate.onEneRemoved( this.eneID, this.parent, "out" );
            }else{

                const p1 = this.parent.char.position;
                const p2 = this.position;
                
                const a = p1.x - p2.x;
                const b = p1.y - p2.y;

                var c = Math.sqrt( a*a + b*b );

                if(c < ( this.parent.char.width + this.width ) / 2 ){
                    this.destroyEne();
                }

            }
        }
        
    }


}