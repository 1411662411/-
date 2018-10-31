import React from 'react'
import {
    Row,
    Button,
    Col,
} from 'antd'
import WebSiteForm from '../../components/webForm/index'

class AddActivity extends React.Component{
    render(){
        return (
            <div>
                <WebSiteForm type={1}/> 
            </div>
        )
    }
}
export default AddActivity