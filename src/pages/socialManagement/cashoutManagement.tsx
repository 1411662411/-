/**
 * Created by yangws on 2017/11/24.
 */
import * as React from 'react';
import * as QueueAnim from "rc-queue-anim/lib";
import * as moment from 'moment';
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
    Tabs,
} from 'antd';
import { Link } from 'react-router';
import { statePaginationConfig } from '../../util/pagination';
import { browserHistory } from 'react-router';
import { ROUTER_PATH,DOMAIN_OXT,WSS } from '../../global/global';
import {
    cashoutManagementSaga,
} from '../../action/socialManagement/cashoutManagementAction';
import { formatDateTime,accAdd,formatMoney } from '../../util/util';
import { OutputFile } from '../../businessComponents/common/outputFile';
import {
    PAGINATION_PARAMS
} from '../../global/global';

const RangePicker = DatePicker.RangePicker;
const MonthPicker = DatePicker.MonthPicker;
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const Option = Select.Option;
interface CashoutManagementProps {
    dispatch?: any;
    dataSource: [any];
    fetching: boolean;
    userInfo: any;
    total:number;

}
const payeeTypeMap = {
    '1':'服务商',
    '2':'分公司'
};

class CashoutManagement extends React.Component<CashoutManagementProps, any> {
    constructor(props) {
        super(props);
        this.state = {
            isExporting:false,
            searchParams: {
                ...PAGINATION_PARAMS,
                orderCode: '',  //  请款单号
                socialPaymentMonthStart: null,
                socialPaymentMonthEnd: null,
                // endOpen: false,
                factplanPayTimeStart: null,  // 开始时间
                factplanPayTimeEnd: null,  // 结束时间
                cashoutMoney: '',  // 请款总金额
                payeeType: '',  // 收款方类型
                payeeName: '',  //收款方名称
                exportStatus: '',  // 导出状态
            },
            selectedRowKeys: [],  // 全选 和 单选
        }
    }
    
    columns: [any] = [
        {
            title: "请款单号",
            dataIndex: 'code',
            key: 'code',
            width: 250,
            render: (data) => {
                return (
                    <a onClick={(e) => { e.preventDefault(); this.setSessionStorageParams({ params: { orderCode: data } }); }}>{data}</a>);
            }
        }, {
            title: '社保缴费月（操作月）',
            key: 'socialPaymentMonth',
            dataIndex: 'socialPaymentMonth',
            width: 150,
            render:(data)=> (
                data || '/'
            )
        }, {
            title: '付款时间',
            dataIndex: 'payTime',
            key: 'payTime',
            width: 120,
            render: (data) => {
                return moment(data*1000).format('YYYY-MM-DD HH:mm')
            }
        }, {
            title: '请款总金额',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
            width: 100,
            render:(data)=> (
                formatMoney(data,2,'')
            )
        }, {
            title: '收款方类型',
            dataIndex: 'payeeType',
            key: 'payeeType',
            width: 120,
            render: (data) => {
                return payeeTypeMap[data];
            }
        }, {
            title: '收款方名称',
            dataIndex: 'payeeName',
            key: 'payeeName',
            width: 250,
        }
        // , 
        // {
        //     title: '导出状态',
        //     dataIndex: 'exportCustomerAndAdvancedStatus',
        //     key: 'exportCustomerAndAdvancedStatus',
        //     width: 120,
        //     render: (data) => {
        //         // 0 未导出 2已导出
        //         return data==1?'已导出':'未导出';
        //     }
        // },
        //  {
        //     title: '操作',
        //     key: 'Operate',
        //     width: 120,
        //     render: (data) => {
        //         return (
                   
        //             <OutputFile
        //                 outputParams= {[data.code]} 
        //                 outputUrl={`${DOMAIN_OXT}/apiv3_/v1/sppay/export/sppayment/bill/customer/advanced`}
        //                 contentType='application/json'
        //                 downloadUrl = {`${DOMAIN_OXT}/apiv4_/v1/sppayu/download/download`}
        //                 callback = {this.handleChangeExportStatus}
        //                 pollUrl = {`${DOMAIN_OXT}/apiv4_/v1/sppayu/schedule/get`}
        //                 pollData= {{ type: 5 , userId: this.props.userInfo.userId} }
        //                 >
                        
        //                 <a href="#">导出</a>
        //             </OutputFile>
        //         )
        //     }
        // }
        
        

    ]
    componentWillMount() {
        // 默认加载
        this.handleSearch();
    }
    handleSearch = ()=> {
        this.setState({selectedRowKeys:[]});
        this.props.dispatch(cashoutManagementSaga(this.state.searchParams));// 第一步 UI组件出发action创建函数
    }
    setSessionStorageParams = (params) => {
        
        sessionStorage.setItem('spPayment', JSON.stringify(params))
        browserHistory.push(`${DOMAIN_OXT}/newadmin/financial/cashout/payinfo/check`);

        
        
    };
    goPayBill = ()=> {
        browserHistory.push(`${DOMAIN_OXT}/newadmin/social/cashout/management/bill`);
    }
    handleResetParams = ()=> {
        const params = {
            orderCode: '',  //  请款单号
            socialPaymentMonthStart: null,
            socialPaymentMonthEnd: null,
            // endOpen: false,
            factplanPayTimeStart: null,  // 开始时间
            factplanPayTimeEnd: null,  // 结束时间
            cashoutMoney: '',  // 请款总金额
            payeeType: '',  // 收款方类型
            payeeName: '',  //收款方名称
            exportStatus: '',  // 导出状态
        }
        this.setState({ searchParams: {...this.state.searchParams,...params} });
        
    }
    
