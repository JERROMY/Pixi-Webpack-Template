import './main.scss'

import Container2D from "./components/container-2d/container-2d"
import PixiData from "./pixi-data"
import PixiMain from './components/pixi-main/pixi-main-mobile'

const container2D = new Container2D()
container2D.render()

const pixiData = new PixiData()
const pixiMain = new PixiMain(pixiData)


if (process.env.NODE_ENV === 'production') {
    console.log('Production mode')
}else{
    console.log('Development mode')
}