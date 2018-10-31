import React from 'react';

import { Progress, Modal, Spin } from 'antd'

import Table from './SalesHelperTable'
import AddFollowRecord from '../FollowRecord/AddFollowRecord'

import {
    getSalesHelperApi,
    getSalesHelperTableApi,
} from '../../../api/crm/Workbench'

import noPng from "../../../images/no-msg.png"

import './style.less'

class SalesHelper extends React.Component<any,any>{
    constructor(props){
        super(props)
        this.state = {
            visible: false,
            addVisible:false,
            claimSet:null, 
            customerCount:null,
            notFollowUpData:null,
            notSignContractData:null,
            recentlyNotFollowUpData:null,
            releaseDataType:0,
            loading: false,
            none: false,
        }
    }
    toggleAddVisible(){
        this.setState({addVisible: !this.state.addVisible})
    }
    renderHelper({
        num, 
        text, 
        prompt,
        onClick,
        calendar,
    }){
        return <div className='crm-salesHelper-card'>
            <div className='crm-salesHelper-card-text'>
                <p>{text}</p>
                <div className='text-small'>将在<span className='text-error'>{prompt}个{calendar}</span>内释放至公海池</div>
            </div>
            <div style={{cursor: num === '0' ? 'default' : 'pointer'}} onClick={num === '0' ? () =>{}:onClick} className='crm-salesHelper-card-number'>
                {num}
            </div>
        </div>
    }

    renderProgress({customerCount, claimSet}){
        return <div className='crm-salesHelper-progress'>
            {
                customerCount && <div>
                    <div>
                        未签约客户库容
                        <span className='rt'>{customerCount.count}/{customerCount.privateCustomerNumberSet}</span>
                    </div>
                    <Progress 
                        status={customerCount.count/customerCount.privateCustomerNumberSet >= 1 ? 'exception' : 'success'} 
                        percent={customerCount.count/customerCount.privateCustomerNumberSet*100} 
                        showInfo={false} 
                    />
                </div>
            }
            {
                claimSet && <div className='text-small'>
                    <div>注：</div>
                    {claimSet.salesClaimSet && <div>{claimSet.salesClaimSet}</div>}
                    {claimSet.systemClaimSet &&  <div>{claimSet.systemClaimSet}</div>}
                </div>
            }
        </div>
    }

    openModal(releaseDataType){
        this.setState({
            releaseDataType,
            visible: true,
        })
    }

    handleOk(){
        this.setState({
            visible: false,
        })
    }

    handleCancel(){
        this.setState({
            visible: false,
        })
        this.init();
    }

    async init(){
        this.setState({loading: true})
        let res:any = await getSalesHelperApi()
        if(res.errcode === 0){
            let { 
                claimSet, 
                customerCount,
                notFollowUpData,
                notSignContractData,
                recentlyNotFollowUpData,
            } = res.data;
            if(!claimSet && !customerCount && !notFollowUpData && !notSignContractData && !recentlyNotFollowUpData){
                this.setState({none: true})
            }else{
                this.setState({none: false})
            }
            this.setState({
                claimSet : claimSet || null, 
                customerCount,
                notFollowUpData,
                notSignContractData,
                recentlyNotFollowUpData,
                loading: false,
            })
        }
    }

    async componentWillMount(){
        // console.log(321)
        if(this.props.type === 'none'){  //编辑时假数据
            this.setState({
                claimSet: {
                    salesClaimSet: "自己释放至公海的客户a个工作日后释放不能认领 ",
                    systemClaimSet: "系统释放至公海的客户b个工作日后释放不能认领 ",
                }, 
                customerCount: {
                    count: 100,
                    privateCustomerNumberSet: 100,
                },
                notFollowUpData: {
                    calendar:"工作日",
                    count:"m",
                    releaseDay:'a',
                    releaseRemindDay: 'n',
                },
                notSignContractData: {
                    calendar:"工作日",
                    count:"m",
                    releaseDay:'a',
                    releaseRemindDay: 'n',
                },
                recentlyNotFollowUpData: {
                    calendar:"工作日",
                    count:"m",
                    releaseDay:'a',
                    releaseRemindDay: 'n',
                },
            })
        }else{
            this.init();
        }
    }

    render(){

        const {
            addVisible,
            visible,
            releaseDataType,
            claimSet, 
            customerCount,
            notFollowUpData,        //未跟进
            notSignContractData,    //未签约
            recentlyNotFollowUpData, //最近未跟进
        } = this.state;

        const content1 = notFollowUpData && notFollowUpData.releaseDay ? this.renderHelper({
            num:notFollowUpData.count, 
            text:`获取后超过${notFollowUpData.releaseDay}个${notFollowUpData.calendar}未跟进的客户`, 
            calendar: notFollowUpData.calendar,
            prompt:notFollowUpData.releaseRemindDay, 
            onClick:()=>{this.openModal(1)}
        }) : '';
        const content2 = recentlyNotFollowUpData && recentlyNotFollowUpData.releaseDay ? this.renderHelper({
            num:recentlyNotFollowUpData.count, 
            text:`距上次跟进超过${recentlyNotFollowUpData.releaseDay}个${recentlyNotFollowUpData.calendar}未跟进的客户`, 
            calendar: recentlyNotFollowUpData.calendar,
            prompt:recentlyNotFollowUpData.releaseRemindDay, 
            onClick:()=>{this.openModal(2)}
        }) : '';
        const content3 = notSignContractData && notSignContractData.releaseDay ? this.renderHelper({
            num:notSignContractData.count, 
            text:`获取后超过${notSignContractData.releaseDay}个${notSignContractData.calendar}未签约的客户`, 
            calendar: notSignContractData.calendar,
            prompt:notSignContractData.releaseRemindDay, 
            onClick:()=>{this.openModal(3)}
        }) : '';
        const progress = this.renderProgress({customerCount, claimSet});
        return <div className='crm-salesHelper'>
            {
                this.state.none ? <div className='text-center' style={{paddingTop:20}}>
                <img src={noPng} alt=""/>
            </div> : <Spin
                spinning={this.state.loading}
            >
            {content1}
            {content2}
            {content3}
            {progress}
            <Modal
                title="即将释放的客户"
                width = {750}
                visible={visible}
                onCancel={()=>{this.handleCancel()}}
                footer={null}
            >
                {visible && <Table 
                    getData={getSalesHelperTableApi}
                    type={releaseDataType}
                />
                }
            </Modal>
            </Spin>
            }
        </div>
    }
}


export default SalesHelper