import React from 'react';
import {Table } from 'antd';

class resPaymentImport extends React.Component<any, any>{
    constructor(props) {
        super(props);
    }
    columns:[any] = [   
        {
            title: '出款单号',
            key: '出款单号',
            width: 120,
            fixed: 'left',
            render: () => '/',
        },
        {
            title: '请款平台',
            key: '请款平台',
            width: 100,
            render: () => '/',
        },
        {
            title: '支付方式',
            key: '支付方式',
            width: 100,
            render: () => '/',
        },
        {
            title: '支付状态',
            key: '支付状态',
            width: 100,
            render: () => '/',
        },
        {
            title: '客服计划付款时间倒计时',
            key: '客服计划付款时间倒计时',
            width: 200,
            render: () => '/',
        },
        {
            title: '财务计划支付时间',
            key: '财务计划支付时间',
            width: 160,
            render: () => '/',
        },
        {
            title: '客服计划付款时间',
            key: '客服计划付款时间',
            width: 160,
            render: () => '/',
        },
        {
            title: '创建时间',
            key: '创建时间',
            width: 100,
            render: () => '/',
        },
        {
            title: '最终出款时间',
            key: '最终出款时间',
            width: 150,
            render: () => '/',
        },
        {
            title: '收款方类型',
            key: '收款方类型',
            width: 120,
            render: () => '/',
        },
        {
            title: '收款方名称',
            key: '收款方名称',
            width: 120,
            render: () => '/',
        },
        {
            title: '对应请款单',
            key: '对应请款单',
            width: 120,
            render: () => '/',
        },
        {
            title: '请款单类型',
            key: '请款单类型',
            width: 120,
            render: () => '/',
        },
        {
            title: '出款金额（客服预估）',
            key: '出款金额（客服预估）',
            width: 180,
            render: () => '/',
        },
        {
            title: '出款金额（客服预估）',
            key: '出款金额（客服预估）',
            width: 180,
            render: () => '/',
        },
        {
            title: '出款金额（实付金额）',
            key: '出款金额（实付金额）',
            width: 180,
            render: () => '/',
        },
        {
            title: '社保缴费月（操作月）',
            key: '社保缴费月（操作月）',
            width: 180,
            render: () => '/',
        },
        {
            title: '请款提交人',
            key: '请款提交人',
            width: 120,
            render: () => '/',
        },
        {
            title: '审批经手人',
            key: '审批经手人',
            width: 120,
            render: () => '/',
        },
        {
            title: '状态（参保类型）',
            key: '状态（参保类型）',
            width: 140,
            render: () => '/',
        },
        {
            title: '对应收款项',
            key: '对应收款项',
            width: 120,
            render: () => '/',
        },
        {
            title: '打款备注',
            key: '打款备注',
            width: 100,
            render: () => '/',
        },
        {
            title: '业务备注',
            key: '业务备注',
            width: 100,
            render: () => '/',
        },
        {
            title: '操作',
            key: '操作',
            width: 140,
            fixed:'right',
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
                        }}>导入实缴账单</a>
                    </div>
                )
            },
        },
    ]
    render(){
        
        return (
            <Table 
                bordered 
                className='ant-table-wrapper-text-center' 
                columns={this.columns}
                pagination={this.props.pagination()}
                scroll={{
                    x: 3230
                }}
                dataSource={[{}]}
            />
        )
    }
}

export default resPaymentImport













