import React from 'react'
import './bubble.less'
class Bubble extends React.Component<any,any>{
    constructor(props){
        super(props)
    }
    render(){
        return <div className='float-father'>
                    
                    <i className='float-trangle'></i>
                    <span className='float-text'>{this.props.text}</span>
                </div>
    }
}
export default Bubble