import { Utils } from './utils'

import gsap from "gsap"
import CustomEase from 'gsap/CustomEase'

import * as PIXI from 'pixi.js'

export class DeviceContol extends PIXI.Container{

    constructor(screenID, resources, sizes, delegate){
        
        super()
        this.screenID = screenID
        this.resources = resources
        
        this.gW = sizes.gW
        this.gH = sizes.gH


        this.startBtn = new PIXI.Sprite( this.resources["GameStartBtn"].texture )
        this.startBtn.anchor.set( 0.5 )
        this.startBtn.visible = true
        this.startBtn.interactive = true
        this.startBtn.buttonMode = true
        this.addChild( this.startBtn )
        //this.startBtn.off( 'pointerdown' )

        this.position.set( this.gW/2, this.gH/2 - 100 )

        this.delegate = delegate


        this.leftArr = new PIXI.Sprite( this.resources["arrLeft"].texture )
        this.leftArr.anchor.set( 0.5 )
        this.leftArr.position.x = -this.gW/2 + this.leftArr.width/2 + 10
        this.leftArr.scale.set( 0.5 )
        this.addChild( this.leftArr )

        this.rightArr = new PIXI.Sprite( this.resources["arrRight"].texture )
        this.rightArr.anchor.set( 0.5 )
        this.rightArr.position.x = this.gW/2 - this.rightArr.width/2 - 10
        this.rightArr.scale.set( 0.5 )
        this.addChild( this.rightArr )

        this.leftArr.visible = false
        this.rightArr.visible = false
        

        //this.startBtn.on( 'tap', this.onStartGameClick )
        if (process.env.NODE_ENV === 'production') {
            this.startBtn.on( 'tap', this.onStartGameClick )
        }else{
            this.startBtn.on( 'pointerdown', this.onStartGameClick )
        }
        
        this.startBtn.visible = false
    
    }

    onStartGameClick(){
        //console.log( "Click" )
        //console.log( this )

        this.visible = false
        this.parent.delegate.onClickStart( this.parent.parent )
        //this.off( 'tap' )
        
        
        if (process.env.NODE_ENV === 'production') {
            this.off( 'tap' )
        }else{
            this.off( 'pointerdown' )
        }

        const os = Utils.getMobileOperatingSystem()
        if( os == "iOS" ){
            Utils.GetDeviceControlIOS( this.parent.delegate, this.parent.parent )
        }else if( os == "Android"){
            Utils.GetDeviceControlAndroid( this.parent.delegate, this.parent.parent )
        }else{
            //alert( "Not Support" )
        }
        
    }



}