    /* 更新搜索参数 */
    handleChangeParams = (param) => {
        const { searchParams } = this.state;
        let newSearchParems = {
            ...searchParams,
            ...param
        }
        this.setState({ searchParams: newSearchParems });
        return newSearchParems
    };
    pagination = () => {
        const {
            dispatch,
            total,
        } = this.props;
        const {searchParams} = this.state;
        const {
            currentPage,
            pageSize,
        } = searchParams;
      
        const setCurrentPage = (currentPage,pageSize) => {
            this.setState({selectedRowKeys: []});
            this.setSearchParamState({ 'currentPage': currentPage,'pageSize':pageSize})
        }
        return statePaginationConfig({ ...searchParams, currentPage, total, pageSize }, cashoutManagementSaga, dispatch,setCurrentPage)
    }
    setSearchParamState = (param) => {
        const {searchParams} = this.state;
        let newSearchParams = {
            ...searchParams,
            ...param,
        }
        this.setState({
            searchParams:newSearchParams
        })
    }
    /**
     * 上传状态
     * @param isExporting boolean
     */
    handleChangeExportStatus = (isExporting:boolean) => {
        const { searchParams} = this.state;
        this.setState({isExporting:isExporting});
        !isExporting&&this.props.dispatch(cashoutManagementSaga(searchParams));
    }
    onSelectChange = (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
    }
    // 批量导出
    handleBatchOut = () => {
        const { selectedRowKeys } = this.state;

        
        
        if (selectedRowKeys.length < 1) {
            message.warning('请先选择！');
            return false;
        }
        
    }
    socialPayMonthProps = (type)=> {
        const isEnd = type == 'end';
        
        const {
            socialPaymentMonthStart,
            socialPaymentMonthEnd,
        } = this.state.searchParams;
        const startTime = socialPaymentMonthStart?moment(socialPaymentMonthStart):null;
        const endTime = socialPaymentMonthEnd?moment(socialPaymentMonthEnd):null;
        const value = isEnd?endTime:startTime;
        const placeholder = isEnd?'结束月':'起始月';
        let props : {
            disabledDate:any;
            onChange(x: any, y: any): void;
            placeholder?:string;
            value?: any;
        } =  { 
            disabledDate:(date)=>{
                if(isEnd){
                    if (!date || !socialPaymentMonthStart) {
                        return false;
                    }
                    
                    return date.valueOf() < moment(socialPaymentMonthStart).valueOf();
                }else{
                    if (!date || !socialPaymentMonthEnd) {
                        return false;
                    }
                    return date.valueOf() >= moment(socialPaymentMonthEnd).valueOf();
                }
                
            },
            value,
            placeholder,
            // value:isEnd?socialPaymentMonthEnd:socialPaymentMonthStart,
            onChange:(date,dateString)=>{
                if(isEnd){
                    this.setSearchParamState({'socialPaymentMonthEnd':dateString})
                }else{
                    this.setSearchParamState({'socialPaymentMonthStart':dateString})
                }
                
            },
            
            
        }
        return props;
    }
    RangePickerProps= ()=>{
        const {
           
            factplanPayTimeStart,  // 开始时间
            factplanPayTimeEnd,  // 结束时间
           
        } = this.state.searchParams;
        const startTime = factplanPayTimeStart?moment(factplanPayTimeStart):null;
        const endTime = factplanPayTimeStart?moment(factplanPayTimeEnd):null;
        let props :{
            value?:[any,any]
        } = {
            value:[startTime,endTime]
        }
        return props;
    }
    handleValidate(obj) {
        obj = obj.replace(/[^\d.]/g, "");
        //必须保证第一位为数字而不是.   
        obj = obj.replace(/^\./g, "");
        //保证只有出现一个.而没有多个.   
        obj = obj.replace(/\.{2,}/g, ".");
        //保证 . 只出现一次，而不能出现两次以上   
        obj = obj.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
        return obj;
    }
    render() {
        const { dataSource ,
            fetching,
            userInfo,
        } = this.props;
        const { selectedRowKeys,searchParams } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        }
        const {
            socialPaymentMonthStart,
            socialPaymentMonthEnd,
            orderCode,
            factplanPayTimeStart,  // 开始时间
            factplanPayTimeEnd,  // 结束时间
            cashoutMoney,  // 请款总金额
            payeeType,  // 收款方类型
            payeeName,  //收款方名称
            exportStatus,  // 导出状态
        } = searchParams;
        const startTime = factplanPayTimeStart?moment(factplanPayTimeStart):null;
        const endTime = factplanPayTimeStart?moment(factplanPayTimeEnd):null;

       
        
