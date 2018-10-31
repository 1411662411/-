import React from 'react'
import { Modal } from 'antd'
import {ModalProps} from 'antd/lib/modal';

import Img from './avater-03.png'
import './style.less'

class JoyoModal extends React.Component<ModalProps, any>{
    constructor(props){
        super(props)
    }

    render(){
        return <Modal
            {...this.props}
        >
            <div className="report-dialog-wrap">
                <div className="init-bg-wrap">
                    <img src={Img} className="org-icon" alt="" />
                    <div style={{
                            width: '100%',
                            paddingLeft: 80,
                    }}>
                        {this.props.children}
                    </div>
                </div>
            </div>
        </Modal>
    }
}

export default JoyoModal