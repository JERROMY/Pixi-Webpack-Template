
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

class ThreeMain {

    //camera
    scene
    renderer

    container = document.getElementById( 'container-3d' )

    aml

    dirGeo

    controls
    size = {
        w: 0,
        h: 0
    }


    constructor( threeData ) {

        this.threeData = threeData

        console.log("=========================")
        //console.log(this.B_VS)

        console.log("Three JS Ready")

        this.shaderMat = new THREE.ShaderMaterial( {
    
            //uniforms: this.uniforms,
            vertexShader: this.threeData.BasicVS,
            fragmentShader: this.threeData.BasicFS,
    
            //blending: THREE.AdditiveBlending,
            side:THREE.DoubleSide,
            // depthTest: false,
            // transparent: true,
            // vertexColors: true
    
        } )
        

        this.amL = new THREE.AmbientLight(0xffffff)

        // this.camera = new THREE.OrthographicCamera(
        //     -1, // left
        //      1, // right
        //      1, // top
        //     -1, // bottom
        //     -1, // near,
        //      1, // far
        // );

        this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 40000 )
        this.camera.position.z = 2 //0.35 0 1200
        this.camera.position.x = 0
        this.camera.position.y = 0

        
        

        this.scene = new THREE.Scene()
        this.scene.add( this.amL )

        this.dirGeo = new THREE.BoxGeometry(1, 1, 1)
        this.dirMat = this.shaderMat
        this.dirCube = new THREE.Mesh(this.dirGeo, this.dirMat)
        this.scene.add(this.dirCube)
        this.dirCube.position.set(0, 0, 0)
        this.dirCube.visible = false

        this.axistHelper = new THREE.AxesHelper( 5 )
        this.dirCube.add( this.axistHelper )


        this.planeGeo = new THREE.PlaneGeometry(2, 2)
        this.planeMesh = new THREE.Mesh( this.planeGeo, this.dirMat )
        this.scene.add( this.planeMesh )



        this.renderer = new THREE.WebGLRenderer({ antialias: true })
        this.renderer.setPixelRatio( window.devicePixelRatio )
        this.renderer.setSize( window.innerWidth, window.innerHeight )
        //this.renderer.outputEncoding = THREE.sRGBEncoding
        this.container.appendChild( this.renderer.domElement )

        this.controls = new OrbitControls( this.camera, this.renderer.domElement )

        this.initEvent()
        this.onWindowResize()
        this.animate()

    }

    animate(){
        //console.log("animate")
        this.update()
        window.requestAnimationFrame( this.animate.bind( this ) )
    }

    update(){
        this.renderer.render( this.scene, this.camera )
    }

    initEvent(){
        window.addEventListener( 'resize', this.onWindowResize.bind( this ) )
    }

    onWindowResize() {


        this.size.w = window.innerWidth
        this.size.h = window.innerHeight

        console.log( this.size.w + ' ' + this.size.h )
        //console.log( this )
        //console.log( this.camera )

        this.size.asp = this.size.w / this.size.h
        this.camera.aspect = this.size.asp
        this.camera.updateProjectionMatrix()
        
        // const aspectRatio = this.size.w / this.size.h
        // this.camera.left = -1 * aspectRatio
        // this.camera.right = 1 * aspectRatio
        // this.camera.updateProjectionMatrix()




        this.renderer.setSize( this.size.w, this.size.h )
    
    }


    

}

export default ThreeMain