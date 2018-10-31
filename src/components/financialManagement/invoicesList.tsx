/**
 * Created by yangws on 2017/7/25.
 */
import * as React from 'react';
import * as QueueAnim from "rc-queue-anim/lib";
import * as moment from 'moment';
import { browserHistory, Link } from 'react-router';
import { connect } from 'react-redux';
import {
    Button,
    Select,
    Input,
    Table,
    Row,
    Col,
    Radio,
    DatePicker,
    Form,
    message,
    Modal,
    Alert,
    Spin,
    InputNumber,
    Badge,
    Collapse,
    Icon,
} from 'antd';
const Option = Select.Option;

const RangePicker = DatePicker.RangePicker;
const Panel = Collapse.Panel;
import { statePaginationConfig } from '../../util/pagination';
import { DOMAIN_OXT, PHP_DOMAIN, ROUTER_PATH } from '../../global/global';
import {
    invoicesSendListSaga,
    invoicesExportdatacountSaga,
} from '../../action/financialManagement/invoicesSendAction';
import { formatDateTime, accAdd, formatMoney } from '../../util/util';
import {
    PAGINATION_PARAMS
} from '../../global/global';
import { OutputFile } from '../../businessComponents/common/outputFile';
import UploadFile from '../../businessComponents/common/uploadFile';

const uploadUrl = `${DOMAIN_OXT}/api/order/invoice/fileinput`;
const pollUrl = `${DOMAIN_OXT}/apiv2_/order/invoice/importprocess`;
interface exportdatacount {
    count1:number;
    count2:number;
    count3:number;
    count4:number;
}


interface columns {
    (data?): [any];
}


// interface AppRouterType {
//     history?: any;
//     dispatch: any;
// }
interface TStateProps {
    dataSource: any[];
    searchParams: any;
    total: number;
    userInfo:  Any.UserInfo;
    exportdatacount: exportdatacount;
    fetching: boolean;
}
interface TOwnProps {
    /**
     * 1 开发票&登记发票号  2 登记发票快递号
     */
    type: 1 | 2 ;
    subject?: number; //开票主体 1 杭州今元标矩科技有限公司  2 杭州今元标矩科技有限公司天津武清分公司 (之后可能会拓展)
}
interface TDispatchProps {
    dispatch: Any.Dispatch<any>;
}
type invoicesListProps =  TStateProps & TOwnProps & TDispatchProps;

class InvoicesList extends React.Component<invoicesListProps, any> {
    sessionStorageSearchParams: any;
    type: any;
    constructor(props) {
        super(props);
        // 1 开发票&登记发票号 2 登记发票快递号
        this.type = this.props.type;
        this.sessionStorageSearchParams = null//JSON.parse(sessionStorage.getItem('INVOICES_LIST_SESSIONSTORAGE')!);
        this.state = {
            expanded: false, //是否展开
            isExporting: false, //导出状态
            searchParams: {
                invoiceStatus: props.type === 2 ? 2 : '',
                orderCode: '', // 订单号
                cName: '',     // 客户名称
                orderType: '', // 订单类型
                invoiceExportStatus: props.type === 2 ? 1 : '',
                isExpress: props.type === 2 ? 1 : 0,
                type:props.type === 2 ? 4 : '',
                subject:props.subject || '',
                ...PAGINATION_PARAMS,
                ...this.sessionStorageSearchParams,

            }
        }
    }

