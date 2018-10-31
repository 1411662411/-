import React from 'react';
import {Row, Col, Spin} from 'antd';
import { DOMAIN_OXT } from '../../../global/global';
import { fetchFn } from '../../../util/fetch';

const api = `${DOMAIN_OXT}/apiv2_/permission/v1/account/getUserInfoAndRoleDate`;
const fetchApi = () => {
    return fetchFn(api, {}).then(data => data);
}
class UserInfo extends React.Component<any,any>{
    constructor(props){
        super(props)
        this.state = {
            userName: '',
            name: '',
            gender: '',
            age: '',
            phone: '',
            email: '',
            jobStatus: '',
            enableStatus: '',
            userRoleName: '',
            remark: '',
            loading: true,
        }
    }

    async componentWillMount(){
        let res:any = await fetchApi();
        const {
            userName,
            name,
            gender,
            age,
            phone,
            email,
            jobStatus,
            enableStatus,
            userRoleName,
            remark,
        } = res.data;
        this.setState({
            userName,
            name,
            gender,
            age,
            phone,
            email,
            jobStatus,
            enableStatus,
            userRoleName,
            remark,
            loading: false,
        })
    }

    render(){
        const {
            userName,
            name,
            gender,
            age,
            phone,
            email,
            jobStatus,
            enableStatus,
            userRoleName,
            remark,
        } = this.state;
        const keySpan = {
            sm: {span: 10},
            md: {span: 8},
            lg: {span: 4},
            xl: {span: 4},
        }
        const ValueSpan = {
            sm: {span: 24},
            md: {span: 16},
            lg: {span: 20},
            xl: {span: 20},
        }
        return <div className='crm-page-user-info'>
            <Spin
                spinning= {this.state.loading}
            >
            <Row style={{marginTop: 20}}>
                <Col style={{textAlign: 'right'}} {...keySpan}>用户名：</Col>
                <Col style={{paddingLeft: 20}} {...ValueSpan}>{userName}</Col>
            </Row>
            <Row style={{marginTop: 20}}>
                <Col style={{textAlign: 'right'}} {...keySpan}>姓名：</Col>
                <Col style={{paddingLeft: 20}} {...ValueSpan}>{name}</Col>
            </Row>
            <Row style={{marginTop: 20}}>
                <Col style={{textAlign: 'right'}} {...keySpan}>性别：</Col>
                <Col style={{paddingLeft: 20}} {...ValueSpan}>{gender == 1 ? '男' : gender == 2 ? '女' : '保密'}</Col>
            </Row>
            <Row style={{marginTop: 20}}>
                <Col style={{textAlign: 'right'}} {...keySpan}>年龄：</Col>
                <Col style={{paddingLeft: 20}} {...ValueSpan}>{age}</Col>
            </Row>
            <Row style={{marginTop: 20}}>
                <Col style={{textAlign: 'right'}} {...keySpan}>手机：</Col>
                <Col style={{paddingLeft: 20}} {...ValueSpan}>{phone}</Col>
            </Row>
            <Row style={{marginTop: 20}}>
                <Col style={{textAlign: 'right'}} {...keySpan}>邮箱：</Col>
                <Col style={{paddingLeft: 20}} {...ValueSpan}>{email}</Col>
            </Row>
            <Row style={{marginTop: 20}}>
                <Col style={{textAlign: 'right'}} {...keySpan}>在职状态：</Col>
                <Col style={{paddingLeft: 20}} {...ValueSpan}>{jobStatus == 1 ? '在职' : '离职'}</Col>
            </Row>
            <Row style={{marginTop: 20}}>
                <Col style={{textAlign: 'right'}} {...keySpan}>是否启用：</Col>
                <Col style={{paddingLeft: 20}} {...ValueSpan}>{enableStatus == 1 ? '启用' : '禁用'}</Col>
            </Row>
            <Row style={{marginTop: 20}}>
                <Col style={{textAlign: 'right'}} {...keySpan}>所属角色：</Col>
                <Col style={{paddingLeft: 20}} {...ValueSpan}>{userRoleName}</Col>
            </Row>
            <Row style={{marginTop: 20}}>
                <Col style={{textAlign: 'right'}} {...keySpan}>备注：</Col>
                <Col style={{paddingLeft: 20}} {...ValueSpan}>{remark}</Col>
            </Row>
            </Spin>
        </div>
    }
}

export default UserInfo