import React, {Component} from "react";

class Gif extends Component {
    //when video loads add classname loaded
    //otherwise video stays hidden
    constructor(props) {
        super(props)
        this.state = {
            loaded: false
        }
    }


    render () {
        const {loaded} = this.state
        const {images} = this.props
        return (
            <video className={`grid-item video ${loaded && 'loaded'}`} autoPlay loop src=
            {images.original.mp4}
            //when video loads set to be true
            onLoadedData={() => this.setState({loaded: true})}
            />
        )
    }
}

export default Gif;