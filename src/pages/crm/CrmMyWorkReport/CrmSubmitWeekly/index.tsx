import React from 'react';
import {browserHistory} from 'react-router';
import {Modal, Spin} from 'antd';

import { DOMAIN_OXT } from "../../../../global/global";
import { fetchFn } from '../../../../util/fetch';

import SubmitWorkReportTemplate from '../../../../components/crm/WorkReportTemplate/SubmitWorkReportTemplate';

const getEntireAPI = `${DOMAIN_OXT}/apiv2_/crm/api/workReportSet/getById`;

const getEntire =  (id) => fetchFn(getEntireAPI, {id}).then(data=>data);

class CrmSubmitDaily extends React.Component<any, any>{
    constructor(props){
        super(props)
        this.state={
            loading: true,
            id: null,
            entire:{},
        }
    }

    async componentWillMount() {
        if(!this.props.location.state){
            Modal.error({
                title: '错误提示',
                content: '请重新从【工作报告】点击进入',
                onOk: () => {
                    browserHistory.push(`${DOMAIN_OXT}/newadmin/userinfo`);
                }
            });
            return ;
        }
        const id = this.props.location.state.id;
        const submit = this.props.location.state.submit;
        const day = this.props.location.state.day;
        await this.setState({id, submit, day});
        let res = await getEntire(id);
        document.querySelectorAll('.ant-breadcrumb .ant-breadcrumb-link > span')[0].innerHTML = submit ? '工作报告_提交丨周报' : '工作报告_查看丨周报';
        if(Number(res.status) === 0){
            this.setState({entire:res.data, loading: false});
        }
    }

    render(){
        return <div><Spin spinning={this.state.loading}>
            {!this.state.loading && <SubmitWorkReportTemplate 
                type='weekly'
                submit={this.state.submit}
                day={this.state.day}
                id={this.state.id ? this.state.entire.id : undefined}
                disabled={this.state.disabled}
                positionId={this.state.id ? this.state.entire.positionId : undefined}
                positionName={this.state.id ? this.state.entire.positionName : undefined}
                organizationId={this.state.id ? this.state.entire.organizationId : undefined}
                organizationName={this.state.id ? this.state.entire.organizationName : undefined}
                data={this.state.id ? JSON.parse(this.state.entire.content) : this.state.entire}
                deadLine={this.state.entire.deadLine}
                deadLineOfWeek={this.state.entire.deadLineOfWeek}
            />}
        </Spin></div>
    }
}

export default CrmSubmitDaily;