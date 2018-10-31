import * as React from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import {
    Modal,
    Icon,
    Button,
} from 'antd';
import {
    ROUTER_PATH,
    PHP_DOMAIN,
} from '../global/global';
import { getSideType, getSideData, setOpenKeys } from "./../action/mainPage";
const confirm = Modal.confirm;
interface NoMatchProps {
    dispatch?: any;
}

class NoMatch extends React.Component<NoMatchProps, any> {
    constructor(props) {
        super(props)
    }
    onOk = () => {
        // let path = `${ROUTER_PATH}/basic/common`;
        // sessionStorage.clear();
		// sessionStorage.setItem('currentKey', path);
		// sessionStorage.setItem('navMenu', JSON.stringify([path]));
		// this.props.dispatch(getSideData({}));
        // browserHistory.push(path);
        
        let url = location.pathname;
        if(`${ROUTER_PATH}/newadmin/crm/workbench` == url){
            window.location.href = `${ROUTER_PATH}/newadmin/userinfo`;
        }else{
            browserHistory.goBack();
        }
    }
    modalProps = () => {
        return {
            visible: true,
            closable: false,
            wrapClassName: 'ant-confirm-warning',
            footer: (
                <span>
                    <Button  type="primary" onClick={ e => { this.onOk() } }>我知道了</Button>
                </span>
            )
        }
    }
    render() {
        const modalProps = this.modalProps();
        return (
            <div key="ConcealCustomer">
                <Modal {...modalProps}>
                    <div className="ant-confirm-body" style={{ padding: '30px 40px' }}>
                        <i className="anticon anticon-exclamation-circle"></i>
                        <span className="ant-confirm-title">没有权限</span>
                        <div className="ant-confirm-content">当前操作没有权限，请联系您上级管理人员</div>
                    </div>
                </Modal>
            </div>
        )
    }
}

function mapStateToProps(state: any) {
    return {

    }
}

export default connect(mapStateToProps)(NoMatch)
