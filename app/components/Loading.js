import React from 'react'
import PropTypes from 'prop-types'

const style = {
    content: {
        fonstSize: '35px',
        position: 'absolute',
        left: '0',
        right: '0',
        marginTop: '20px',
        textAlign: 'center'

    }
}


export default class Loading extends React.Component {
    state = {
        content: this.props.text

    }

    componentDidMount = () => {
        const {speed, text } = this.props

        this.interval = window.setInterval(() => {
            console.log('I am still updating, but theres no need to. Memory Leak!')
            this.state.content === text + '...'
            ? this.setState({ content: text})
            : this.setState(({ content }) => ({content: content + '.'}))
        }, speed)
    }

    componentWillUnmount = () => {
        window.clearInterval(this.interval)

    }

    
    render () {
        return (
            <p style={ style.content }>
                {this.state.content}
            </p>
        )
    }
}


Loading.propTypes = {
    text: PropTypes.string.isRequired,
    speed: PropTypes.number.isRequired

}

Loading.defaultProps = {
    text: 'Loading',
    speed: 300
}
