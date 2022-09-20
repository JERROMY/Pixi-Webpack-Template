
import * as PIXI from 'pixi.js'
import QRCode from 'qrcode'

export class Utils{

    constructor() {
        
    }

    static createQRCode( codeStr, parent ){

        const qrCodeW = 340
        const qrCodeH = 340

        let squareSp = new PIXI.Graphics()
        squareSp.beginFill(0xff0000)
        squareSp.drawRect(-qrCodeW/2, -qrCodeH/2, qrCodeW, qrCodeH)

        QRCode.toDataURL( codeStr, 
        { 
            errorCorrectionLevel: 'H', 
            width: qrCodeW, 
            height: qrCodeH,
            margin: 2,
        } )
        .then(url => {
            //console.log(url)

            if( parent.qrcodeSp ){
                parent.qrcodeSp.off( 'pointerdown' )
                parent.removeChild( parent.qrcodeSp )
                parent.qrcodeSp = null
            } 

            const qrcodeTex = PIXI.Texture.from(url)
            const qrcodeSp = new PIXI.Sprite(qrcodeTex)
            qrcodeSp.anchor.set( 0.5 )
            qrcodeSp.width = qrCodeW
            qrcodeSp.height = qrCodeH
            parent.addChild( qrcodeSp )
            parent.setQRCodePosition( qrcodeSp )
            //console.log( qrcodeTex )
        })
        .catch(err => {
            
            console.error(err)
            parent.addChild( squareSp )
            return squareSp
        })

      
    }

    static zeroPad(num, places) {
        var zero = places - num.toString().length + 1;
        return Array(+(zero > 0 && zero)).join("0") + num;
    }

    static degrees_to_radians(degrees)
    {
        var pi = Math.PI;
        return degrees * (pi/180);
    }

    static radians_to_degrees(radians)
    {
        var pi = Math.PI;
        return radians * (180/pi);
    }
      

    static getMobileOperatingSystem() {
        var userAgent = navigator.userAgent || navigator.vendor || window.opera;

            // Windows Phone must come first because its UA also contains "Android"
        if (/windows phone/i.test(userAgent)) {
            return "Windows Phone";
        }

        if (/android/i.test(userAgent)) {
            return "Android";
        }

        // iOS detection from: http://stackoverflow.com/a/9039885/177710
        if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
            return "iOS";
        }

        return "unknown";
    }

    static GetDeviceControl ( delegate ) {

        if ( typeof( DeviceMotionEvent ) !== "undefined" && typeof( DeviceMotionEvent.requestPermission ) === "function" ) {
            // (optional) Do something before API request prompt.
            DeviceMotionEvent.requestPermission()
                .then( response => {
                    // (optional) Do something after API prompt dismissed.
                    if ( response == "granted" ) {
                        window.addEventListener( "devicemotion", (e) => {
                            // do something for 'e' here.
                            console.log(e.acceleration.x + ' m/s2')
                        })
                    }

                }).catch( console.error )
        } else {
            alert( "DeviceMotionEvent is not defined" );
        }
    }
        
    static QueryString(name) {
            var AllVars = window.location.search.substring(1);
            var Vars = AllVars.split("&");
            for (i = 0; i < Vars.length; i++)
            {
            var Var = Vars[i].split("=");
            if (Var[0] == name) return Var[1];
            }
            return "-1";
    }



}