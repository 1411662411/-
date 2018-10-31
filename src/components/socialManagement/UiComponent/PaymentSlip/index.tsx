import React from 'react';
import {Modal, Button} from 'antd';
import Table from '../../../Table';

interface PaymentSlipProps{
    visible: boolean;
    close: () => void;
    data?: any;
}
export default class PaymentSlip extends React.Component<PaymentSlipProps>{
    constructor(props) {
        super(props);
    }

    render(){
        return <Modal
            title="查看出款单"
            width={900}
            visible={this.props.visible}
            onCancel={this.props.close}
            footer={<div style={{textAlign: 'center'}}><Button onClick={this.props.close}>关闭</Button></div> }
        >
            <Table 
                dataSource={[
                    {
                        label: '出款单号',
                        value: '',
                    },
                    {
                        label: '付款金额（实际付款）',
                        value: '',
                    },
                    {
                        label: '支付方式',
                        value: '',
                    },
                    {
                        label: '支付状态',
                        value: '',
                    },
                    {
                        label: '付款方名称',
                        value: '',
                        isAll: true,
                    },
                    {
                        label: '付款方开户行',
                        value: '',
                    },
                    {
                        label: '付款方账号',
                        value: '',
                    },
                    {
                        label: '收款方名称',
                        value: '',
                        isAll: true,
                    },
                    {
                        label: '收款方开户行',
                        value: '',
                    },
                    {
                        label: '收款方账号',
                        value: '',
                    },
                    {
                        label: '业务方计划支付时间',
                        value: '',
                    },
                    {
                        label: '财务计划支付时间',
                        value: '',
                    },
                    {
                        label: '打款备注',
                        value: '',
                    },
                    {
                        label: '业务备注',
                        value: '',
                    },
                    {
                        label: '付款流水号',
                        value: '',
                    },
                    {
                        label: '付款时间',
                        value: '',
                    },
                    {
                        label: '附件',
                        value: '',
                    },
                ]}
            />
        </Modal>
    }
}