    columns: columns = (type) => [
        {
            title: '操作',
            dataIndex: null,
            width:150,
            key: 'operation',
            render: (data, record, index) => {
                return (<a onClick={e => {
                    this.handlegoDetail({
                        cname: data.cName,
                        codeId: data.id,
                        code: data.invoiceNumber,
                    })
                }}>查看发票详情</a>)

            },
        }, {
            title: '订单号',
            dataIndex: null,
            width:200,
            key: 'orderCode',
            render: (data, record, index) => {
                switch (data.orderType) {
                    case 1:
                        return data.orderCode
                    case 5:
                        return <Link to={`${ROUTER_PATH}/newadmin/social/customer/socialorderdetail?id=${data.orderId}`}>{data.orderCode}</Link>
                    case 6:
                        return <Link to={`${ROUTER_PATH}/newadmin/social/customer/socialorderdetail?id=${data.orderId}`}>{data.orderCode}</Link>
                    default:
                        return <a href={`${PHP_DOMAIN}/socialbackend/social/customer/socialorderdetail?id=${data.orderId}`}>{data.orderCode}</a>
                }
                
            }
            
        }, {
            title: '客户名称',
            dataIndex: 'cName',
            width:250,
            key: 'cName',

        },
        type === 1 ? {
            title: '发票信息导出状态',
            dataIndex: 'invoiceExportStatus',
            width:100,
            key: 'invoiceExportStatus',
            render: (data, record, ) => {
                return data === 1 ? '已导出' : '未导出'
            }
        } : {},
        type === 1 ? {
            title: <span>发票是否已开<br />(发票号)</span>,
            dataIndex: null,
            width:150,
            key: 'invoiceStatus',
            render: (data, record, ) => {
                return data.invoiceStatus === 2 ? `已开(${data.invoiceNumber || '/'})` : '未开'
            }
        } : {},
        type === 2 ? {
            title: '快递信息导出状态',
            dataIndex: 'exportStatus',
            width:100,
            key: 'exportStatus',
            render: (data, record, ) => {
                return data === 1 ? '已导出' : '未导出'
            }
        } : {}, type === 2 ? {
            title: '发票号',
            dataIndex: 'invoiceNumber',
            width:150,
            key: 'invoiceNumber',
            render: (data, record, ) => {
                return data ? data : '/'
            }
        } : {}, {
            title: <span>发票是否寄出<br />(快递号{type === 1 && '/查看电子发票'})</span>,
            dataIndex: null,
            width:150,
            key: 'sendStatus',
            render: (data, record, ) => {
                // 武清主体特殊 后台要求单独判断已寄出
                if(this.props.subject ===2 && data.invoiceStatus === 2){
                    return '已寄出'
                }
                // 电子发票
                if(data.invoiceType === 3 ){
                    return data.invoiceUrl?<span>已寄出(<a target="_blank" href={data.invoiceUrl}>下载电子发票</a>)</span>:'未寄出';
                }else{
                    return data.sendStatus?`已寄出(${data.courierNumber || '/'})`:'未寄出';
                }
            }
        }, {
            title: '发票类型',
            dataIndex: 'invoiceTypeName',
            width:150,
            key: 'invoiceTypeName',
        }, {
            title: '订单类型',
            dataIndex: 'orderTypeName',
            width:100,
            key: 'orderTypeName',
        }, {
            title: '订单提交时间',
            dataIndex: 'createTime',
            width:150,
            key: 'createTime',
            render: (data) => {
                return data ? moment(data * 1000).format('YYYY-MM-DD HH:mm:ss') : '/'
            }
        }, {
            title: '到款日期',
            dataIndex: 'payTime',
            width:150,
            key: 'payTime',
            render: (data) => {
                return data ? moment(data * 1000).format('YYYY-MM-DD HH:mm:ss') : '/'
            }
        }



    ]
    componentWillMount() {
        // 默认加载
        this.handleSearch();
        // 获取统计
        this.props.dispatch(invoicesExportdatacountSaga({subject:this.props.subject}));
    }
    handleSearch = () => {
        this.props.dispatch(invoicesSendListSaga({ ...this.state.searchParams, ...PAGINATION_PARAMS }))
    }
    /**
     * 上传状态
     * @param isExporting boolean
     */
    handleChangeExportStatus = (isExporting: boolean) => {
        this.setState({ isExporting: isExporting })
      
        if(!isExporting) {
            this.handleSearch();
            this.props.dispatch(invoicesExportdatacountSaga({}));
        }
    }
    handlegoDetail = (params) => {
        sessionStorage.setItem('invoiceDetail', JSON.stringify(params));
        browserHistory.push(`${ROUTER_PATH}/newadmin/sale/cash/invoice/detail`);
    }
    pagination = () => {
        const {
            dispatch,
            total,
        } = this.props;
        const { searchParams } = this.state;
        const {
            currentPage,
            pageSize,
        } = searchParams;
        const setCurrentPage = (currentPage) => {

            this.setSearchParamState({ 'currentPage': currentPage })
        }
        return statePaginationConfig({ ...searchParams, currentPage, total, pageSize }, invoicesSendListSaga, dispatch, setCurrentPage)
    }
    // 更新搜索条件state
    setSearchParamState = (param) => {
        const { searchParams } = this.state;
        let newSearchParams = {
            ...searchParams,
            ...param,
        }
        this.setState({
            searchParams: newSearchParams
        })
        return newSearchParams;
    }
    /**
     * 时间选择器配置
     */
    rangePickerProps = () => {
        const {
            startTime,
            overTime
        } = this.state.searchParams;
        let props: {
            style: any;
            onChange(x: any, y: any): void;
            value?: [moment.Moment, moment.Moment];
        } = {
                style: { width: 338 },
                onChange: (data, timeString) => this.setSearchParamState({ startTime: timeString[0], overTime: timeString[1] })
            }
        if (startTime && overTime) {
            props.value = [moment(startTime), moment(overTime)];
        }
        return props;
    }
    expandedDom = (type, expanded) => {
        if (type === 1) {
            return expanded ? <a rel="noopener noreferrer" onClick={e => { this.setState({ expanded: !expanded }) }} href="javasrcipt:void(0);">收起<Icon type="up" /></a> :
                <a rel="noopener noreferrer" onClick={e => { this.setState({ expanded: !expanded }) }} href="javasrcipt:void(0);">展开<Icon type="down" /></a>
        }
        return []
    }
    /**
     * 导出前验证
     */
    handleVerifyBefore = (num,text) => {
        if(num && num > 0) {
            return true;
        }
        message.error(`暂无可导出的${text}`);
        return false;
        // return true
    }
    render() {
        const { dataSource,
            fetching,
            subject
        } = this.props;
        const {
            expanded,
            searchParams
        } = this.state;
        const {
            orderCode,
            orderType,
            cName,
            invoiceExportStatus,
            invoiceStatus,
        } = searchParams;
        const type = this.type;
        const {
            count1,
            count2,
            count3,
            count4,
        } =this.props.exportdatacount
        
        return (
            <QueueAnim>
                <div key="invoicesSend" className="wrapper-content">
                    <div className="form-site" style={{ marginBottom: 15, backgroundColor: '#ececec', padding: 15 }}>


                        <Row className="fixed-distance" type="flex" justify="start" align="middle">
                            <Col className="col-label" span={6}><label>订单号：</label></Col>
                            <Col span={8}>
                                <Input
                                    id="orderCode"
                                    size="default"
                                    style={{ width: 234 }}
                                    placeholder="请输入"
                                    value={orderCode}
                                    onChange={(e: any) => { this.setSearchParamState({ orderCode: e.target.value }) }}
                                />
                            </Col>
                        </Row>
                        <Row className="fixed-distance" type="flex" justify="start" align="middle">
                            <Col className="col-label" span={6}><label>客户名称：</label></Col>
                            <Col span={8}>
                                <Input id="input-search"
                                    size="default"
                                    style={{ width: 234 }}
                                    placeholder="请输入"
                                    value={cName}
                                    onChange={(e: any) => { this.setSearchParamState({ cName: e.target.value }) }}
                                />
                            </Col>

                        </Row>
                        {
                            type === 1 &&
                            <Row className="fixed-distance" type="flex" justify="start" align="middle">
                                <Col className="col-label" span={6}><label>发票信息导出状态：</label></Col>
                                <Col span={8}>
                                    <Radio.Group value={invoiceExportStatus} onChange={(e) => { this.setSearchParamState({ invoiceExportStatus: e.target.value }) }}>
                                        <Radio.Button value="">全部</Radio.Button>
                                        <Radio.Button value="0">未导出</Radio.Button>
                                        <Radio.Button value="1">已导出</Radio.Button>
                                    </Radio.Group>
                                </Col>
                            </Row>
                        }
                        {
                            type === 1 &&
                            <Row className="fixed-distance" type="flex" justify="start" align="middle">
                                <Col className="col-label" span={6}><label>发票是否已开：</label></Col>
                                <Col span={8}>
                                    <Radio.Group value={invoiceStatus} onChange={(e) => { this.setSearchParamState({ invoiceStatus: e.target.value }) }}>
                                        <Radio.Button value="">全部</Radio.Button>
                                        <Radio.Button value="1">未开</Radio.Button>
                                        <Radio.Button value="2">已开</Radio.Button>
                                    </Radio.Group>
                                </Col>



                            </Row>
                        }
                        {
                            (type === 2 || (expanded && type === 1)) &&
                            <Row className="fixed-distance" type="flex" justify="start" align="middle">
                                <Col className="col-label"><label>订单类型：</label></Col>
                                <Col >
                                    <Radio.Group value={orderType} onChange={(e) => { this.setSearchParamState({ orderType: e.target.value }) }}>
                                        <Radio.Button value="">全部</Radio.Button>
                                        <Radio.Button value="2">社保订单</Radio.Button>
                                        <Radio.Button value="1">会员订单</Radio.Button>
                                        <Radio.Button value="4">社保补差订单</Radio.Button>
                                        <Radio.Button value="5">SP社保订单</Radio.Button>
                                        <Radio.Button value="6">代发工资订单</Radio.Button>
                                    </Radio.Group>
                                </Col>
                            </Row>
                        }
                        {
                            (type === 2 || (expanded && type === 1)) &&
                            <Row className="fixed-distance" type="flex" justify="start" align="middle">
                                <Col className="col-label" span={6}><label>订单提交时间范围：</label></Col>
                                <Col span={8}>
                                    <RangePicker {...this.rangePickerProps() } />
                                </Col>

                            </Row>
                        }


                        <Row className="fixed-distance" type="flex" justify="start" align="middle" style={{ marginTop: -30 }}>
                            <Col span={10}></Col>
                            <Col style={{ marginLeft: 30 }}>
                                <Button className="col-distance" style={{ marginRight: 10 }} onClick={this.handleSearch} type="primary">搜索</Button>
                                {
                                    this.expandedDom(type, expanded)
                                }
                            </Col>
                        </Row>




                    </div>
                    <div className="form-site" style={{ paddingTop: 15, paddingBottom: 15 }} key={subject}>
                        <Spin tip="导出中..." spinning={this.state.isExporting}>
                            {type == 1 && 
                                <Row type="flex" justify="start" align="middle">
                                    <Col span={18}>
                                        
                                        <OutputFile
                                            outputParams={{ type: 2, userId: this.props.userInfo.userId, userName: this.props.userInfo.userName,subject }}
                                            outputUrl={`${DOMAIN_OXT}/apiv2_/order/invoice/exportinvoice`}
                                            downloadUrl={`${DOMAIN_OXT}/apiv4_/v1/sppayu/download/download`}
                                            callback={this.handleChangeExportStatus}
                                            beforeOutput ={()=>this.handleVerifyBefore(count2,'纸质_专用发票')}
                                            type={1}
                                            pollUrl={`${DOMAIN_OXT}/apiv2_/order/invoice/progress`}
                                            pollData={{ type: 2, userId: this.props.userInfo.userId, userName: this.props.userInfo.userName }}
                                        >

                                            <Badge count={count2} ><Button style={{ height: 'auto', width: 150, padding: 5 }}><Icon type="cloud-download-o" style={{ fontSize: 16 }} />导出<br />纸质_专用发票信息</Button></Badge>
                                        </OutputFile>
                                        <OutputFile
                                            outputParams={{ type: 1, userId: this.props.userInfo.userId, userName: this.props.userInfo.userName,subject }}
                                            outputUrl={`${DOMAIN_OXT}/apiv2_/order/invoice/exportinvoice`}
                                            downloadUrl={`${DOMAIN_OXT}/apiv4_/v1/sppayu/download/download`}
                                            callback={this.handleChangeExportStatus}
                                            beforeOutput ={()=>this.handleVerifyBefore(count1,'纸质_普通发票')}
                                            type={1}
                                            pollUrl={`${DOMAIN_OXT}/apiv2_/order/invoice/progress`}
                                            pollData={{ type: 1, userId: this.props.userInfo.userId, userName: this.props.userInfo.userName }}
                                        >

                                            <Badge count={count1} ><Button style={{ height: 'auto', width: 150, marginLeft: 40, padding: 5 }}><Icon type="cloud-download-o" style={{ fontSize: 16 }} />导出<br />纸质_普通发票信息</Button></Badge>
                                        </OutputFile>
                                        <OutputFile
                                            outputParams={{ type: 3, userId: this.props.userInfo.userId, userName: this.props.userInfo.userName,subject }}
                                            outputUrl={`${DOMAIN_OXT}/apiv2_/order/invoice/exportinvoice`}
                                            downloadUrl={`${DOMAIN_OXT}/apiv4_/v1/sppayu/download/download`}
                                            callback={this.handleChangeExportStatus}
                                            beforeOutput ={()=>this.handleVerifyBefore(count3,'电子_普通发票')}
                                            type={1}
                                            pollUrl={`${DOMAIN_OXT}/apiv2_/order/invoice/progress`}
                                            pollData={{ type: 3, userId: this.props.userInfo.userId, userName: this.props.userInfo.userName }}
                                        >

                                            <Badge count={count3}><Button style={{ height: 'auto', width: 150, marginLeft: 40, padding: 5 }}><Icon type="cloud-download-o" style={{ fontSize: 16 }} />导出<br />电子_普通发票信息</Button></Badge>
                                        </OutputFile>
                                        

                                    </Col>
                                    <Col span={6}>
                                        <Link to={`${DOMAIN_OXT}/newadmin/financial/invoice/importexport/records`} style={{ float: "right" }} >查看导入导出历史</Link>
                                    </Col>
                                    <Col span={24} style={{ marginTop: 15 }}>
                                        <UploadFile
                                            uploadUrl={uploadUrl}
                                            pollData={{
                                                topic: 2,
                                                userId: this.props.userInfo.userId,
                                                userName: this.props.userInfo.userName,
                                                subject
                                            }}
                                            accept={['.xls', '.xlsx']}
                                            uploadData={{
                                                userId: this.props.userInfo.userId,
                                                userName: this.props.userInfo.userName,
                                                type: 1,
                                                subject
                                            }}
                                            success={() => this.handleSearch()}
                                            pollUrl={pollUrl}>
                                            <Badge count={''}>
                                                <Button icon="cloud-upload-o" style={{ height: 'auto', width: 150,  padding: 5 }}>
                                                    导入<br />纸质_发票信息</Button>
                                            </Badge>
                                        </UploadFile>
                                        {/* <Badge count={''} style={{ marginRight: 40 }}><Button style={{ height: 'auto', width: 150,padding:5 }}><Icon type="cloud-upload-o" style={{ fontSize: 16 }} />导入<br />纸质_发票信息</Button></Badge> */}

                                        <UploadFile
                                            uploadUrl={uploadUrl}
                                            pollData={{
                                                topic: 2,
                                                userId: this.props.userInfo.userId,
                                                userName: this.props.userInfo.userName,
                                                subject
                                            }}
                                            accept={['.xls', '.xlsx']}
                                            uploadData={{
                                                userId: this.props.userInfo.userId,
                                                userName: this.props.userInfo.userName,
                                                type: 3,
                                                subject
                                            }}
                                            success={() => this.handleSearch()}
                                            pollUrl={pollUrl}>
                                            <Badge count={''}>
                                                <Button icon="cloud-upload-o" style={{ height: 'auto', width: 150, marginLeft: 40, padding: 5 }}>
                                                    导入<br />电子_普通发票信息</Button>
                                            </Badge>
                                        </UploadFile>
                                    </Col>


                                </Row>
                        }
                        {
                            type === 2 &&
                            <Row type="flex" justify="start" align="middle">
                                <Col span={18}>
                                    <OutputFile
                                        outputParams={{ userId: this.props.userInfo.userId, userName: this.props.userInfo.userName }}
                                        outputUrl={`${DOMAIN_OXT}/apiv2_/order/invoice/exportinvoicepost`}
                                        downloadUrl={`${DOMAIN_OXT}/apiv4_/v1/sppayu/download/download`}
                                        callback={this.handleChangeExportStatus}
                                        beforeOutput ={()=>this.handleVerifyBefore(count4,'寄送信息')}
                                        type={1}
                                        pollUrl={`${DOMAIN_OXT}/apiv2_/order/invoice/progress`}
                                        pollData={{ userId: this.props.userInfo.userId, userName: this.props.userInfo.userName }}
                                    >

                                        <Badge count={count4}><Button>导出寄送信息</Button></Badge>
                                    </OutputFile>
                                    <UploadFile
                                        uploadUrl={uploadUrl}
                                        pollData={{
                                            topic: 2,
                                            userId: this.props.userInfo.userId,
                                            userName: this.props.userInfo.userName,
                                        }}
                                        accept={['.xls', '.xlsx']}
                                        uploadData={{
                                            userId: this.props.userInfo.userId,
                                            userName: this.props.userInfo.userName,
                                            type: 4,
                                        }}
                                        success={() => this.handleSearch()}
                                        pollUrl={pollUrl}>
                                        <Badge count={''}>
                                            <Button style={{ marginLeft: 15 }}>导入快递号</Button>
                                        </Badge>
                                    </UploadFile>
                                    {/* <Badge count={5}><Button style={{ marginLeft: 15 }}>导入快递号</Button></Badge> */}
                                </Col>
                                <Col span={6}>
                                    <Link to={`${DOMAIN_OXT}/newadmin/financial/express/importexport/records`} style={{ float: "right" }} >查看导入导出历史</Link>
                                </Col>
                            </Row>
                        }
                        </Spin>


                    </div>

                    <QueueAnim type="bottom" delay="300">
                        <Table columns={this.columns(type)}
                            key={subject}
                            rowKey={(record: any) => record.id}
                            dataSource={dataSource}
                            loading={fetching}
                            scroll={{ y: window.innerHeight*0.6 }}
                            pagination={this.pagination()}
                        />
                    </QueueAnim>

                </div>

            </QueueAnim>
        )
    }

}
const mapStateToProps = (state: Any.Store, ownProps: TOwnProps): TStateProps => {
    const data = state.get('invoicesSendReducers');
    return {
        dataSource: data.get('dataSource').toJS(),
        searchParams: data.get('searchParams').toJS(),
        total: data.get('total'),
        fetching: data.get('fetching'),
        userInfo: state.getIn(['routerPermission', 'permission', 'userInfo']),
        exportdatacount: data.get('exportdatacount'),
    }
}
// export default CashoutNeedsApproval
export default connect(mapStateToProps)(InvoicesList)