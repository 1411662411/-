import React from 'react';
import {Input, Card, Button, Divider, Spin } from 'antd';

import { DOMAIN_OXT } from "../../../global/global";
import { fetchFn } from "../../../util/fetch";
import { spawn } from 'redux-saga/effects';

const API = `${DOMAIN_OXT}/apiv2_/crm/api/module/customer/getCustomerDataForEditActivate`;
const ACTIVE_API = `${DOMAIN_OXT}/apiv2_/crm/api/module/customer/editActivateStatus`;

const getCustomer = (cName) => fetchFn(API, {cName}).then(data => data);
const changeActive = (id) => fetchFn(ACTIVE_API, {id}).then(data => data);

export default class CustomerActive extends React.Component<any,any>{
    constructor(props) {
        super(props);
        this.state={
            cName: '',
            data: null,
            loading: false,
        }
    }

    search = async() => {
        this.setState({loading: true});
        const res = await getCustomer(this.state.cName);
        if(Number(res.status) === 0){
            this.setState({
                data: res.data,
                loading: false,
            })
        }else{
            this.setState({
                data: null,
                loading: false,
            })
        }
    }

    changeActive = async() => {
        this.setState({loading: true});
        const res = await changeActive(this.state.data.id);
        if(Number(res.status) === 0){
            this.search();
        }
    }

    render() {
        const {data} = this.state;
        return (
            <div>
                <Spin
                    spinning={this.state.loading}
                >
                <div>
                    <span>请输入完整的客户名称：</span>     
                    <span style={{display: 'inline-block', width: 240, marginRight: 15}}><Input value={this.state.cName} onChange={(e) => {e.preventDefault(); this.setState({cName: e.target.value})}} placeholder='请输入完整的客户名称'/></span>
                    <Button type='primary' onClick={this.search}>搜索</Button>
                </div>
                <Divider />
                <div>
                {
                    data && data.cName && <Card 
                        title={data.cName} 
                        extra={data.isActivate === '已激活' ? <span style={{color: '#999', cursor: 'not-allowed'}}>修改激活状态</span> : <a onClick={this.changeActive} href="#">修改激活状态</a>} 
                        style={{ width: 300 }}
                    >
                        <p style={{fontSize: 14, marginBottom: 8}}><span style={{display:'inline-block', width: 90, textAlign: 'right'}}>客户名称：</span>{data.cName}</p>
                        <p style={{fontSize: 14, marginBottom: 8}}><span style={{display:'inline-block', width: 90, textAlign: 'right'}}>客户ID：</span>{data.id}</p>
                        <p style={{fontSize: 14, marginBottom: 8}}><span style={{display:'inline-block', width: 90, textAlign: 'right'}}>所属销售：</span>{data.salesName}</p>
                        <p style={{fontSize: 14, marginBottom: 8}}><span style={{display:'inline-block', width: 90, textAlign: 'right'}}>激活状态：</span>{data.isActivate}</p>
                    </Card>
                }

                </div>
                </Spin>
            </div>
        );
    }
}