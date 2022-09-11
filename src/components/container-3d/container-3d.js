import './container-3d.scss'

class Container3D {
    render() {
        const container = document.createElement('div')
        container.id = "container-3d"
        container.classList.add( 'container-3d' )
        container.width = 400
        container.height = 400
        const body = document.querySelector( 'body' )
        body.appendChild( container )
    }
}

export default Container3D