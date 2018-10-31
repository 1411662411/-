import * as React from 'react';
import * as QueueAnim from "rc-queue-anim/lib"; // 
import { connect } from 'react-redux';

import { Link } from 'react-router';

import { Button, Select, Input, Table, Row, Col } from 'antd';
const Option = Select.Option;


import * as moment from 'moment';


import {
    socialPayment,
} from '../../action/financialManagement/socialPaymentAction';

interface SocialPaymentProps {
    dispatch: any;
    dataSource: Array<any>;
    pageSize: number;
    listIsFetching: boolean;
    currentPage: boolean;
    total: number;
    paymentType: any;
    payStatus: any;
    receivablesName: string;
    createUserName: string;
    operStatus: number;
}

// 审核状态
const approveStatus = {
    1: '未审批',
    2: '已通过',
    3: '已驳回',
    4: '已取消'
};


/**
 * 记录onchange改变的搜索条件
 */
let searchParamsCashe;

class SocialPayment extends React.Component<SocialPaymentProps, any> {
    columns: [any] = [
        {
            title: '订单号',
            dataIndex: '',
            key: 'prepaymentsCode',
            render: (data, record, ) => {
                if (data.payStatus == 4) {
                    return <span>{data.prepaymentsCode}</span>;
                }
                return <Link to={'/admindev/newadmin/financial/social/cash?detailArgs='+JSON.stringify({orderNum :data.prepaymentsCode,info:1,headerNo:4})}>
                    {data.prepaymentsCode}</Link>
            },
            width: 100,
            fixed: 'left',
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            key: 'createTime',
            render: (data) => {
                return <span>{data ? moment(data * 1000).format('YYYY-MM-DD HH:mm') : '/'}</span>;
            },
            width: 150,
            fixed: 'left',
        },
        {
            title: '收款方类型',
            dataIndex: 'receivablesType',
            key: 'receivablesType',
            render: (data) => {
                return <span>{Number(data) === 1 ? '分公司' : '服务商'}</span>;
            },
            width: 150,
        },
        {
            title: '收款方名称',
            dataIndex: 'receivablesName',
            key: 'receivablesName',
            width: 300,
        },
        {
            title: '请款单类型',
            dataIndex: 'paymentType',
            key: 'paymentType',
            render: (data) => {
                return <span>{Number(data) === 1 ? '代缴社保款' : '/'}</span>;
            },
            width: 150,
        },
        {
            title: '社保缴费月',
            dataIndex: 'insuranceFeesMonth',
            key: 'insuranceFeesMonth',
            render: (data) => {
                if (data) {
                    return <span>{moment(data * 1000).format('YYYY-MM')}</span>;
                }
                return <span>/</span>;
            },
            width: 150,
        },
        {
            title: '请款人(姓名/联系方式)',
            key: 'createUserName',
            render: (data) => {
                // 时间转化
                return <span>{data.createUserName}/{data.createUserPhone}</span>;
            },
            width: 200,
        },
        {
            title: '业务审批人(姓名/联系方式)',
            key: 'professionUserName',
            render: (data) => {
                return <span>{data.professionUserName}/{data.professionUserPhone}</span>;
            },
            width: 200,
        },
        {
            title: '财务审批人(姓名/联系方式)',
            key: 'financeUserName',
            render: (data) => {
                return <span>{data.financeUserName || '' }/{data.financeUserPhone || ''}</span>;
            },
            width: 200,
        },
        {
            title: '付款状态',
            dataIndex: 'payStatus',
            key: 'payStatus',
            render: (data) => {
                return <span>{data == 1 ? '已支付' : '未支付'} </span>;
            },
            width: 150,
        },
        {
            title: '客服计划付款截止日',
            dataIndex: 'paymentsDeadlineStr',
            key: 'paymentsDeadlineStr',
            render: (data) => {
                return <span style={{ color: '#f25656' }}> {data ? data : '/'} </span>;
            },
            width: 200,
        }, {
            title: '本次请求付款截止日',
            key: 'paymentsDeadline',
            dataIndex: 'paymentsDeadline',
            render: (data) => {
                return <span>{data}</span>;
            },
            width: 200,
        }, {
            title: '客服对外约定付款截止日',
            key: 'promiseDeadline',
            dataIndex: 'promiseDeadline',
            render: (data) => {
                return <span>{data}</span>
            },
            width: 200,
        }, {
            title: '操作',
            key: 'action',
            render: (data) => {
                if(Number(data.payStatus) === 1) {
                    return <Link to={'/admindev/newadmin/financial/social/cash?detailArgs='+JSON.stringify({orderNum :data.prepaymentsCode,info:2,headerNo:4})}>
                        打款信息录入</Link>;
                }
                else {
                    return <Link to={'/admindev/newadmin/financial/social/cash?detailArgs='+JSON.stringify({orderNum :data.prepaymentsCode,info:1,headerNo:5})}>
                        查看</Link>;
                }
            },
            width: 200,
            fixed: 'right',
        }
    ];
    payStatus: any;
    paymentType: any;
    receivablesName: any;
    createUserName: any;
    constructor(props) {
        super(props)
    }
    componentWillMount() {
        const {
            dispatch,
            operStatus, 
            paymentType, 
            payStatus,
            receivablesName, 
            createUserName,
            currentPage,
            pageSize,
        } = this.props;

        dispatch(socialPayment({
            operStatus,
            paymentType, 
            payStatus,
            currentPage,
            pageSize,
            receivablesName,
            createUserName,
        }));
    }
    handleSearchChangeCache = (value, key) => {
        searchParamsCashe[key] = value;
    }
    pagination = ({ total, currentPage }) => {
        const {
            pageSize,
            dispatch,
            operStatus,
            paymentType, 
            payStatus,
            receivablesName,
            createUserName,
        } = this.props;
        return {
            current: currentPage,
            total,
            showSizeChanger: true,
            defaultPageSize: pageSize,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}`,
            onShowSizeChange: (current, size) => {
                dispatch(socialPayment({
                    operStatus,
                    paymentType, 
                    payStatus,
                    receivablesName,
                    createUserName,
                    currentPage: current,
                    pageSize: size,
                }));
                sessionStorage.setItem('socialPayment', JSON.stringify({
                    operStatus,
                    paymentType, 
                    payStatus,
                    receivablesName,
                    createUserName,
                    currentPage: current,
                    pageSize: size,
                }));
                
            },
            onChange: (current) => {
                dispatch(socialPayment({
                    operStatus,
                    paymentType, 
                    payStatus,
                    receivablesName,
                    createUserName,
                    currentPage: current,
                    pageSize,
                }));
                sessionStorage.setItem('socialPayment', JSON.stringify({
                    operStatus,
                    paymentType, 
                    payStatus,
                    receivablesName,
                    createUserName,
                    currentPage: current,
                    pageSize,
                }));
            }
        }
        
    }
    handleSearch = ({
        defaultcurrentPage
    }) => {
        let {
            dispatch,
            operStatus,
            currentPage,
            pageSize,
        } = this.props;

        defaultcurrentPage !== undefined && defaultcurrentPage !== null && (currentPage = defaultcurrentPage);

        const params = {
            operStatus,
            currentPage,
            pageSize,
            ...searchParamsCashe
        }
        sessionStorage.setItem('socialPayment', JSON.stringify(params));
        dispatch(socialPayment(params));
    }
    render() {
        const {
            dataSource,
            total,
            currentPage,
            listIsFetching,
            paymentType,
            payStatus,
            receivablesName,
            createUserName,
            operStatus,
        } = this.props;
        searchParamsCashe = {
            operStatus, 
            paymentType, 
            payStatus,
            receivablesName, 
            createUserName,
        }
        const pagination:any = this.pagination({ total, currentPage });
        return (
            <QueueAnim>
                <div key="1">
                    <Row type="flex" justify="start" align="middle">
                        <Col className="col-label"><label>请款单类型：</label></Col>
                        <Col className="col-distance">
                            <Select className="search-select" defaultValue={paymentType.toString()} ref={node => this.paymentType = node} onChange={value => this.handleSearchChangeCache(value, 'paymentType')}>
                                <Option value="1">代缴社保款</Option>
                            </Select>
                        </Col>
                        <Col className="col-label"><label>付款状态：</label></Col>
                        <Col className="col-distance">
                            <Select className="search-select" defaultValue={payStatus.toString()} ref={node => this.payStatus = node} onChange={value => this.handleSearchChangeCache(value, 'payStatus')}>
                                <Option value="">全部</Option>
                                <Option value="0">未支付</Option>
                                <Option value="1">已支付</Option>
                            </Select>
                        </Col>
                        <Col className="col-label"><label>收款方名称：</label></Col>
                        <Col className="col-distance">
                            <Input style={{ width: 160 }} defaultValue={receivablesName} ref={node => this.receivablesName = node} onChange={e => this.handleSearchChangeCache(e.target['value'], 'receivablesName')} />
                        </Col>
                        <Col className="col-label"><label>请款人：</label></Col>
                        <Col className="col-distance">
                            <Input style={{ width: 160 }} defaultValue={createUserName} ref={node => this.createUserName = node} onChange={e => this.handleSearchChangeCache(e.target['value'], 'createUserName')}/>
                        </Col>
                        <Col>
                            <Button type="primary" onClick={ e => this.handleSearch({
                                defaultcurrentPage: 0})} loading={listIsFetching}>搜索</Button>
                        </Col>
                    </Row>
                </div>
                <QueueAnim>
                    <div key="2">
                        <Table
                            columns={this.columns}
                            dataSource={dataSource}
                            pagination={pagination}
                            loading={listIsFetching}
                            scroll={{ y: 500, x: 2600 }}
                            style={{ marginTop: '20px' }}
                            rowKey={record => record['id']}
                        >
                        </Table>
                    </div>
                </QueueAnim>
            </QueueAnim>
        )
    }
}

function mapStateToProps(state: any) {
    const data = state.getIn(['socialPayment']);
    return {
        dataSource: data.getIn(['dataSource']).toJS(),
        currentPage: data.getIn(['currentPage']),
        pageSize: data.getIn(['pageSize']),
        total: data.getIn(['total']),
        listIsFetching: data.getIn(['listIsFetching']),
        paymentType: data.getIn(['paymentType']),
        operStatus: data.getIn(['operStatus']),
        payStatus: data.getIn(['payStatus']),
        receivablesName: data.getIn(['receivablesName']),
        createUserName: data.getIn(['createUserName']),
    }
}

export default connect(mapStateToProps)(SocialPayment)