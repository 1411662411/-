import React from 'react'
import {
    Row,
    Button,
    Col,
} from 'antd'
import WebSiteForm from '../../components/webForm/index'
class CheckActivity extends React.Component {
    constructor(props){
        super(props)
    }
    render() {
        return (
            <div>
                <WebSiteForm type={2}/>
            </div>
        )
    }
}
export default CheckActivity