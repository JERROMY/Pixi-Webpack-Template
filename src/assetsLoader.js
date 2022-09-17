
import * as PIXI from 'pixi.js'

//Pixi Assets

const images = {};
const context = require.context('./images', true, /\.(png|jpe?g|svg|fnt)$/);
//console.log(images);

context.keys().forEach(( filename )=>{
    const fNameArr = filename.split( '.' )
    const fName = fNameArr[1].replace('/', '')
    images[fName] = context( filename )
});

console.log( images )


class AssetsLoader {

    assetsData = images
    

    constructor(delegate, loadingTxt) {

        this.loader = new PIXI.Loader()
        this.loadingTxt = loadingTxt
        this.resources = this.resources
        this.loadIndex = 0
        
        this.delegate = delegate
        this.assetsMap = new Map(Object.entries( this.assetsData ))
        console.log( this.assetsMap )
        
        this.maxAssets = this.assetsMap.size
        this.isLoadingReady = false


        this.addAssetsToLoader();

        //console.log(this.maxAssets);
    
    }

    addAssetsToLoader(){
        if(this.maxAssets > 0){
            for (const [key, obj] of this.assetsMap.entries()) {
                this.loader.add(key, obj)
            }
        }
    }

    startLoadAssets(){

        const self = this
        this.isLoadingReady = false

        this.loader.pre(this.cachingMiddleware)
        this.loader.use(this.parsingMiddleware)

        console.log(self.delegate)
        self.delegate.onLoadStart()

        

        this.loader.load((l, r) => {
            
            //console.log(loader);
            //console.log(resources);
            //console.log(l)
            //console.log(r);
            // resources is an object where the key is the name of the resource loaded and the value is the resource object.
            // They have a couple default properties:
            // - `url`: The URL that the resource was loaded from
            // - `error`: The error that happened when trying to load (if any)
            // - `data`: The raw data that was loaded
            // also may contain other properties based on the middleware that runs.
            //sprites.bunny = new PIXI.TilingSprite(resources.bunny.texture);
            //sprites.spaceship = new PIXI.TilingSprite(resources.spaceship.texture);
            //sprites.scoreFont = new PIXI.TilingSprite(resources.scoreFont.texture);
        })

        this.loader.onProgress.add(() => {
            this.loadedAssets();
        })

        this.loader.onError.add(() => {

        })

        this.loader.onLoad.add(() => {
            //console.log("Loaded");
        })

        this.loader.onComplete.add((l, r) => {
            console.log(l);
            console.log(r);
            //console.log();
            this.isLoadingReady = true;
            this.resources = r;
            this.delegate.onLoadFinish();
        })


    }
    cachingMiddleware(resource, next){
        next()
    }

    parsingMiddleware(resource, next){
        next()
    }

    loadedAssets(){

        //console.log("Assets Loaded: "+loadIndex+" "+loadingPercent);
        this.loadIndex += 1
        if(this.loadIndex >= this.maxAssets){
            this.loadIndex = this.maxAssets
        }
        
        let loadingPercent = Math.ceil(this.loadIndex/this.maxAssets*100)
        console.log("Assets Loaded: " + this.loadIndex + " " + loadingPercent)
        this.loadingTxt.text = "Loading.. "+loadingPercent+"%";
        if(this.loadIndex == this.maxAssets){
            //console.log("Assets Loaded Complete!");
            //this.isLoadingReady = true;
            
            //TweenMax.to(loadingTxt, 1.0, {alpha:0, delay:0.2, ease:"Linear.easeOut", onComplete:loadingComplete});
        }
        
    
    }


}

export default AssetsLoader