import React from 'react'
import {
    Row,
    Button,
    Col,
} from 'antd'
import WebSiteForm from '../../components/webForm/index'

class EditorActivity extends React.Component {
    render() {
        return (
            <div>
                <WebSiteForm type={3}/>
            </div>
        )
    }
}
export default EditorActivity