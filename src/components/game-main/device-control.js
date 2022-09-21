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

        this.position.set( this.gW/2, this.gH/2 )

        this.delegate = delegate

        this.startBtn.on( 'tap', this.onStartGameClick )
    
    }

    onStartGameClick(){
        //console.log( "Click" )

        this.startBtn.visible = false
        const os = Utils.getMobileOperatingSystem()
        if( os == "iOS" ){
            Utils.GetDeviceControlIOS( this.parent.delegate, this.parent.parent )
        }else if( os == "Android"){
            Utils.GetDeviceControlAndroid( this.parent.delegate, this.parent.parent )
        }else{
            alert( "Not Support" )
        }
        //alert( os )
        //this.alpha -= 0.01
        //Utils.GetDeviceControl( this.parent.delegate, this.parent.parent )
    }



}