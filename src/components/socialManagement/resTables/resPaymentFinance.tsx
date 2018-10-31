import React from 'react';
import {Table } from 'antd';
import  '../../../css/socialManagement/lanchConfirm.less';

class resPaymentFinance extends React.Component<any, any>{
    constructor(props) {
        super(props);
      
    }
    columns = [   
        {
            title: '出款单号',
            key: '出款单号',
            render: () => 'h20180728001  ^',
        },
        {
            title: '请款平台',
            key: '请款平台',
            render: () => '/',
        },
        {
            title: '支付方式',
            key: '支付方式',
            render: () => '银行转账',
        },
        {
            title: '支付状态',
            key: '支付状态',
            render: () => '未支付',
        },
        {
            title: '付款金额（实际付款）',
            key: '付款金额（实际付款）',
            render: () => '12000.00',
        },
        {
            title: '财务计划支付时间',
            key: '财务计划支付时间',
            render: () => '2018-07-12 12:12:12',
        },
        {
            title: '收款方类型',
            key: '收款方类型',
            render: () => '服务商',
        },
        {
            title: '收款方名称',
            key: '收款方名称',
            render: () => '浙江中通文博服务有限公司',
        },
        {
            title: '收款方账号',
            key: '收款方账号',
            render: () => '571906919210901',
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
            title: '操作',
            key: '操作',
            render: () => <a style={{ marginRight: 5 }} href="" onClick={(e) =>{
                e.preventDefault();
                e.stopPropagation() 
            }}>查看出款单</a>,
        },
    ]

    subColumns = [   
        {
            title: '对应出款单号',
            key: '对应出款单号',
            render: () => 'sp20180723002-01',
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
                        <a style={{ marginRight: 5 }} href="" onClick={(e) =>{
                            e.preventDefault();
                            e.stopPropagation() 
                        }}>查看出款单</a>
                        <br/> 
                        <a style={{ marginRight: 5 }} href="" onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation()         
                            this.setState({
                                // visibleLanch: true,
                            })
                        }}>查看对应出款单</a>
                    </div>
                )
            },
        },
    ]

    render(){
        return (
            <Table  
                className='ant-table-wrapper-text-center'  
                columns={this.columns}
                dataSource={[{}]}
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

export default resPaymentFinance