        return (
                <QueueAnim>
                    <Spin tip="导出中..." spinning={this.state.isExporting}>
                        <div className="searchForm2">
                            <Form layout="inline">
                                <FormItem label="请款单号：">
                                    <Input onChange={e => { this.handleChangeParams({ orderCode: e.target['value'] }) }} value={orderCode}></Input>
                                </FormItem>
                                
                                <FormItem label="社保缴费月（操作月）：">
                                    <MonthPicker 
                                        {...this.socialPayMonthProps('start')}
                                    ></MonthPicker>
                                    <span className="ant-calendar-range-picker-separator"> ~ </span>
                                    <MonthPicker 
                                        {...this.socialPayMonthProps('end')}
                                    ></MonthPicker>
                                </FormItem>
                                <FormItem label="付款时间：">
                                    <RangePicker
                                        
                                        {...this.RangePickerProps()}
                                        onChange={(date, dateString) => { this.handleChangeParams({ factplanPayTimeStart: dateString[0], factplanPayTimeEnd: dateString[1] }) }}
                                    ></RangePicker>
                                </FormItem>
                                <FormItem label="请款总金额：">
                                    <Input style={{ width: 100 }}
                                        value={cashoutMoney}
                                        onChange={e => { this.handleChangeParams({ cashoutMoney: this.handleValidate(e.target['value']) }) }}>
                                    </Input>
                                </FormItem>
                                <FormItem label="收款方类型：">
                                    <Select
                                        style={{ width: 100 }}
                                        value={payeeType}
                                        onChange={(value) => { this.handleChangeParams({ payeeType: value }) }}
                                    >
                                        <option value=''>全部</option>
                                        <option value='1'>服务商</option>
                                        <option value='2'>分公司</option>
                                        
                                    </Select>
                                </FormItem>
                                <FormItem label="收款方名称：">
                                    <Input value={payeeName} onChange={e => { this.handleChangeParams({ payeeName: e.target['value'] }) }}></Input>
                                </FormItem>
                                
                                <FormItem>
                                    <Button type="primary" onClick={() => { this.handleSearch() }}>搜索</Button>
                                    <Button style={{ marginLeft: 8 }}  onClick={e => this.handleResetParams()}>重置</Button>
                                </FormItem>
                            </Form>
                        </div>
                        <div key="spPaymentTable" style={{marginTop:'30px'}}>
                            <Table
                                dataSource={dataSource}
                                rowKey={(record: any) => record.code}
                                columns={this.columns}
                                rowSelection={rowSelection}
                                scroll={{ y: window.innerHeight*0.6 }}
                                pagination={this.pagination()}
                            ></Table>
                            <Row>
                                <Col span={12}>
                                    
                                    <OutputFile
                                        outputParams= {selectedRowKeys} 
                                        contentType='application/json'
                                        outputUrl={`${DOMAIN_OXT}/apiv3_/v1/sppay/export/sppayment/bill/customer/advanced`}
                                        downloadUrl = {`${DOMAIN_OXT}/apiv4_/v1/sppayu/download/download`}
                                        callback ={this.handleChangeExportStatus}
                                        pollUrl = {`${DOMAIN_OXT}/apiv4_/v1/sppayu/schedule/get`}
                                        pollData= {{ type: 5 , userId: userInfo.userId} }
                                        >
                                        <Button type="primary" disabled={!(selectedRowKeys.length>0)}>批量导出付款清单（客户维度）与垫款明细</Button>
                                    </OutputFile>
                                    <Button style={{marginLeft:'20px'}} type="primary" onClick={() => { this.goPayBill() }}>批量导出付款账单（人月次维度）</Button>
                                    
                                    
                                </Col>
                            </Row>
                        </div>
                    </Spin>
                </QueueAnim>
        )
    }
    
}
function mapStateToProps(state?: any) {
    const data = state.get('cashoutManagementReducer');
    return {
        dataSource: data.get('dataSource').toJS(),
        fetching: data.get('fetching'),
        total:data.get('total'),
        userInfo: state.getIn(['routerPermission', 'permission', 'userInfo']),

    }
}
export default connect(mapStateToProps)(CashoutManagement)
