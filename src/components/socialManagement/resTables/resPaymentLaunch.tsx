import React from 'react';
import { Table,Button,Modal,message  } from 'antd';
import WhiteSpace from '../../../components/common/WhiteSpace';
import { dataLoadingRecieve } from '../../../action/website/websiteAction';
import LanchList from './launchList';
import LanchConfirm from './launchConfirm';
import { statePaginationConfig, mapCurrentPageToStart, } from '../../../util/pagination';
import  '../../../css/socialManagement/lanchConfirm.less';

class ResPaymentLaunch extends React.Component<any, any>{
    constructor(props:any) {
        super(props);
        this.state={
            selectedRowKeys: [], // 全选 和 单选
            disable:true,
            itemValue:[],
        }
    }
    columns:[any] = [   
        {
            title: '出款单号',
            key: '出款单号',
            width: 140,
            fixed: 'left',
            render: (data, row, index) => {
                return <a href="javascript:;">{data.code}</a>;
            }
        },
        {
            title: '请款平台',
            key: '请款平台',
            width: 100,
            fixed: 'left',
            render: (data) =>{
                return data.platformString;
            },
        },
        {
            title: '支付方式',
            key: '支付方式',
            width: 100,
            render: (data) =>{
                return data.payTypeString;
            },
        },
        {
            title: '支付状态',
            key: '支付状态',
            width: 100,
            render: (data) =>{
                return data.payStatusString;
            },
        },
        {
            title: '财务计划付款时间倒计时',
            key: '财务计划付款时间倒计时',
            width: 200,
            render: (data) =>{
                return <span style={{color:'red',}}>{data.financePlanPayTimeLeftDay}</span>;
            },
        },
        {
            title: '财务计划支付时间',
            key: '财务计划支付时间',
            width: 160,
            render: (data) => {
                return data.financePlanPayTimeString;
            },
        },
        {
            title: '业务方计划支付时间',
            key: '业务方计划支付时间',
            width: 160,
            render: (data) => {
                return data.businessPlanPayTimeString;
            },
        },
        {
            title: '创建时间',
            key: '创建时间',
            width: 100,
            render: (data) => {
                return data.requestCreateTimeString;
            },
        },
        {
            title: '收款方类型',
            key: '收款方类型',
            width: 100,
            render: (data) => {
                return data.receiverTypeString;
            },
        },
        {
            title: '收款方名称',
            key: '收款方名称',
            width: 110,
            render: (data) => {
                return data.receiverName;
            },
        },
        {
            title: '收款方账号',
            key: '收款方账号',
            width: 110,
            render: (data) => {
                return data.receiverAccount;
            },
        },
        {
            title: '对应请款单',
            key: '对应请款单',
            width: 110,
            render: (data) => {
                return data.requestCode;
            },
        },
        {
            title: '请款单类型',
            key: '请款单类型',
            width: 110,
            render: (data) => {
                return data.requestTypeString;
            },
        },
        {
            title: '付款金额（客服预估）',
            key: '付款金额（客服预估）',
            width: 180,
            render: (data) => {
                return <span style={{color:'red',}}>{data.estimateAmount}</span>;
            },
        },
        {
            title: '社保缴费月（操作月）',
            key: '社保缴费月（操作月）',
            width: 200,
            render: (data) => {
                return data.socialPayMonth;
            },
        },
        {
            title: '请款提交人',
            key: '请款提交人',
            width: 120,
            render: (data) => {
                return data.requestSubmitUser;
            },
        },
        {
            title: '审批经手人',
            key: '审批经手人',
            width: 120,
            render: (data) => {
                return data.approver;
            },
        },
        {
            title: '状态（参保类型）',
            key: '状态（参保类型）',
            width: 140,
            render: (data) => {
                return data.insuredStatus;
            },
        },
        {
            title: '对应收款项',
            key: '对应收款项',
            width: 110,
            render: (data) => {
                return data.insuredItem;
            },
        },
        {
            title: '打款备注',
            key: '打款备注',
            width: 100,
            render: (data) => {
                return data.paymentRemark;
            },
        },
        {
            title: '业务备注',
            key: '业务备注',
            width: 100,
            render: (data) => {
                return data.businessRemark;
            },
        },
        {
            title: '操作',
            key: '操作',
            width: 160,
            fixed: 'right',
            render: (data,row,index) => {
                return (
                    <div>
                        <a id={data.id} style={{ marginRight: 5 }} href="" onClick={(e) =>{
                            e.preventDefault();
                            e.stopPropagation(); 
                            this.props.handleResPaymentDetail(data.id);//查看出款单详情
                        }}>查看出款单</a>
                        <br/> 
                        <a id={data.id} style={{ marginRight: 5 }} href="" onClick={(e) => { 
                            e.preventDefault();
                            e.stopPropagation();
                            this.setState({
                                itemValue:[row],
                            })
                            this.props.handleCombineLanch();//显示发起出款弹框列表
                        }}>发起出款</a>
                    </div>
                )
            },
        },
    ]
    onSelectChange = (selectedRowKeys,itemValue) => {
        this.setState({
            disable:true,
            selectedRowKeys,
        });
        if(selectedRowKeys.length > 0){
            this.setState({
                disable:false, //按钮显示出来
                itemValue:itemValue, //[{},{},{}]
            });
        }
        // console.log(selectedRowKeys,itemValue);  // [0,1,2]   [{},{},{}]
    }

   
    render(){
        const { dataSource,handleOk,handleCancel,handleOkConfirm,handleModifyConfirm,handleCombineLanch,visibleLanch,visibleConfirm} = this.props;
        const{ disable,selectedRowKeys,itemValue} = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        return (
            <div>
                <Button type='primary' disabled={disable} onClick={(e)=>{
                    e.preventDefault();
                    e.stopPropagation(); 
                    if(selectedRowKeys.length > 0){
                       handleCombineLanch(); //弹框显示
                    } 
                }}>合并发起出款</Button> 
                <WhiteSpace />    
                <Table  
                    bordered 
                    rowSelection={rowSelection} //多选框
                    className='ant-table-wrapper-text-center'  
                    columns={this.columns}
                    scroll={{ x: 2830 }}
                    dataSource={dataSource}
                    pagination={this.props.pagination()}
                />
                <Modal
                    key={Date.now()}
                    title="发起出款"
                    width={1000}
                    visible={visibleLanch}
                    closable={false}
                    onOk={handleOk}
                    onCancel={handleCancel}
                >
                    <LanchList  key={Date.now()} resPaymentSource={itemValue} />
                </Modal>

                <Modal
                    title="请再次确认"
                    visible={visibleConfirm}
                    closable={false}
                    cancelText='返回修改'
                    onOk={()=>{
                        handleOkConfirm(this.state.itemValue);
                    }}
                    onCancel={handleModifyConfirm}
                >
                    <LanchConfirm resPaymentSource={itemValue} /> {/* 打钩的选项列表  */}
                   
                   
                </Modal>
         </div>
        )
    }
}

export default ResPaymentLaunch













