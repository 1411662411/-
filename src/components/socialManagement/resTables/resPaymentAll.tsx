import React from 'react';
import { Table,Icon } from 'antd';
import { statePaginationConfig, mapCurrentPageToStart, } from '../../../util/pagination';
import Text from '../../common/Text';
import  '../../../css/socialManagement/lanchConfirm.less';

class ResPaymentAll extends React.Component<any, any>{
    constructor(props) {
        super(props);
    }
    columns:[any] = [   
        {
            title: '出款单号',
            key: '出款单号',
            render: (data,row,index) => {
                return (
                    <div>
                        <a id={data.id} style={{ marginRight: 5 }} href="javascript:;" >{data.code}</a>

                        {
                            data.mergeParentId>0?<Icon type="down" style={{ color:'#22baa0'}} onClick={(e) =>{
                                e.preventDefault();
                                e.stopPropagation();
                                console.log(1);
                            }} />:null

                            
                        }

                        
                        
                    </div>
                )
            },
        },
        {
            title: '请款平台',
            key: '请款平台',
            render: (data,row,index) =>{
                return data.platformString;
            },
        },
        {
            title: '支付方式',
            key: '支付方式',
            render: (data,row,index) =>{
                return data.payTypeString;
            },
        },
        {
            title: '支付状态',
            key: '支付状态',
            render: (data,row,index) =>{
                return data.payStatusString;
            },
        },
        {
            title: '付款金额（实际金额）',
            key: '付款金额（实际金额）',
            render: (data, row, index) => {
                return <Text color='red'>{1500}</Text> ;
                // return <Text color='red'><span style={{fontWeight:700}}>{this.state.amount}</span></Text> ;
            },
        },
        {
            title: '财务计划支付时间',
            key: '财务计划支付时间',
            render: (data,row,index) => {
                return data.financePlanPayTimeString;
            },
        },
        {
            title: '收款方类型',
            key: '收款方类型',
            render: (data,row,index) => {
                return data.receiverTypeString;
            },
        },
        {
            title: '收款方名称',
            key: '收款方名称',
            render: (data,row,index) => {
                return data.receiverName;
            },
        },
        {
            title: '打款备注',
            key: '打款备注',
            render: (data,row,index) => {
                return data.paymentRemark;
            },
        },
        {
            title: '业务备注',
            key: '业务备注',
            render: (data,row,index) => {
                return data.businessRemark;
            },
        },
        {
            title: '操作',
            key: '操作',
            render: (data,row,index) => <a style={{ marginRight: 5 }} href="" onClick={(e) =>{
                e.preventDefault();
                e.stopPropagation();

            }}>查看出款单</a>,
        },
    ]
    subColumns:[any] = [   
        {
            title: '对应出款单号',
            key: '对应出款单号',
            render: () => 'sp20180723002-01 ',
        },
        {
            title: '财务计划付款时间倒计时',
            key: '财务计划付款时间倒计时',
            render: () => '/',
        },
        {
            title: '财务计划支付时间',
            key: '财务计划支付时间',
            render: () => '银行转账',
        },
        {
            title: '业务方计划支付时间',
            key: '业务方计划支付时间',
            render: () => '未支付',
        },
        {
            title: '创建时间',
            key: '创建时间',
            render: () => '12000.00',
        },
        {
            title: '对应请款单',
            key: '对应请款单',
            render: () => '2018-07-12 12:12:12',
        },
        {
            title: '请款单类型',
            key: '请款单类型',
            render: () => '服务商',
        },
        {
            title: '付款金额（客服预估）',
            key: '付款金额（客服预估）',
            render: () => '浙江中通文博服务有限公司',
        },
        {
            title: '付款金额（实际付款）',
            key: '付款金额（实际付款）',
            render: () => '571906919210901',
        },
        {
            title: '社保缴费月（操作月）',
            key: '社保缴费月（操作月）',
            render: () => '/',
        },
        {
            title: '打款备注',
            key: '打款备注',
            render: () => '/',
        },
        {
            title: '业务备注',
            key: '业务备注',
            render: () => '与 sp20180722002-01 合并打款',
        },
        {
            title: '审批经手人',
            key: '审批经手人',
            render: () => 'CEO',
        },
        {
            title: '状态（参保类型）',
            key: '状态（参保类型）',
            render: () => '/',
        }, 
        {
            title: '对应收款项',
            key: '对应收款项',
            render: () => '/',
        },
        {
            title: '操作',
            key: '操作',
            render: () => {
                return (
                    <div>
                        <a style={{ marginRight: 5 }} href="" onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation()         
                            this.setState({
                                // visibleLanch: true,
                            })
                        }}>查看对应请款单</a>
                    </div>
                )
            },
        },
    ]

    render(){
        const { dataSource,} = this.props;
        console.log(dataSource)
        return (
            <Table  
                className='ant-table-wrapper-text-center' 
                columns={this.columns}
                dataSource={dataSource}
                pagination={this.props.pagination()}
                expandedRowRender={() => 
                    <Table 
                        className='tableHead components-table-demo-nested'
                        pagination={false}
                        columns={this.subColumns}
                        dataSource={[{}]}
                    />
                }
            />
        )
    }
}

export default ResPaymentAll













