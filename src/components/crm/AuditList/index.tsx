import React from 'react'
import { connect } from 'react-redux';
import { Tabs, List, Button, Spin } from 'antd'

import {DOMAIN_OXT} from "../../../global/global";

import noMsg from '../../../images/no-msg.png'
import './style.less'

const TabPane = Tabs.TabPane;

import CustomerReport from '../CustomerReport'
import NotDivideReport from '../CustomerReport/notDivideReport'
import RenotDivideReport from '../CustomerReport/reNotDivideReport'

import {
    getWillAuditList,
    getDidAuditList
} from '../../../action/crm/Workbench'

interface AuditListProps{
    willAuditList: any[] | null | undefined;
    didAuditList: any[] | null | undefined;
    dispatch: any;
    type?: 'none';
}


class AuditList extends React.Component<AuditListProps, any>{
    constructor(props) {
        super(props);
        this.state = {
            notVisible: false,//不分成审批
            reportVisible: false,//重新发起报备
            reNotVisible: false,//重新发起不分成
            resItem: null,
            modalNumber: 0,
            isLoading: false,
            willDefaultAuditList: [
                {
                    'createTimeString': '2017-04-24 10:17:27',
                    'cname': '这是你的待审批事件',
                    'auditButton': 1,
                    'dataType': 1,
                },
                {
                    'createTimeString': '2017-04-24 10:17:27',
                    'cname': '这是你的待审批事件',
                    'auditButton': 1,
                    'dataType': 1,
                },
                {
                    'createTimeString': '2017-04-24 10:17:27',
                    'cname': '这是你的待审批事件',
                    'auditButton': 1,
                    'dataType': 1,
                },
                {
                    'createTimeString': '2017-04-24 10:17:27',
                    'cname': '这是你的待审批事件',
                    'auditButton': 1,
                    'dataType': 1,
                },
            ],
        }
    }

    componentWillMount(){
        if(this.props.type === 'none'){

        }else{
            this.props.dispatch(getWillAuditList({type: 1}))
            this.props.dispatch(getDidAuditList({type: 2}))
        }
    }

    toggleReportVisible(e, item){
        if(item){
            this.setState({
                reportVisible: !this.state.reportVisible,
                resItem: item,
                modalNumber: this.state.modalNumber + 1
            })
        }else{
            this.setState({
                reportVisible: !this.state.reportVisible,
            })
        }
        this.setState({
            isLoading: this.state.reportVisible ? false : true,
        })
    }

    toggleNotVisible(e, item){
        if(item){
            this.setState({
                notVisible: !this.state.notVisible,
                resItem: item,
                modalNumber: this.state.modalNumber + 1
            })
        }else{
            this.setState({
                notVisible: !this.state.notVisible
            })
        }
        this.setState({
            isLoading: this.state.notVisible ? false : true,
        })
    }

    toggleReNotVisible(e, item){
        if(item){
            this.setState({
                reNotVisible: !this.state.reNotVisible,
                resItem: item,
                modalNumber: this.state.modalNumber + 1
            })
        }else{
            this.setState({
                reNotVisible: !this.state.reNotVisible
            })
        }
        this.setState({
            isLoading: this.state.reNotVisible ? false : true,
        })
    }

    auditWillSuccessCallback(){
        this.props.dispatch(getWillAuditList({type: 1}))
        this.setState({
            isLoading: false,
        })
    }

    auditDidSuccessCallback(){
        this.props.dispatch(getDidAuditList({type: 2}))
        this.setState({
            isLoading: false,
        })
    }

    switchHref(item) {
        if(Number(item.auditButton) === 1){
            switch(Number(item.dataType)){
                case 1: {
                    return <Button type="primary" size="small" href={`${DOMAIN_OXT}/crm/background/customermanagement/customertransferexamine`} target="_blank">审批</Button>
                }
                case 2: {
                    return <Button type="primary" size="small" href={`${DOMAIN_OXT}/crm/background/customermanagement/customerreport?tab=2`} target="_blank">审批</Button>
                }
                case 3: {
                    return <Button type="primary" size="small" onClick={(e) => this.toggleNotVisible(e, item)}>审批</Button>
                }
                default:{
                    return '';
                }
            }
        }else{
            return '';
        }
    }

