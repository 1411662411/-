import React from 'react'
import { DOMAIN_OXT } from '../../../global/global';

class AVisited extends React.Component<any, any>{
    constructor(props) {
        super(props)
        this.state = {
            visible: false
        }
    }

    handle = () => {
        this.setState({
            visible: true
        })
    }
    
    render() {
        const {
            item
        } = this.props;
        return (
            <a onClick={this.handle} className={this.state.visible ? 'visited' : ''} href={`${DOMAIN_OXT}/crm/background/customermanagement/customerCooperationDetail?id=${item.id}`} target="_blank">{item.cName}</a>
        )
    }
}

export default AVisited