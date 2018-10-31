import * as React from 'react';
import * as QueueAnim from "rc-queue-anim/lib";
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Button, Select, Input, Table, Row, Col, DatePicker, notification, Modal, Upload, Spin, message , Icon} from 'antd';
import { DOMAIN_OXT } from '../../global/global';
import './../../css/financialManagement/socialApprove.less';
const Option = Select.Option;
import * as moment from 'moment';
import { OutputFile } from '../../businessComponents/common/socialOutputFile';
import UploadFile from '../../businessComponents/common/uploadFile';
import {
    socialPayment,
    getCountNumber,
} from '../../action/financialManagement/socialPaymentAction';
import { fetchFn } from '../../util/fetch';
import {
    ROUTER_PATH
} from '../../global/global';
import { List, Map} from 'immutable';
interface SocialPaymentProps {
    dispatch: any;
    dataSource: List<Map<any, any>>;
    pageSize: number;
    listIsFetching: boolean;
    currentPage: boolean;
    total: number;
    paymentType: any;
    payStatus: any;
    receivablesName: string;
    createUserName: string;
    operStatus: number;
    financePlanPayTime: any;
    prepaymentsCode: any;
    noexportUnpayCount: number;
}
let datesTimes: any = (new Date(new Date().toLocaleDateString()).getTime()) / 1000
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

class SocialPayment extends React.Component<SocialPaymentProps, any> {
    searchParamsCashe:any;
    