    switchAction(item) {
        if(Number(item.auditStatus) === 3 && Number(item.auditButton) === 0){
            switch(Number(item.dataType)){
                //重新发起转移
                case 1: {
                    return <Button type="primary" size="small" href={`${DOMAIN_OXT}/crm/background/customermanagement/customerintention`} target="_blank">重新发起</Button>
                }
                //重新发起报备
                case 2: {
                    return <Button type="primary" size="small" onClick={(e) => this.toggleReportVisible(e, item)}>重新发起</Button>
                }
                //重新发起不分成报备
                case 3: {
                    return <Button type="primary" size="small" onClick={(e) => this.toggleReNotVisible(e, item)}>重新发起</Button>
                }
                //资质文件变更
                case 4: {
                    return <Button type="primary" size="small" href={`${DOMAIN_OXT}/crm/background/customermanagement/customerCooperationDetail?id=${item.customerId}`} target="_blank">重新发起</Button>
                }
                //合同修正
                case 5: {
                    return <Button type="primary" size="small" href={`${DOMAIN_OXT}/crm/background/contractmanagement/contractDetailforSalesUpdate?id=${item.contractId}`} target="_blank">重新发起</Button>
                }
                //补充协议修正
                case 6: {
                    return <Button type="primary" size="small" href={`${DOMAIN_OXT}/crm/background/contractmanagement/contracts?tab=2`} target="_blank">重新发起</Button>
                }
                default:{
                    return item.auditStatusString;
                }
            }
        }else{
            if(Number(item.auditStatus) === 3){
                return '';
            }else{
                return '已通过';
            }
        }
    }

    render() {
        const {
            willAuditList,
            didAuditList
        } = this.props;
        const {
            resItem,
            notVisible,
            reportVisible,
            reNotVisible,
            modalNumber,
        } = this.state;

        return (
            <div className="audit-list">
            <Spin tip="Loading..." spinning={this.state.isLoading}>
                <div>
                    <Tabs defaultActiveKey="1">
                        {
                        (!willAuditList || willAuditList.length === 0) && this.props.type !== 'none' ? <TabPane tab="待审批" key="1">
                        <div className='text-center' style={{paddingTop:20}}>
                            <img src={noMsg} alt=""/>
                            </div>
                        </TabPane>
                        :
                        <TabPane tab="待审批" key="1">
                            <List
                                size="small"
                                dataSource={this.props.type === 'none' ? this.state.willDefaultAuditList : willAuditList}
                                renderItem={item => (
                                    <List.Item actions={[this.switchHref(item)]}>
                                        {item.createTimeString} {item.dataTypeString}{item.name}：{item.cname}
                                    </List.Item>
                                )}
                            />
                        </TabPane>
                        }
                        {
                        !didAuditList  || didAuditList.length === 0 ? <TabPane tab="已审批" key="2">
                        <div className='text-center' style={{paddingTop:20}}>
                            <img src={noMsg} alt=""/>
                        </div>
                        </TabPane>
                        :
                        <TabPane tab="已审批" key="2">
                            <List
                                size="small"
                                dataSource={didAuditList}
                                renderItem={item => (
                                    <List.Item actions={[this.switchAction(item)]}>
                                        {item.auditTimeString} {item.dataTypeString}{item.name}：{item.cname} {item.auditStatus === 3 ? <span className="text-success">[{item.auditStatusString}]</span> : ''}
                                    </List.Item>
                                )}
                            />
                        </TabPane>
                        }
                    </Tabs>
                    
                    <NotDivideReport
                        key={modalNumber}
                        modalNumber={modalNumber}
                        visible={notVisible}
                        resItem={resItem}
                        toggleNotVisible={(e, item) => {this.toggleNotVisible(e, item)}}
                        auditWillSuccessCallback={() => {this.auditWillSuccessCallback()}}
                    />
                    
                    <CustomerReport
                        key={modalNumber}
                        modalNumber={modalNumber}
                        isReject= {true}
                        visible={reportVisible}
                        resItem={resItem}
                        toggleReportVisible={(e, item) => {this.toggleReportVisible(e, item)}}
                        auditDidSuccessCallback={() => {this.auditDidSuccessCallback()}}
                    />

                    <RenotDivideReport
                        key={modalNumber}
                        modalNumber={modalNumber}
                        visible={reNotVisible}
                        resItem={resItem}
                        toggleReNotVisible={(e, item) => {this.toggleReNotVisible(e, item)}}
                        auditDidSuccessCallback={() => {this.auditDidSuccessCallback()}}
                    />
                </div>
                </Spin>
            </div>
        )
    }
}

interface TStateProps {
    willAuditList: any[];
    didAuditList: any[];
}

const mapStateToProps = (state: any, ownProps): TStateProps => {
	return {
        willAuditList: state.getIn(['crmWorkbench', 'willAuditList']).toJS(),
        didAuditList: state.getIn(['crmWorkbench', 'didAuditList']).toJS(),
        ...ownProps,
	}
}
const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		dispatch,
	}
}

export default connect(mapStateToProps)(AuditList)