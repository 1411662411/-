import React from 'react';
import { Card, Input, Menu, Dropdown, Icon, Button, Table, Radio } from 'antd';

import WhiteSpace from '../../../common/WhiteSpace';
import {Pagination} from '../../../../util/crmUtil';
import {
    columnsCustomer, //付款清单（客户维度）
    columnsAdvance,     //垫款明细
    columnsPersonMonthNum,  //付款账单（人月次维度明细表）
} from '../../../common/columns/paymentBillColumns';

import './index.less';

interface PaymentBillProps{
    isSp?: boolean;
    hasAdvance?: boolean;
    onAdvanceChange?: (value:boolean) => void;

    type?: 1 | 2 | 3; //1付款账单（人月次维度明细表）  2付款清单（客户维度） 3付款账单（人月次维度明细表）
}
class PaymentBill extends React.Component<PaymentBillProps,any>{
    constructor(props) {
        super(props);
        this.state={
            total: 0,
            current: 1,
            pageSize: 20,
        }
    }

    columns = [
        [
            {
                title: '序号',
                key: 'index',
                render: () => {
                    return '/'
                }
            },
            {
                title: '姓名',
                dataIndex: 'name',
                key: 'name',
                render: () => {
                    return '/'
                }
            },
            {
                title: '证件号码',
                dataIndex: '证件号码',
                key: '证件号码',
                render: () => {
                    return '/'
                }
            },
            {
                title: '参保地',
                dataIndex: '参保地',
                key: '参保地',
                render: () => {
                    return '/'
                }
            },
            {
                title: '社保参保类型',
                dataIndex: '社保参保类型',
                key: '社保参保类型',
                render: () => {
                    return '/'
                }
            },
            {
                title: '公积金缴纳类型',
                dataIndex: '公积金缴纳类型',
                key: '公积金缴纳类型',
                render: () => {
                    return '/'
                }
            },
            {
                title: '社保缴纳月（费用所属月）',
                dataIndex: '社保缴纳月（费用所属月）',
                key: '社保缴纳月（费用所属月）',
                render: () => {
                    return '/'
                }
            },
            {
                title: '公积金缴纳月（费用所属月）',
                dataIndex: '公积金缴纳月（费用所属月）',
                key: '公积金缴纳月（费用所属月）',
                render: () => {
                    return '/'
                }
            },
            {
                title: '社保合计(元)',
                dataIndex: '社保合计(元)',
                key: '社保合计(元)',
                render: () => {
                    return '/'
                }
            },
            {
                title: '公积金合计(元)',
                dataIndex: '公积金合计(元)',
                key: '公积金合计(元)',
                render: () => {
                    return '/'
                }
            },
            {
                title: '总计（元）',
                dataIndex: '总计（元）',
                key: '总计（元）',
                render: () => {
                    return '/'
                }
            },
        ],
        [   // 付款清单 （客户维度） sp
            {
                title: '序号',
                key: 'index',
                render: () => {
                    return '/'
                }
            },
            {
                title: '单位名称',
                dataIndex: 'name',
                key: 'name',
                render: () => {
                    return '/'
                }
            },
            {
                title: '客服',
                dataIndex: '客服',
                key: '客服',
                render: () => {
                    return '/'
                }
            },
            {
                title: '分公司',
                dataIndex: '分公司',
                key: '分公司',
                render: () => {
                    return '/'
                }
            },
            {
                title: '销售',
                dataIndex: '销售',
                key: '销售',
                render: () => {
                    return '/'
                }
            },
            {
                title: '客户到款日',
                dataIndex: '客户到款日',
                key: '客户到款日',
                render: () => {
                    return '/'
                }
            },
            {
                title: '月份',
                dataIndex: '月份',
                key: '月份',
                render: () => {
                    return '/'
                }
            },
            {
                title: '参保城市',
                dataIndex: '参保城市',
                key: '参保城市',
                render: () => {
                    return '/'
                }
            },
            {
                title: '人数',
                dataIndex: '人数',
                key: '人数',
                render: () => {
                    return '/'
                }
            },
            {
                title: '人次',
                dataIndex: '人次',
                key: '人次',
                render: () => {
                    return '/'
                }
            },
            {
                title: '社保',
                dataIndex: '社保',
                key: '社保',
                render: () => {
                    return '/'
                }
            },
            {
                title: '公积金',
                dataIndex: '公积金',
                key: '公积金',
                render: () => {
                    return '/'
                }
            },
            {
                title: '残障金',
                dataIndex: '残障金',
                key: '残障金',
                render: () => {
                    return '/'
                }
            },
            {
                title: '代发工资',
                dataIndex: '代发工资',
                key: '代发工资',
                render: () => {
                    return '/'
                }
            },
            {
                title: '社保',
                dataIndex: '社保',
                key: '社保',
                render: () => {
                    return '/'
                }
            },
            {
                title: '采暖费',
                dataIndex: '采暖费',
                key: '采暖费',
                render: () => {
                    return '/'
                }
            },
            {
                title: '滞纳金',
                dataIndex: '滞纳金',
                key: '滞纳金',
                render: () => {
                    return '/'
                }
            },
            {
                title: '合同工本费',
                dataIndex: '合同工本费',
                key: '合同工本费',
                render: () => {
                    return '/'
                }
            },
            {
                title: '小计',
                dataIndex: '小计',
                key: '小计',
                render: () => {
                    return '/'
                }
            },
            {
                title: '服务费',
                dataIndex: '服务费',
                key: '服务费',
                render: () => {
                    return '/'
                }
            },
            {
                title: '合计',
                dataIndex: '合计',
                key: '合计',
                render: () => {
                    return '/'
                }
            },
            {
                title: '备注',
                dataIndex: '备注',
                key: '备注',
                render: () => {
                    return '/'
                }
            },
        ]
    ]
    
    importMenu = (
        <Menu>
          <Menu.Item key="1-0">
            清除数据
          </Menu.Item>
          <Menu.Item key="1-1">
            查看导入记录
          </Menu.Item>
          {/* <Menu.Divider /> */}
          <Menu.Item key="1-3">下载导入模板</Menu.Item>
        </Menu>
    )

    getList = (current, pageSize) => {

    }

    public render() {
        const pagination : any = new Pagination({
            onChange: this.getList,
            onShowSizeChange: this.getList,
            total: this.state.total,
            pageSize: this.state.pageSize, 
            current:this.state.current,
        })
        return <Card
            className='payment-bill-container'
            title={"付款账单（人月次维度明细表）"}
            extra={[<Button style={{marginRight: 10}} type='primary'>导入付款账单</Button>, <Dropdown overlay={this.importMenu} trigger={['click']}>
                <a  className="ant-dropdown-link">
                更多操作 <Icon type="down" />
                </a>
            </Dropdown>]}
        >
            {
                !this.props.isSp && [
                    <Radio.Group onChange={(evt) => {this.props.onAdvanceChange && this.props.onAdvanceChange(evt.target.value)}} value={this.props.hasAdvance}>
                        <Radio.Button value={false}>无垫款</Radio.Button>
                        <Radio.Button value={true}>有垫款</Radio.Button>
                    </Radio.Group>,
                    <WhiteSpace />,
                ]
            }
            {

            }
            <Table 
                className='ant-table-wrapper-text-center'
                bordered
                dataSource={[{}]}
                columns={this.columns[0]}
                pagination={pagination}
            />
            <WhiteSpace />
            <div style={{
                textAlign: 'right'
            }}>
                本次请款需支付：<span className='text-error' style={{fontSize: 14, fontWeight: 600}}>￥4,000.00</span>
            </div>
        </Card>
    }
}

export default PaymentBill;