    columns: [any] = [
        {
            title: '请款单号',
            dataIndex: '',
            key: 'prepaymentsCode',
            render: (data, record, ) => {
                return <span>{data.prepaymentsCode}</span>;
                /*if (data.payStatus == 4) {
                    return <span>{data.prepaymentsCode}</span>;
                }
                return <Link to={'/admindev/newadmin/financial/social/cash?detailArgs='+JSON.stringify({orderNum :data.prepaymentsCode,info:1,headerNo:4})}>
                    {data.prepaymentsCode}</Link>*/
            },
            width: 150,
            fixed: 'left',
        },
        {
            title: '财务计划支付时间',
            dataIndex: 'financePlanPayTime',
            className: 'payTimeheightLinght',
            key: 'financePlanPayTime',
            render: (data) => {
                return <span style={{ background: '#FFFFDD' }}>{data ? moment(data * 1000).format('YYYY-MM-DD') : '/'}</span>;
            },
            width: 150,
            // fixed: 'left',
        }, {
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
        {
            title: '财务审批人(姓名/联系方式)',
            key: 'financeUserName',
            render: (data) => {
                return <span>{data.financeUserName || ''}/{data.financeUserPhone || ''}</span>;
            },
            width: 200,
        },
        {
            title: '导出状态',
            dataIndex: 'exportStatus',
            key: 'exportStatus',
            fixed: 'right',
            render: (data) => {
                return <span>{data == 0 ? '未导出' : '已导出'} </span>;
            },
            width: 80,
        },
        {
            title: '付款状态',
            dataIndex: 'payStatus',
            key: 'payStatus',
            fixed: 'right',
            render: (data) => {
                return <span>{data == 1 ? '已支付' : '未支付'} </span>;
            },
            width: 80,
        },
        {
            title: '操作',
            key: 'action',
            render: (data) => {
                if (Number(data.payStatus) === 1) {
                    let params = JSON.stringify({ orderNum: data.prepaymentsCode, info: 1, headerNo: 5 });
                    return <Link to={`${ROUTER_PATH}/newadmin/financial/social/payinfo/payment?detailArgs=${params}`}>
                        查看</Link>;
                }
                else {
                    let params = JSON.stringify({ orderNum: data.prepaymentsCode, info: 2, headerNo: 4 });
                    return <Link to={`${ROUTER_PATH}/newadmin/financial/social/payinfoentry?detailArgs=${params}`}>
                        打款信息录入</Link>;
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
    prepaymentsCode: any;
    financePlanPayTime: any;
    constructor(props) {
        super(props)
        this.state = {
            financePlanPayTime: datesTimes,
            paymentStatus: "0",
            oneLoading: false,
            twoLoading: false,
            countNumber: 0,
            isShowCount: true,
            selectedRowKeys: [],
            printModalShow: false,
            printLoading: false,
            printButtonText: '批量打印请款单'
        }
        const {
            dataSource,
            total,
            currentPage,
            listIsFetching,
            paymentType,
            payStatus,
            receivablesName,
            prepaymentsCode,
            createUserName,
            operStatus,
        } = props;
        this.searchParamsCashe = {
            operStatus,
            paymentType,
            payStatus,
            receivablesName,
            prepaymentsCode,
            createUserName,
        }
        
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
            prepaymentsCode,
        } = this.props;
        const {
            financePlanPayTime
        } = this.state

        dispatch(socialPayment({
            operStatus,
            paymentType,
            payStatus: "0",
            currentPage,
            pageSize,
            receivablesName,
            prepaymentsCode,
            createUserName,
            financePlanPayTime,
        }));
        const Countparams = {
            financePlanPayTime,
            payStatus: "0",
            receivablesName,
            financeUserName: createUserName,
        }

        let p = new Promise((resolve, reject) => {
            dispatch(getCountNumber(Countparams));
            resolve()
        })

    }
    handleSearchChangeCache = (value, key) => {
        if (key == 'financePlanPayTime') {
            if (value != null) {
                value = value.format('X')
            } else {
                value = ''
            }
            this.setState({
                financePlanPayTime: value
            })


        }
        if (key == 'payStatus') {
            this.setState({
                paymentStatus: value
            })
            
        }
        // this.setState({
        //     [`${key}`]: value
        // })
        this.searchParamsCashe[key] = value;
    }
    handleChangeExportStatus = (isExporting: boolean) => {
        this.setState({ isExporting: isExporting })
        const {
            dispatch,
            receivablesName,
            createUserName,
            payStatus,
        } = this.props;
        const {
            financePlanPayTime
        } = this.state

        const params = {
            financePlanPayTime,
            receivablesName,
            payStatus,
            financeUserName: createUserName,
        }
        this.countNumber1(params);
    }
    countNumber1 = (params) => {
        const {

            dispatch,
        } = this.props

        let p = new Promise((resolve, reject) => {
            dispatch(getCountNumber(params));
            resolve()
        })


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
            prepaymentsCode,
        } = this.props;
        const {
            financePlanPayTime
        } = this.state
        return {
            current: currentPage,
            total,
            showSizeChanger: true,
            defaultPageSize: pageSize,
            showQuickJumper: true,
            pageSizeOptions: ['20', '50', '100'],
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}`,
            onShowSizeChange: (current, size) => {
                dispatch(socialPayment({
                    operStatus,
                    paymentType,
                    payStatus,
                    receivablesName,
                    prepaymentsCode,
                    createUserName,
                    currentPage: current,
                    pageSize: size,
                    financePlanPayTime,
                }));
                sessionStorage.setItem('socialPayment', JSON.stringify({
                    operStatus,
                    paymentType,
                    payStatus,
                    financePlanPayTime,
                    receivablesName,
                    prepaymentsCode,
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
                    financePlanPayTime,
                    receivablesName,
                    prepaymentsCode,
                    createUserName,
                    currentPage: current,
                    pageSize,
                }));
                sessionStorage.setItem('socialPayment', JSON.stringify({
                    operStatus,
                    paymentType,
                    payStatus,
                    financePlanPayTime,
                    receivablesName,
                    prepaymentsCode,
                    createUserName,
                    currentPage: current,
                    pageSize,
                }));
            }
        }

    }
    handleVerifyBefore = () => {
        const {
            financePlanPayTime,
            countNumber
        } = this.state
        if (financePlanPayTime == null || financePlanPayTime == '') {
            message.error('请选择计划支付时间')
            return false
        }
        if (this.props.noexportUnpayCount == 0) {
            notification.error({
                type: 'error',
                message: '提醒',
                description: '没有可导出的记录',

            });

            return false
        }

        return true
    }
    handleSearch = ({
        defaultcurrentPage
    }) => {
        let {
            dispatch,
            operStatus,
            currentPage,
            pageSize,
            financePlanPayTime,
            receivablesName,
            createUserName,
            payStatus,
        } = this.props;
        if (this.state.financePlanPayTime) {
            this.setState({
                isShowCount: true
            })
        } else {
            this.setState({
                isShowCount: false
            })
        }
        defaultcurrentPage !== undefined && defaultcurrentPage !== null && (currentPage = defaultcurrentPage);

        const params = {
            operStatus,
            currentPage,
            pageSize,
            ...this.searchParamsCashe,
            financeUserName: this.searchParamsCashe.createUserName,
            payStatus: this.state.paymentStatus,
        }
        
        sessionStorage.setItem('socialPayment', JSON.stringify(params));
        dispatch(socialPayment(params));
        console.log(this.state.paymentStatus)
        const Countparams = {
            financePlanPayTime: this.state.financePlanPayTime,
            receivablesName,
            payStatus: this.state.paymentStatus,
            financeUserName: this.searchParamsCashe.createUserName,
        }

        this.countNumber1(Countparams);
    }
    onSelectChange = (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
    }
    batchPrint = async () => {
        const max = 60;
        const selectedRowKeys = this.state.selectedRowKeys;
        if (selectedRowKeys.length <= 0) {
            return message.error('请选择要打印的请款单');
        }
        if (selectedRowKeys.length > max) {
            return message.error(`每次最多支持打印${max} 个请款单`);
        }
        this.setState({
            printLoading: true,
            printButtonText: '需要打印的请款单生成中...'
        }, async () => {
            const data = await fetchFn(`${DOMAIN_OXT}/apiv2_/finance/finance/v1/prepayments/print/pdf`, {prepaymentIds: selectedRowKeys.join(',')});

            if (data.status === 0) {
                this.setState({
                    printModalShow: true,
                    printLoading: false,
                    printButtonText: '批量打印请款单',
                    printUrl: data.data,
                });
            }
            else {
                this.setState({
                    printLoading: false,
                    printButtonText: '批量打印请款单'
                });
            }
        })
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
            prepaymentsCode,
            createUserName,
            operStatus,
        } = this.props;
        const {
            financePlanPayTime,
            selectedRowKeys,
        } = this.state
      
        const pagination: any = this.pagination({ total, currentPage });
        const byBankUrl = `${ROUTER_PATH}/apiv2_/finance/finance/v1/prepayments/cashier/onlinebank/import `;//导入网银流水
        const quickUrl = `${ROUTER_PATH}/apiv2_/finance/finance/v1/prepayments/cashier/prepaymentcode/import`;//导入流水号、打款时间
        const pollUrl = `${ROUTER_PATH}/apiv4_/v1/sppayu/upload/file`;//进度
        const typeNumber = 0;

        const props1 = {
            name: 'file',
            action: pollUrl,
            headers: {
                authorization: 'authorization-text',
            },
            className: "del-list",

            beforeUpload: (file) => {

                file.status = 'uploading';
                this.setState({ oneLoading: true });
                if (file.name.split('.').pop() == 'xls' || file.name.split('.').pop() == 'xlsx') {
                    return true;
                } else {
                    this.setState({ oneLoading: false })
                    notification.error({
                        type: 'error',
                        message: '提醒',
                        description: '导入格式错误,请上传.xls或.xlsx文件',

                    });
                    return false
                }

            },
            onChange: (info) => {

                if (info.file.status !== 'uploading') {
                    const parmas = {
                        ossUrl: info.file.response.data.url
                    }
                    return new Promise((resolve, reject) => {
                        fetchFn(quickUrl, parmas, undefined, typeNumber).then(data => data).then((data: any) => {

                            if (data.status == 0 && data.errcode == 0) {
                                this.setState({ oneLoading: false })
                                Modal.success({
                                    cancelText: '知道了',
                                    title: '导入成功',
                                    content: (
                                        <div>
                                            <p>本次共上传了{data.data.success}条数据</p>
                                        </div>
                                    ),
                                });
                            } else {
                                this.setState({ oneLoading: false })
                            }

                        });
                    })


                }
            },
        };
        const props2 = {
            name: 'file',
            action: pollUrl,
            headers: {
                authorization: 'authorization-text',
            },
            className: "del-list",
            beforeUpload: (file) => {
                file.status = 'uploading';
                this.setState({ twoLoading: true });
                if (file.name.split('.').pop() == 'xls' || file.name.split('.').pop() == 'xlsx') {
                    return true;
                } else {
                    this.setState({ twoLoading: false })
                    notification.error({
                        type: 'error',
                        message: '提醒',
                        description: '导入格式错误,请上传.xls或.xlsx文件',

                    });
                    return false
                }

            },
            onChange: (info) => {
                if (info.file.status !== 'uploading') {

                    const parmas = {
                        ossUrl: info.file.response.data.url
                    }
                    return new Promise((resolve, reject) => {
                        fetchFn(byBankUrl, parmas, undefined, typeNumber).then(data => data).then((data: any) => {
                            if (data.status == 0 && data.errcode == 0) {
                                this.setState({ twoLoading: false })
                                Modal.success({
                                    cancelText: '知道了',
                                    title: '导入成功',
                                    content: (
                                        <div>
                                            <p>本次共上传了{data.data.success}条数据</p>
                                        </div>
                                    ),
                                });
                            } else {
                                this.setState({ twoLoading: false })
                            }

                        });
                    })


                }
            },

        };
        // prepaymentsCode: this.props.prepaymentsCode,
        // payStatus: this.props.payStatus,
        // receivablesName: this.props.receivablesName,
        // financePlanPayTime: this.props.financePlanPayTime,
        // financeUserName: this.props.createUserName
        const outPutParams = {

            prepaymentsCode: prepaymentsCode == null ? '' : prepaymentsCode,
            payStatus: payStatus == null ? '' : payStatus,
            receivablesName: receivablesName == null ? '' : receivablesName,
            financePlanPayTime: financePlanPayTime == null ? '' : financePlanPayTime,
            financeUserName: createUserName == null ? '' : createUserName
        }
        return (

            <QueueAnim>
                <div key="1">
                    {/* prepaymentsCode  请款单号 (完全匹配查询)
                        payStatus  0未付款 1付款  如果查询全部 请 传空
                        receivablesName  收款方名称
                        financePlanPayTime 财务计划支付时间 格式 yyyy-MM-dd
                        financeUserName 请款人 */}
                    <Row type="flex" justify="start" align="middle">
                        <Col className="col-label"><label>请款单号：</label></Col>
                        <Col className="col-distance">
                            <Input style={{ width: 160 }} defaultValue={prepaymentsCode} ref={node => this.prepaymentsCode = node} onChange={e => this.handleSearchChangeCache(e.target['value'], 'prepaymentsCode')} />
                        </Col>
                        {/* <Col className="col-label"><label>请款单类型：</label></Col>
                        <Col className="col-distance">
                            <Select className="search-select" defaultValue={paymentType.toString()} ref={node => this.paymentType = node} onChange={value => this.handleSearchChangeCache(value, 'paymentType')}>
                                <Option value="1">代缴社保款</Option>
                            </Select>
                        </Col> */}
                        {/* financePlanPayTime */}
                        <Col className="col-label"><label>财务计划支付时间（最晚时间）：</label></Col>
                        <Col className="col-distance">
                            <DatePicker
                                style={{ width: 150 }}
                                format="YYYY-MM-DD "
                                defaultValue={moment(financePlanPayTime * 1000)}
                                onChange={value => this.handleSearchChangeCache(value, 'financePlanPayTime')}

                            />

                        </Col>
                        <Col className="col-label"><label>付款状态：</label></Col>
                        <Col className="col-distance">
                            <Select className="search-select" defaultValue='0' ref={node => this.payStatus = node} onChange={value => this.handleSearchChangeCache(value, 'payStatus')}>
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
                            <Input style={{ width: 160 }} defaultValue={createUserName} ref={node => this.createUserName = node} onChange={e => this.handleSearchChangeCache(e.target['value'], 'createUserName')} />
                        </Col>
                        <Col>
                            <Button type="primary" onClick={e => this.handleSearch({
                                defaultcurrentPage: 0
                            })} loading={listIsFetching}>搜索</Button>
                        </Col>

                    </Row>
                    <Row>
                        <Col style={{ marginTop: 20 }}>
                            <OutputFile
                                outputParams={{
                                    ...outPutParams
                                }}
                                contentType='application/json'
                                outputUrl={`${ROUTER_PATH}/apiv2_/finance/finance/v1/prepayments/cashier/noexport-unpay/export`}
                                callback={this.handleChangeExportStatus}
                                pollUrl={`${ROUTER_PATH}/apiv2_/finance/finance/v1/prepayments/cashier/progress`}
                                beforeOutput={this.handleVerifyBefore}
                            >
                                <Button icon="download" loading={this.state.isExporting}>
                                    导出付款信息
                                    </Button>
                            </OutputFile>

                            {this.state.isShowCount ? <p style={{ marginLeft: 20, lineHeight: "32px", display: "inline-block" }}>
                                {/* this.state.paymentStatus*/}
                                在该财务计划支付时间范围内，有<span style={{ color: "red" }}>{this.props.noexportUnpayCount}</span>个请款单需要导出。
                            </p> : null}
                        </Col>
                        <Col span={22} style={{ marginTop: 20 }}>
                            <Col style={{ marginRight: 20, float: "left" }}>
                                <Upload {...props2}>
                                    <Spin spinning={this.state.twoLoading}>
                                        <Button icon="upload" className="ant-dropdown-link">
                                            导入网银流水
                                            </Button>
                                    </Spin>
                                </Upload>
                            </Col>
                            <Col style={{ float: "left" }}>
                                <Upload {...props1}>
                                    <Spin spinning={this.state.oneLoading}>
                                        <Button icon="upload" className="ant-dropdown-link">
                                            导入流水号、打款时间
                                        </Button>
                                    </Spin>
                                </Upload>
                            </Col>
                        </Col>

                    </Row>
                    <Row>
                        <Col>
                            <Link style={{ float: 'right' }} to={`${ROUTER_PATH}/newadmin/financial/social/payment/records`}>查看导出导入历史</Link>
                        </Col>
                    </Row>
                </div>
                <QueueAnim>
                    <div key="2" style={{ position: 'relative' }}>
                        <Table
                            rowSelection={{
                                selectedRowKeys,
                                onChange: this.onSelectChange
                            }}
                            columns={this.columns}
                            dataSource={dataSource.toJS()}
                            pagination={pagination}
                            loading={listIsFetching}
                            scroll={{ y: 500, x: 2830 }}
                            style={{ marginTop: '20px' }}
                            rowKey={record => record['id']}
                        >
                        </Table>
                        {
                            this.props.dataSource.size > 0 && <Button type="primary" style={{ position: 'absolute', left: 0, bottom: 16 }} onClick={this.batchPrint} loading={this.state.printLoading}>{this.state.printButtonText}</Button>
                        }
                        <Modal 
                            width={350}
                            maskClosable={false}
                            title="提示" 
                            visible={this.state.printModalShow}
                            onCancel={() => this.setState({printModalShow: false})}
                            footer={[
                                <a className="ant-btn ant-btn-primary" href={this.state.printUrl} target="_blank" onClick={() => this.setState({printModalShow: false})}>好的立刻前往打印</a>,
                            ]}
                        >
                            <Icon type="check-circle" style={{color: '#52c41a', fontSize: 22, marginRight: 16, float: 'left', minHeight: 48,}} />您需要打印的请款单已经准备好了。
                        </Modal>
                    </div>
                </QueueAnim>
            </QueueAnim>
        )
    }
}

function mapStateToProps(state: any) {
    const data = state.getIn(['socialPayment']);
    return {
        dataSource: data.getIn(['dataSource']),
        currentPage: data.getIn(['currentPage']),
        pageSize: data.getIn(['pageSize']),
        total: data.getIn(['total']),
        listIsFetching: data.getIn(['listIsFetching']),
        paymentType: data.getIn(['paymentType']),
        operStatus: data.getIn(['operStatus']),
        payStatus: data.getIn(['payStatus']),
        receivablesName: data.getIn(['receivablesName']),
        createUserName: data.getIn(['createUserName']),
        financePlanPayTime: data.getIn(['financePlanPayTime']),
        noexportUnpayCount: data.get('noexportUnpayCount'),
        //  prepaymentsCode,
        prepaymentsCode: data.getIn(['prepaymentsCode']),
    }
}

export default connect(mapStateToProps)(SocialPayment)