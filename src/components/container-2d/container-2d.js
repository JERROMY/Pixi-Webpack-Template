import './container-2d.scss'

class Container2D {
    render() {
        const container = document.createElement('div')
        container.id = "container-2d"
        container.classList.add( 'container-2d' )
        container.width = 400
        container.height = 400
        const body = document.querySelector( 'body' )
        body.appendChild( container )
    }
}

export default Container2D