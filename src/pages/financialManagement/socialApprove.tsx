import * as React from 'react';
import * as QueueAnim from "rc-queue-anim/lib";
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Button, Select, Input, Table, Row, Col } from 'antd';
import './../../css/financialManagement/socialApprove.less';
const Option = Select.Option;
import * as moment from 'moment';
import { ROUTER_PATH } from '../../global/global';
import {
    socialApprove,
} from '../../action/financialManagement/socialApproveAction';

interface SocialApproveProps {
    dispatch: any;
    dataSource: Array<any>;
    pageSize: number;
    listIsFetching: boolean;
    currentPage: boolean;
    total: number;
    paymentType: any;
    approvalStatus: any;
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

class SocialApprove extends React.Component<SocialApproveProps, any> {
    columns: [any] = [
        {
            title: '请款单号',
            dataIndex: '',
            key: 'prepaymentsCode',
            render: (data, record, ) => {
                if (data.approvalStatus == 4) {
                    return <span>{data.prepaymentsCode}</span>;
                }
                const params = JSON.stringify({orderNum: data.prepaymentsCode,info:1,headerNo:3});
                return <Link to={`${ROUTER_PATH}/newadmin/financial/social/payinfo?detailArgs=${params}`}>{data.prepaymentsCode}</Link>
            },
            width: 150,
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
            // fixed: 'left',
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
            width: 320,
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
        // {
        //     title: '财务审批人(姓名/联系方式)',
        //     key: 'financeUserName',
        //     render: (data) => {
        //         return data.financeUserName + '/' + data.financeUserPhone;
        //     }
        // },

        {
            title: '审批状态',
            dataIndex: 'approvalStatus',
            key: 'approvalStatus',
            render: (data) => {
                return (
                    <span>{approveStatus[data] || '/'} </span>
                )
            },
            width: 150,
        },
        // {
        //     title: '付款状态',
        //     dataIndex: 'payStatus',
        //     key: 'payStatus',
        //     render: (data) => {
        //         return data == 1 ? '已支付' : '未支付';
        //     }
        // },
        {
            title: '财务计划支付时间',
            dataIndex: 'financePlanPayTime',
            key: 'financePlanPayTime',
            render: (data) => {
                return <span> {data ? moment(data, 'X').format('YYYY-MM-DD') : '/'} </span>;
            },
            width: 200,
        },
        {
            title: '客服计划付款时间倒计时',
            dataIndex: 'paymentsDeadlineStr',
            key: 'paymentsDeadlineStr',
            render: (data) => {
                return <span style={{ color: '#f25656' }}> {data ? data : '/'} </span>;
            },
            width: 200,
        }, {
            title: '客服计划付款截止日',
            key: 'paymentsDeadline',
            dataIndex: 'paymentsDeadline',
            render: (data) => {
                return <span>{data ? moment(data, 'X').format('YYYY-MM-DD HH:mm') : '/'}</span>;
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
                if(Number(data.approvalStatus) === 1) {
                    const params = JSON.stringify({orderNum: data.prepaymentsCode,info:2,headerNo:3});
                    return <Link to={`${ROUTER_PATH}/newadmin/financial/social/payinfoapprove?detailArgs=${params}`}>审核</Link>
                    // return <Link to={'/admindev/newadmin/financial/social/cash?detailArgs='+JSON.stringify({orderNum: data.prepaymentsCode,info:2,headerNo:3})}>审核</Link>
                }
                return '/';
            },
            width: 200,
            fixed: 'right',
        }
    ];
    approvalStatus: any;
    paymentType: any;
    receivablesName: any;
	createUserName: any;
    constructor(props) {
        super(props);
    }
    componentWillMount() {
        const {
            dispatch,
            operStatus, 
            paymentType, 
            approvalStatus,
            receivablesName, 
            createUserName,
            currentPage,
            pageSize,
        } = this.props;

        dispatch(socialApprove({
            operStatus,
            paymentType, 
            approvalStatus,
            receivablesName,
            createUserName,
            currentPage,
            pageSize,
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
            approvalStatus,
            receivablesName,
            createUserName,
        } = this.props;
        return {
            current: currentPage,
            total,
            showSizeChanger: true,
            defaultPageSize: pageSize,
            showQuickJumper: true,
            pageSizeOptions: ['20', '50', '100'],
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}`,
            onShowSizeChange: (current, size) => {
                dispatch(socialApprove({
                    operStatus,
                    paymentType, 
                    approvalStatus,
                    receivablesName,
                    createUserName,
                    currentPage: current,
                    pageSize: size,
                }));
                sessionStorage.setItem('socialApprove', JSON.stringify({
                    operStatus, 
                    paymentType, 
                    approvalStatus,
                    receivablesName, 
                    createUserName,
                    currentPage: current,
                    pageSize: size,
                }));
            },
            onChange: (current) => {
                dispatch(socialApprove({
                    operStatus,
                    paymentType, 
                    approvalStatus,
                    receivablesName,
                    createUserName,
                    currentPage: current,
                    pageSize,
                }));
                sessionStorage.setItem('socialApprove', JSON.stringify({
                    operStatus, 
                    paymentType, 
                    approvalStatus,
                    receivablesName, 
                    createUserName,
                    currentPage: current,
                    pageSize,
                }));
                // sessionStorage.setItem('socialApprove', JSON.stringify({
                //     currentPage: current,
                //     pageSize,
                //     ...searchParamsCashe,
                // }));
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
        sessionStorage.setItem('socialApprove', JSON.stringify(params));
        dispatch(socialApprove(params));
    }
    render() {
        const {
            dataSource,
            total,
            currentPage,
            listIsFetching,
            paymentType,
            approvalStatus,
            receivablesName,
            createUserName,
            operStatus,
        } = this.props;
        searchParamsCashe = {
            operStatus, 
            paymentType, 
            approvalStatus,
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
                        <Col className="col-label"><label>审批状态：</label></Col>
                        <Col className="col-distance">
                            <Select className="search-select" defaultValue={approvalStatus.toString()} ref={node => this.approvalStatus = node} onChange={value => this.handleSearchChangeCache(value, 'approvalStatus')}>
                                <Option value="">全部</Option>
                                <Option value="1">未审批</Option>
                                <Option value="2">已通过</Option>
                                <Option value="3">已驳回</Option>
                                <Option value="4">已取消</Option>
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
                            scroll={{ y: 500, x: 2670 }}
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
    const data = state.getIn(['socialApprove']);
    return {
        dataSource: data.getIn(['dataSource']).toJS(),
        currentPage: data.getIn(['currentPage']),
        pageSize: data.getIn(['pageSize']),
        total: data.getIn(['total']),
        listIsFetching: data.getIn(['listIsFetching']),
        paymentType: data.getIn(['paymentType']),
        operStatus: data.getIn(['operStatus']),
        approvalStatus: data.getIn(['approvalStatus']),
        receivablesName: data.getIn(['receivablesName']),
        createUserName: data.getIn(['createUserName']),
    }
}

export default connect(mapStateToProps)(SocialApprove)