/**
 * Created by yangws on 2017/5/16.
 */
import * as React from 'react';
import * as QueueAnim from "rc-queue-anim/lib";
import * as moment from 'moment';
import { browserHistory } from 'react-router';
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
    Popconfirm,
    Popover,
    Tooltip,
    Icon
} from 'antd';
import { Link } from 'react-router';
import { paginationConfig } from '../../util/pagination';
import { ROUTER_PATH,DOMAIN_OXT,WSS } from '../../global/global';

import "./../../css/components/infoComponent";
import "./../../css/socialManagement/cashoutNeedsApproval";
import {cashoutApprovalColumns} from '../../components/common/columns/cashoutApprovalColumns';
import {BatchApproval,SingleApproval} from '../../components/socialManagement/batchApproveUi';
import { OutputFile } from '../../businessComponents/common/outputFile';
import {Organizations} from '../../components/common/organizationsUi';
import {
    cashoutNeedsApprovalSaga,
    cashoutSubmitterData,
    approvalHandlerData,
    updateCacheSearchParams,
    updateSearchParams,
    cashoutSelectedRowData,
    batchExportPaymentSaga,
    masterApproveSaga,
    userByOrganizationsSaga,
    useMapSaga,
} from '../../action/socialManagement/cashoutNeedsApprovalAction';
import { formatDateTime,accAdd,formatMoney } from '../../util/util';

const FormItem = Form.Item;
const { Option, OptGroup } = Select;
const RadioGroup = Radio.Group;
const RangePicker = DatePicker.RangePicker;

// interface CashoutNeedsApprovalProps {
   
//     selectedTotalMoney: any; 
// }

interface TStateProps {
    dataSource: any[];
    userByOrganizationsData: any;
    userMapData:any;
    userInfo:any;
    selectedRowKeys:any[];
    fetching: boolean;
    total: number;
    searchParams: any;
    cacheSearchParams: any;
    batchExportUrl:string;
    searchStatus: boolean;
}
interface TOwnProps {
    /** 角色 0 业务方 1 财务  2 ceo */
    role: any;
}
interface TDispatchProps {
    dispatch: Any.Dispatch<any>;
}
type CashoutNeedsApprovalProps = TStateProps & TOwnProps & TDispatchProps;

interface columns {
    (data?): [any];
}
const payeeTypeMap = {
    '1':'服务商',
    '2':'分公司'
};
// 请款审批状态 0：待审批 1：审批通过 2：审批驳回 3：已取消
 const  approvalStatusMap = {
    '0':'待审批',
    '1':'审批通过',
    '2':'审批驳回',
    '3':'已取消',
    
}
const socialPayTypeMap = {
    '1':'代缴社保款',
}
/**
 * 判断是否为空
 * @param {any} value 值
 * @return {any} 
 */
const isEmpty = (value) => {
    return value === null || value === undefined || value === '' ? '/' : value;
};

const codePopover =(
    <div>
      <p><span style={{color:'orange'}}>橙色</span> 的请款单号表示：垫款金额 ≥ 100,000.00；</p>
      <p><span style={{color:'#22baa0'}}>绿色</span>{' 的请款单号表示：垫款金额 < 100,000.00。'}</p>
    </div>
);
class CashoutNeedsApproval extends React.Component<CashoutNeedsApprovalProps, any> {
    orderCode: any;
    cName: any;
    // 角色 0 业务方 1 财务  2 ceo
    role: any;
    userMapData:any;
    constructor(props) {
        super(props);
        this.role = props.role||0;
        
    };
    
    columns:columns = (param) => {
        
        return [
            [{
                title: '请款单号',
                dataIndex: 'code',
                key: 'code',
                width: "150px",
                fixed: 'left',
                render: (data) => {
                    return (
                        <a onClick={(e) => { e.preventDefault(); this.setSessionStorageParams({ url: `${ROUTER_PATH}/newadmin/social/business/cashout/approve`, name: 'cashoutApproveDetailsBusiness', params: { orderCode: data } }); }}>{data}</a>);
                }
            }, {
                // title:(<span dangerouslySetInnerHTML={{__html:'付款截止时间<br>倒计时'}}></span>),
                title: '客服计划付款时间倒计时',
                dataIndex: 'countdown',
                key: 'countdown',
                width: "100px",
                render: (data) => {
                    if(data ==='/'){
                        return data;
                    }else{
                        return <span style={{color:'red'}}>{data}</span>
                    }
                }
            }, {
                title: '客服计划付款截止日',
                key: 'requestCutOffTime',
                dataIndex: 'requestCutOffTime',
                width: "150px",
                render: (data) => {
                    return moment(data*1000).format('YYYY-MM-DD HH:mm')
                }
            }, {
                title: '创建时间',
                key: 'createTime',
                dataIndex: 'createTime',
                width: "175px",
                render: (data) => {
                    return moment(data*1000).format('YYYY-MM-DD HH:mm:ss')
                }
            }, {
                title: '收款方类型',
                key: 'detailPayeeType',
                dataIndex: 'detailPayeeType',
                width: "100px",
                render: (data) => {
                    return payeeTypeMap[data];
                }
            }, {
                title: '收款方名称',
                key: 'payeeName',
                dataIndex: 'payeeName',
                width: "250px",
            }, {
                title: '请款单类型',
                key: 'socialPayTypea',
                width: "100px",
                render: ()=>{
                    return '代缴社保款';
                }
            }, {
                // title:(<span dangerouslySetInnerHTML={{__html:'社保缴费月<br>（操作月）'}}></span>),
                title: '社保缴费月（操作月）',
                key: 'socialMonth',
                dataIndex: 'socialPaymentMonth',
                width: "100px",

            }, {
                title: '请款提交人',
                key: 'cashoutSubmitter',
                dataIndex: 'submitterId',
                width: "175px",
                render: (data) => {
                    if (!data || param.userMapData.length < 1) {
                        return '/';
                    }
                    return <span> {`${param.userMapData[data].name||''}/${param.userMapData[data].phone||''}`}</span>;
                }
            }, {//18
            title: '审批经手人',
            key: 'handleUserList',
            dataIndex: null,
            width: "300px",
            render: (data) => {
                if (!data.handleUserList || param.userMapData.length < 1) {
                    return '/';
                }
                
                const style = {
                    whiteSpace: 'nowrap',
                    width: '250px',
                    color: 'green',
                    overflow: 'hidden' as 'hidden',
                    display: 'block',
                    textOverflow: 'ellipsis',
                    cursor: 'pointer',
                }
                const tooltipData:Array<JSX.Element> = [];
                const handleUserList = data.handleUserList;
                // ceo部门id
                const ceoOrganizationId = data.ceoOrganizationId;
                // CSO部门id
                const csoOrganizationId = data.csoPositionId;
                const tooltipTextId = handleUserList[0];
                
                const positionString = param.userMapData[tooltipTextId].positionString;
                const organizationId = param.userMapData[tooltipTextId].organizationId;
                const positionId = param.userMapData[tooltipTextId].positionId;
                const tooltipText = (organizationId==ceoOrganizationId)?'CEO':((positionId==csoOrganizationId)?'CSO':`${param.userMapData[tooltipTextId].name || ''}(${positionString || ''})/${param.userMapData[tooltipTextId].phone || ''}`)
                handleUserList.map(person => {
                    // ceo不显示姓名和手机号
                    if(param.userMapData[person].organizationId==ceoOrganizationId){
                        tooltipData.push(<p className="approvePass">CEO</p>)
                    }else if(param.userMapData[person].positionId==csoOrganizationId){
                        tooltipData.push(<p className="approvePass">CSO</p>)
                    }else{
                        tooltipData.push(<p className="approvePass">
                        {`${param.userMapData[person].name || ''}(${param.userMapData[person].positionString || ''})/${param.userMapData[person].phone || ''}`}</p>)
                    }
                    
                })
                return (
                    <Tooltip placement="bottomLeft" title={tooltipData}>
                        <div style={style}>{tooltipText}</div>
                    </Tooltip>

                );
            }
        }, {
                title: '操作',
                key: 'action',
                width: "100px",
                fixed: 'right',

                render: (data) => {
                    const status= data.status;
                    if(status ===3){
                        return  <p>已取消</p>
                    }
                    return (
                        <a onClick={(e) => { e.preventDefault(); this.setSessionStorageParams({ url: `${ROUTER_PATH}/newadmin/social/business/cashout/approve`, name: 'cashoutApproveDetailsBusiness', params: { orderCode: data.code } }); }}>审批</a>);
                }
            }],
            /**
             * 财务列表
             */
            [{
                title: '请款单号',
                dataIndex: 'code',
                key: 'code',
                width: "150px",
                fixed: 'left',
                render: (data) => {
                    return (
                        <a onClick={(e) => { e.preventDefault(); this.setSessionStorageParams({ url: `${ROUTER_PATH}/newadmin/financial/cashout/approve`, name: 'cashoutApproveDetailsFinancial', params: { orderCode: data } }); }}>{data}</a>);
                }
            }, {
                // title:(<span dangerouslySetInnerHTML={{__html:'付款截止时间<br>倒计时'}}></span>),
                title: '客服计划付款时间倒计时',
                dataIndex: 'countdown',
                key: 'countdown',
                width: "100px",
                render: (data) => {
                    if(data ==='/'){
                        return data;
                    }else{
                        return <span style={{color:'red'}}>{data}</span>
                    }
                }
            }, {
                title: '客服计划付款截止日',
                key: 'requestCutOffTime',
                dataIndex: 'requestCutOffTime',
                width: "150px",
                render: (data) => {
                    return moment(data*1000).format('YYYY-MM-DD HH:mm')
                }
            }, {
                title: '创建时间',
                key: 'createTime',
                dataIndex: 'createTime',
                width: "150px",
                render: (data) => {
                    return moment(data*1000).format('YYYY-MM-DD HH:mm')
                }
            }, {
                title: '导出状态',
                key: 'exportCustomerStatus',
                dataIndex: 'exportCustomerStatus',
                width: "150px",
                render: (data) => {
                    // 0 未导出 2已导出
                    return data==1?'已导出':'未导出';
                }
            }, {
                title: '社保业务请款性质',
                key: 'socialPayType',
                dataIndex: 'socialPayType',
                width: "150px",
                render: (data) => {
                    // 1 实付请款 2预付请款
                    return data==1?'实付请款':'预付请款';
                }
            }, {
                title: '收款方类型',
                key: 'detailPayeeType',
                dataIndex: 'detailPayeeType',
                width: "100px",
                render: (data) => {
                    return payeeTypeMap[data];
                }
            }, {
                title: '收款方名称',
                key: 'payeeName',
                dataIndex: 'payeeName',
                width: "250px",
            }, {
                title: '请款单类型',
                key: 'socialPayTypea',
                width: "100px",
                render: ()=>{
                    return '代缴社保款';
                }
            }, {
                title: '代发代付金额',
                key: 'behalfPaymentFee',
                dataIndex: 'behalfPaymentFee',
                width: "100px",
                render:(data)=> (
                    formatMoney(data,2,'')
               )
            }, {
                title: '人月次',
                key: 'manMonthTimes',
                dataIndex: 'manMonthTimes',
                width: "100px",
            }, {
                title: '服务费',
                key: 'serviceFee',
                dataIndex: 'serviceFee',
                width: "100px",
                render:(data)=> (
                    formatMoney(data,2,'')
               )
            }, {
                title: '人均服务费（服务费/人月次）',
                key: 'serviceFeeAvg',
                dataIndex: 'serviceFeeAvg',
                width: "150px",
                render:(data)=> (
                    formatMoney(data,2,'')
               )
            }, {
                title: '垫付金额',
                key: 'advancePaymentFee',
                dataIndex: 'advancePaymentFee',
                width: "100px",
                render:(data)=> (
                    formatMoney(data,2,'')
               )
            }, {
                title: '请款总金额',
                key: 'totalAmount',
                dataIndex: 'totalAmount',
                width: "150px",
                render:(data)=> (
                    formatMoney(data,2,'')
               )
            }, {
                // title:(<span dangerouslySetInnerHTML={{__html:'社保缴费月<br>（操作月）'}}></span>),
                title: '社保缴费月（操作月）',
                key: 'socialMonth',
                dataIndex: 'socialPaymentMonth',
                width: "100px",

            }, {
                title: '请款提交人',
                key: 'cashoutSubmitter',
                dataIndex: 'submitterId',
                width: "175px",
                render: (data) => {
                    
                    if (!data || param.userMapData.length < 1) {
                        return '/';
                    }
                    return <span> {`${param.userMapData[data].name||''}/${param.userMapData[data].phone||''}`}</span>;
                }
            }, {//18
                title: '审批经手人',
                key: 'handleUserList',
                dataIndex: null,
                width: "300px",
                render: (data) => {
                    if (!data.handleUserList || param.userMapData.length < 1) {
                        return '/';
                    }
                    
                    const style = {
                        whiteSpace: 'nowrap',
                        width: '250px',
                        color: 'green',
                        overflow: 'hidden' as 'hidden',
                        display: 'block',
                        textOverflow: 'ellipsis',
                        cursor: 'pointer',
                    }
                    const tooltipData:Array<JSX.Element> = [];
                    const handleUserList = data.handleUserList;
                    // ceo部门id
                    const ceoOrganizationId = data.ceoOrganizationId;
                    // CSO部门id
                    const csoOrganizationId = data.csoPositionId;
                    const tooltipTextId = handleUserList[0];
                    
                    const positionString = param.userMapData[tooltipTextId].positionString;
                    const organizationId = param.userMapData[tooltipTextId].organizationId;
                    const positionId = param.userMapData[tooltipTextId].positionId;
                    const tooltipText = (organizationId==ceoOrganizationId)?'CEO':((positionId==csoOrganizationId)?'CSO':`${param.userMapData[tooltipTextId].name || ''}(${positionString || ''})/${param.userMapData[tooltipTextId].phone || ''}`)
                    handleUserList.map(person => {
                        // ceo不显示姓名和手机号
                        if(param.userMapData[person].organizationId==ceoOrganizationId){
                            tooltipData.push(<p className="approvePass">CEO</p>)
                        }else if(param.userMapData[person].positionId==csoOrganizationId){
                            tooltipData.push(<p className="approvePass">CSO</p>)
                        }else{
                            tooltipData.push(<p className="approvePass">
                            {`${param.userMapData[person].name || ''}(${param.userMapData[person].positionString || ''})/${param.userMapData[person].phone || ''}`}</p>)
                        }
                        
                    })
                    return (
                        <Tooltip placement="bottomLeft" title={tooltipData}>
                            <div style={style}>{tooltipText}</div>
                        </Tooltip>

                    );
                }
            }, {
                title: '操作',
                key: 'action',
                width: "100px",
                fixed: 'right',

                render: (data) => {
                    const status= data.status;
                    if(status ===3){
                        return  <p>已取消</p>
                    }
                    return (
                        <a onClick={(e) => { e.preventDefault(); this.setSessionStorageParams({ url: `${ROUTER_PATH}/newadmin/financial/cashout/approve`, name: 'cashoutApproveDetailsFinancial', params: { orderCode: data.code } }); }}>审批</a>);
                }
            }],
            /**
             * ceo列表
             */
            [{
                title: <div>请款单号<Popover content={codePopover} title=""><Icon style={{marginLeft:'5px',color:'#FFBF00'}} type="question-circle" /></Popover></div>,
                dataIndex: null,
                key: 'code',
                width: "150px",
                render: (data) => {
                    const advancePaymentFee = Number.parseFloat(data.advancePaymentFee)||0;
                    const code = data.code
                    return (
                        <a style={{color: advancePaymentFee<100000?'#22baa0':'orange'}} onClick={(e) => { e.preventDefault(); this.setSessionStorageParams({ url: `${ROUTER_PATH}/newadmin/ceo/cashout/approve`, name: 'cashoutApproveDetailsCeo', params: { orderCode: code } }); }}>{code}</a>);
                }
            }, {
                // title:(<span dangerouslySetInnerHTML={{__html:'付款截止时间<br>倒计时'}}></span>),
                title: '财务计划支付时间',
                dataIndex: null,
                key: 'payTime',
                render: (data,record, index) => {
                    
                    return this.renderColumns(data, index, 'planTimeObj', data.payTime?moment(data.payTime*1000).format('YYYY-MM-DD'):'/');
                    
                },
                width: "150px",
            }, {
                // title:(<span dangerouslySetInnerHTML={{__html:'付款截止时间<br>倒计时'}}></span>),
                    title: '客服计划付款时间倒计时',
                dataIndex: 'countdown',
                key: 'countdown',
                width: "100px",
                render: (data) => {
                    if(data ==='/'){
                        return data;
                    }else{
                        return <span style={{color:'red'}}>{data}</span>
                    }
                }
            }, {
                    title: '客服计划付款截止日',
                key: 'requestCutOffTime',
                dataIndex: 'requestCutOffTime',
                width: "150px",
                render: (data) => {
                    return moment(data*1000).format('YYYY-MM-DD HH:mm')
                }
            }, {
                title: '创建时间',
                key: 'createTime',
                dataIndex: 'createTime',
                width: "150px",
                render: (data) => {
                    return moment(data * 1000).format('YYYY-MM-DD HH:mm:ss')
                }
            }, {
                title: '收款方类型',
                key: 'detailPayeeType',
                dataIndex: 'detailPayeeType',
                width: "100px",
                render: (data) => {
                    return payeeTypeMap[data];
                }
            }, {
                title: '收款方名称',
                key: 'payeeName',
                dataIndex: 'payeeName',
                width: "250px",
            }, {
                title: '代发代付金额',
                key: 'behalfPaymentFee',
                dataIndex: 'behalfPaymentFee',
                width: "100px",
                render:(data)=> (
                    formatMoney(data,2,'')
               )
            }, {
                title: '人月次',
                key: 'manMonthTimes',
                dataIndex: 'manMonthTimes',
                width: "100px",
            }, {
                title: '服务费',
                key: 'serviceFee',
                dataIndex: 'serviceFee',
                width: "100px",
                render:(data)=> (
                    formatMoney(data,2,'')
               )
            }, {
                title: '人均服务费（服务费/人月次）',
                key: 'serviceFeeAvg',
                dataIndex: 'serviceFeeAvg',
                width: "150px",
                render:(data)=> (
                    formatMoney(data,2,'')
               )
            }, {
                title: '垫付金额',
                key: 'advancePaymentFee',
                dataIndex: 'advancePaymentFee',
                width: "100px",
                render:(data)=> (
                    formatMoney(data,2,'')
               )
            }, {
                title: '请款总金额',
                key: 'totalAmount',
                dataIndex: 'totalAmount',
                width: "150px",
                render:(data)=> (
                    formatMoney(data,2,'')
               )
            }, {
                title: '请款单类型',
                key: 'socialPayTypea',
                width: "100px",
                render: ()=>{
                    return '代缴社保款';
                }
            }, {
                // title:(<span dangerouslySetInnerHTML={{__html:'社保缴费月<br>（操作月）'}}></span>),
                title: '社保缴费月（操作月）',
                key: 'socialMonth',
                dataIndex: 'socialPaymentMonth',
                width: "100px",

            }, {
                title: '请款提交人',
                key: 'cashoutSubmitter',
                dataIndex: 'submitterId',
                width: "175px",
                render: (data) => {
                    if (!data || param.userMapData.length < 1) {
                        return '/';
                    }
                    return <span> {`${param.userMapData[data].name||''}/${param.userMapData[data].phone||''}`}</span>;
                }
            }, {//18
                title: '审批经手人',
                key: 'handleUserList',
                dataIndex: null,
                width: "300px",
                render: (data) => {
                    if (!data.handleUserList || param.userMapData.length < 1) {
                        return '/';
                    }
                    
                    const style = {
                        whiteSpace: 'nowrap',
                        width: '250px',
                        color: 'green',
                        overflow: 'hidden' as 'hidden',
                        display: 'block',
                        textOverflow: 'ellipsis',
                        cursor: 'pointer',
                    }
                    const tooltipData:Array<JSX.Element> = [];
                    const handleUserList = data.handleUserList;
                    // ceo部门id
                    const ceoOrganizationId = data.ceoOrganizationId;
                    // CSO部门id
                    const csoOrganizationId = data.csoPositionId;
                    const tooltipTextId = handleUserList[0];
                    
                    const positionString = param.userMapData[tooltipTextId].positionString;
                    const organizationId = param.userMapData[tooltipTextId].organizationId;
                    const positionId = param.userMapData[tooltipTextId].positionId;
                    const tooltipText = (organizationId==ceoOrganizationId)?'CEO':((positionId==csoOrganizationId)?'CSO':`${param.userMapData[tooltipTextId].name || ''}(${positionString || ''})/${param.userMapData[tooltipTextId].phone || ''}`)
                    handleUserList.map(person => {
                        // ceo不显示姓名和手机号
                        if(param.userMapData[person].organizationId==ceoOrganizationId){
                            tooltipData.push(<p className="approvePass">CEO</p>)
                        }else if(param.userMapData[person].positionId==csoOrganizationId){
                            tooltipData.push(<p className="approvePass">CSO</p>)
                        }else{
                            tooltipData.push(<p className="approvePass">
                            {`${param.userMapData[person].name || ''}(${param.userMapData[person].positionString || ''})/${param.userMapData[person].phone || ''}`}</p>)
                        }
                        
                    })
                    return (
                        <Tooltip placement="bottomLeft" title={tooltipData}>
                            <div style={style}>{tooltipText}</div>
                        </Tooltip>

                    );
                }
            }, {
                title: '操作',
                key: 'action',
                width: "150px",
                fixed: 'right',

                render: (data) => {
                    const status= data.status;
                    if(status ===3){
                        return  <p>已取消</p>
                    }
                    return (
                        <div>
                            <a style={{ marginRight: '8px' }} onClick={(e) => { e.preventDefault(); this.setSessionStorageParams({ url: `${ROUTER_PATH}/newadmin/ceo/cashout/approve`, name: 'cashoutApproveDetailsCeo', params: { orderCode: data.code } }); }}>查看</a>
                            <a style={{ marginRight: '8px' }} onClick={e => this.handleSinglePass(data)}>审批通过</a>
                            <a onClick={e => this.handleSingleReject(data)}>驳回</a>
                        </div>);
                }
            }]

        ]
    }
    
    
    
    state = {
        selectedTotalMoneys:'0.00', // 请款总金额
        isBatchApprove:false,       // 批量审批弹框
        singleVisible:false,        // 单个审批弹框
        singleApproveOpinion:1,     // 单个意见1同意2驳回
        singlePlanPayTime:'',
        approveOpinion:1,           // 审批意见1同意2驳回
        approveRecord:'',           // 审批记录
        planPayTime:'',             // 计划支付时间
        planPayTimeChange:1,        // 计划支付时间是否改变1不改变0改变
        rejectReason:'',            // 驳回原因
        singlePlanPayTimeVisible:false,
        isExporting:false,
        dataSource:[],
        
    };
    componentWillMount() {
        const {
            dispatch,
            searchParams,
            dataSource,
         } = this.props;
        const role = this.role;
        //  /**获取员工map 后台列表返回id 前端根据id 显示对应的信息 */
        dispatch(useMapSaga([]));
        // 获取组织架构 搜索条件用
        dispatch(userByOrganizationsSaga({}));
        // 获取审批列表
        dispatch(cashoutNeedsApprovalSaga({...searchParams,role}));
       
        
        
    }
    /**
     * 上传状态
     * @param isExporting boolean
     */
    handleChangeExportStatus = (isExporting:boolean) => {
        this.setState({isExporting:isExporting})
    }

    onSelectChange = (selectedRowKeys,selectedRow) => {
        // 计算总计
        let selectedTotalMoneys = 0;
        if(selectedRow.length>0){
            for (var index = 0; index < selectedRow.length; index++) {
                var element = selectedRow[index];
                selectedTotalMoneys = accAdd(selectedTotalMoneys,element.totalAmount);
            }
        }
        
        this.setState({ selectedTotalMoneys:formatMoney(selectedTotalMoneys,2,'','') });
        this.props.dispatch(cashoutSelectedRowData({ selectedRowKeys}));
    }
    setSessionStorageParams = (data) => {
        const {
            name,
            params,
            url,
        } = data;
        sessionStorage.setItem(name, JSON.stringify(params));
        url && browserHistory.push(url);
        
    };
    handleSinglePass = (param) => {
        
        this.setState({
            singleVisible:true,
            singleApproveOpinion:1,
            singlePlanPayTime:param.payTime*1000,
            approveRecord:param.code,
        })
        
    }
    handleSingleReject = (param) => {
        this.setState({
            singleVisible:true,
            singleApproveOpinion:2,
            approveRecord:param.code,
        })
        
    }
    datePickerProps = () => {
        const {singlePlanPayTime} =this.state;
        let props:any = {
            placeholder:"",
            format:'YYYY-MM-DD',
            disabledDate: (current)=>{
                return current && current.valueOf() < moment().subtract(1,'days');
            },
            onChange: (value)=>{
                this.setSingleState({singlePlanPayTime:value?value.format('YYYY-MM-DD'):null});
                
            }
        }
        props.defaultValue = singlePlanPayTime?moment(singlePlanPayTime,'YYYY-MM-DD'):null;
        return props;
}
    renderColumns = (data, index, key, value) => {
        const {dataSource } = this.state;
        const visible = dataSource[index]?dataSource[index][key]['editable']:false;
        return (<Popover
            content={<div><DatePicker {...this.datePickerProps()}/><br/><div style={{textAlign:'right',paddingTop:'10px'}}>
            <Button style={{marginRight:'5px'}} size="small" onClick={(e: any) => { this.handlePlanTimeCancel(data,index,key,value) }}>取消</Button>
            <Button size="small" onClick={(e: any) => { this.handlePlanTimeConfirm(data,index,key,value) }} type="primary">确定</Button>
            </div></div>}
            title="选择计划支付时间"
            trigger="click"
            visible={visible}
        >
            <a onClick={(e: any) => { this.handlePlanTimeEdit(data,index,key,value) }}>{value}</a>
        </Popover>)

        
    }
   
   
    handlePlanTimeChange =()=>{
    }
    handlePlanTimeEdit(data,index,key,value) {
        
        const {dataSource} =this.props;
        const newDataSource = dataSource;
        newDataSource[index][key]['editable'] = true;
        this.setState({'dataSource':newDataSource,'singlePlanPayTime':(value=='/'?null:value)});
    }
    //确认
    handlePlanTimeConfirm(data,index,key,value) {
        
        const {singlePlanPayTime} =this.state;
        const {dataSource,dispatch,cacheSearchParams} =this.props;
        
        const orderCode = dataSource[index]['code'];
        let params = {
            code:orderCode,

            payTime:singlePlanPayTime,
            updateTime:true,
            callback:()=>{
                const newDataSource = dataSource;
                newDataSource[index][key]['editable'] = false;
                this.setState({'dataSource':newDataSource});
                
                dispatch(cashoutNeedsApprovalSaga({...cacheSearchParams,role:this.role}));
            }
        }
        dispatch(masterApproveSaga(params));
       
    }
    handlePlanTimeCancel(data,index,key,value) {
        
        const {dataSource} =this.props;
        const newDataSource = dataSource;
        newDataSource[index][key]['editable'] = false;
        this.setState({'dataSource':newDataSource});
    }

    // public reload =() =>{
    //     alert("OK"); 
    // }
    
    
    handleSearch = () => {
        const {
            dispatch,
            cacheSearchParams,
            searchParams,
         } = this.props;

        dispatch(updateSearchParams({ searchStatus: true, ...cacheSearchParams }));
        dispatch(cashoutNeedsApprovalSaga({...cacheSearchParams,role:this.role}));
        dispatch(cashoutSelectedRowData({ selectedRowKeys:[]}));
        this.setState({selectedTotalMoneys:'0.00'});
    };
    
    handleReset = () => {
        const {
            dispatch,
            cacheSearchParams,
            searchParams,
         } = this.props;
        const params = {
            // role:this.role,        //角色
            cashoutSubmitter:'',   //请款提交人
            approvalHandler:'',    //审批经手人
            orderCode:'',          //请款单号
            planTime:'',
            endTime:'',            //付款截止时间倒计时
            exportStatus:'',       //导出状态
            cashoutType:'',        //社保业务请款性质
            payeeType:'',          //收款方类型
            payeeName:'',          //收款方名称
            cashoutMoney:'',       //请款总金额
            
        };
        this.props.dispatch(updateCacheSearchParams({ searchStatus: false, ...params }));
        // dispatch(updateSearchParams({ searchStatus: true, ...cacheSearchParams }));
        // this.props.form.resetFields();
    }
    /**批量导出 */
    batchExportPayment = () => {
        const {
            dispatch,
            selectedRowKeys,
        } = this.props;
        
        if(selectedRowKeys.length>0){
            
            dispatch(batchExportPaymentSaga({ids:selectedRowKeys.toString()}));
        }else{
            message.error('请选择要导出的数据');
        }
        
    }
    
    batchApprove = () => {
        const {
            dispatch,
            selectedRowKeys,
        } = this.props;
        if(selectedRowKeys.length>0){
            
           this.setState({ isBatchApprove:true });

        }else{
            message.error('请选择要审批的数据');
        }
    }
    handleUpdateCacheSearchParams = (params) => {
        this.props.dispatch(updateCacheSearchParams({ searchStatus: false, ...params }));
    }
    pagination = () => {
        const {
            dispatch,
            searchParams,
            total,
        } = this.props;
        const {
            currentPage,
            pageSize,
        } = searchParams;
        return paginationConfig({ ...searchParams, currentPage, total, pageSize,role:this.role }, cashoutNeedsApprovalSaga, dispatch)
    }
    inputFormatterInt = (data) => {
        var reg = /^(-|\+)?\d+$/ ;
        for(var key in data){
            let param = data[key];
            if (reg.test(param)||param=="") {
                let newParam ={}
                newParam[key] = param;
                this.props.dispatch(updateCacheSearchParams({ searchStatus: false, ...newParam}));
            }
            
        } 

        
    }
    datePickerHandleChange = (type, date, dateString) => {
        let newParam ={};
        newParam[type] = dateString
        this.props.dispatch(updateCacheSearchParams({ searchStatus: false, ...newParam}));
    };

    setSingleState = (param) => {
        this.setState(param);
    }
   
   
    /**
     * params.type 1
     */
    batchApproval: BatchApproval | null;
    singleApproval: SingleApproval | null;
    modalHandleOk = (data:any) => {
        
        const {
            single,
            fetching
        } = data;
        const result = single? 
                this.singleApproval ? this.singleApproval.validate(): {} as any
                    :
                this.batchApproval ? this.batchApproval.validate() : {} as any;
        const {dispatch,selectedRowKeys,cacheSearchParams} = this.props;
        const {approveOpinion,singleApproveOpinion} =this.state;
        
        if(result.status){
            fetching && fetching(true);
            const params = result.params;
            
            params['status'] = single?singleApproveOpinion:params['approveOpinion'];
            params['payTime'] = params['planPayTime'];
            
            params['codes'] = single?[data.approveRecord]:selectedRowKeys;
            

            params['callback'] = ()=>{
                // this.setState({ isBatchApprove:false });
                this.modalHandleCancel({single})
                
                dispatch(cashoutNeedsApprovalSaga({...cacheSearchParams,role:this.role}));
                this.setState({selectedTotalMoneys:'0.00'});
            }
            params['fetching'] = ()=>{
                fetching && fetching(false);
            }
            dispatch(masterApproveSaga(params))
            
               
                
                
        }
           
    };
     
   
        

    modalHandleCancel = (data:any) => {
        const {
            single,
            fetching
        } = data;
        single?this.setState({ singleVisible:false }): this.setState({ isBatchApprove:false });
        fetching && fetching(false);
    };
    modalProps = () => {
        const {isBatchApprove,approveOpinion} = this.state;
        const {userInfo} = this.props;
    
        const positionString = userInfo.positionString;
        const buttonText = positionString == 'CSO'? '确认并提交给CEO审批' : '确认并提交给财务付款';
        return {
            visible:isBatchApprove,
            title: '批量审批',
            onCancel: () => this.modalHandleCancel({'single':false}),
            footer: (
                <span>
                    {
                        approveOpinion==1?<Button  type="primary"  onClick={e => this.modalHandleOk({'single':false})}>{buttonText}</Button>
                        :<Button  type="primary"  onClick={e => this.modalHandleOk({'single':false})}>确定</Button>
                    }
                </span>
            )
        }
    }
    

    

    
    render() {
        const {
            dispatch,
            dataSource,
            fetching,
            userMapData,
            searchStatus,
            searchParams,
            cacheSearchParams,
            userByOrganizationsData,
            selectedRowKeys,
            //selectedTotalMoney,
            batchExportUrl,
            userInfo,
        } = this.props;
        const newUserByOrganizationsData = userByOrganizationsData.toJS();
        let tableCallback = {
            handleSinglePass:this.handleSinglePass,
            handleSingleReject:this.handleSingleReject,
            setSessionStorageParams:this.setSessionStorageParams,
            renderColumns:this.renderColumns,
            handlePlanTimeEdit:this.handlePlanTimeEdit,
        }
        
     
        const params = searchStatus ? searchParams : cacheSearchParams;
        const {
            cashoutSubmitter,   //请款提交人
            approvalHandler,    //审批经手人
            planTime,           //计划支付时间 
            orderCode,          //请款单号
            endTime,            //付款截止时间倒计时
            exportStatus,       //导出状态
            cashoutType,        //社保业务请款性质
            payeeType,          //收款方类型
            payeeName,          //收款方名称
            cashoutMoney,       //请款总金额
            
        } = params;
        const columns = this.columns({userMapData:userMapData.toJS()});//cashoutApprovalColumns(tableCallback);

        const { selectedTotalMoneys,
            isBatchApprove,
            approveOpinion,
            planPayTime,
            planPayTimeChange,
            rejectReason,
            singleVisible,
            singleApproveOpinion,
            singlePlanPayTime,
            approveRecord,
         } = this.state;
     
        
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
            // getCheckboxProps: record => {
                
            //     if(selectedRowKeys.find(()=>(record.orderCode))){
            //         return {checked:true}
            //     }else{
            //         return {checked:false}
            //     }
                
            // }
        

        };

        
        const hasSelected =  selectedRowKeys.length > 0;
        const rolse = this.role;
        return (
            <QueueAnim>
                <div key="cashoutNeedsApproval" className="wrapper-content cashoutNeedsApproval">
                    <div className="search-group">
                        {
                            (() => {
                                
                                if (rolse == "0") {
                                    return (<Form layout="inline" className="search-form">
                                        <FormItem style={{ marginBottom: 8 }} label="请款提交人：">
                                            
                                            <Organizations 
                                                initValue={cashoutSubmitter}
                                                onChange={value => { this.handleUpdateCacheSearchParams({ cashoutSubmitter: value }) }} 
                                                dataSource={newUserByOrganizationsData[0]}>
                                            </Organizations>
                                        </FormItem>
                                        <FormItem style={{ marginBottom: 8 }} label="审批经手人：">
                                            
                                            <Organizations 
                                                initValue={approvalHandler}
                                                onChange={value => { this.handleUpdateCacheSearchParams({ approvalHandler: value }) }} 
                                                dataSource={newUserByOrganizationsData[0]}>
                                            </Organizations>
                                        </FormItem>
                                        <Button type="primary" onClick={e => this.handleSearch()} style={{ marginTop: 3 }} >搜索</Button>
                                    </Form>)
                                }
                                if (rolse == "1") {
                                    return (<Form layout="inline" className="search-form">
                                        <FormItem style={{ marginBottom: 8 }} label="请款单号： ">
                                            <Input 
                                                style={{ width: 180 }}
                                                placeholder=""
                                                value={orderCode}
                                                onChange={(e: any) => { this.handleUpdateCacheSearchParams({ orderCode: e.target.value }) }}
                                            />
                                        </FormItem>
                                        <FormItem style={{ marginBottom: 8 }} label="客服计划付款时间倒计时： ">
                                            <Input
                                                prefix="≤"
                                                addonAfter="天"
                                                placeholder=""
                                                style={{ width: 180 }}
                                                value={endTime}
                                                onChange={(e: any) => { this.inputFormatterInt({ endTime: e.target.value }) }}
                                            />
                                        </FormItem>
                                        <FormItem style={{ marginBottom: 8 }} label="导出状态：">
                                            <Select 
                                                value={exportStatus}
                                                style={{ width: 100 }}
                                                onChange={value => { this.handleUpdateCacheSearchParams({ exportStatus: value }) }}
                                                >
                                                <option value=''>全部</option>
                                                <option value='1'>已导出</option>
                                                <option value='0'>未导出</option>
                                                
                                            </Select>
                                            
                                        </FormItem>
                                        <FormItem style={{ marginBottom: 8 }} label="社保业务请款性质：">
                                            <Select
                                                value={cashoutType}
                                                style={{ width: 100 }}
                                                onChange={value => { this.handleUpdateCacheSearchParams({ cashoutType: value }) }}
                                                >
                                                <option value=''>全部</option>
                                                <option value='1'>实付请款</option>
                                                <option value='2'>预付请款</option>
                                                
                                            </Select>
                                            
                                        </FormItem>
                                        <FormItem style={{ marginBottom: 8 }} label="收款方类型：" >
                                            <Select
                                                value={payeeType}
                                                style={{ width: 100 }}
                                                onChange={value => { this.handleUpdateCacheSearchParams({ payeeType: value }) }}
                                                >
                                                <option value=''>全部</option>
                                                <option value='1'>服务商</option>
                                                <option value='2'>分公司</option>
                                            </Select>
                                            
                                        </FormItem>
                                        <FormItem style={{ marginBottom: 8 }} label="收款方名称： ">
                                            <Input 
                                                
                                                style={{ width: 250 }}
                                                placeholder=""
                                                value={payeeName}
                                                onChange={(e: any) => { this.handleUpdateCacheSearchParams({ payeeName: e.target.value }) }}
                                            />
                                        </FormItem>
                                        <FormItem style={{ marginBottom: 8 }} label="请款总金额： ">
                                            <InputNumber 
                                                
                                                style={{ width: 180 }}
                                                placeholder=""
                                                value={cashoutMoney}
                                                onChange={(e: any) => { this.handleUpdateCacheSearchParams({ cashoutMoney: e }) }}
                                            />
                                        </FormItem>
                                        
                                        <FormItem style={{ marginBottom: 8 }} label="请款提交人：">
                                            <Organizations 
                                                initValue={cashoutSubmitter}
                                                onChange={value => { this.handleUpdateCacheSearchParams({ cashoutSubmitter: value }) }} 
                                                dataSource={newUserByOrganizationsData[0]}>
                                            </Organizations>
                                        </FormItem>
                                        <FormItem style={{ marginBottom: 8 }} label="审批经手人：">
                                            <Organizations 
                                                initValue={approvalHandler}
                                                onChange={value => { this.handleUpdateCacheSearchParams({ approvalHandler: value }) }} 
                                                dataSource={newUserByOrganizationsData[0]}>
                                            </Organizations>
                                            
                                        </FormItem>
                                        
                                        <Button type="primary" style={{  marginTop: 3 }}  onClick={ e => this.handleSearch()}>搜索</Button>
                                            <Button style={{ marginLeft: 8,marginTop:3 }}  onClick={ e => this.handleReset()}>重置</Button>
                                    </Form>)
                                }
                                if (rolse == "2") {
                                    return (<Form layout="inline" className="search-form">
                                        <FormItem style={{ marginBottom: 8 }} label="财务计划支付时间： ">
                                            <DatePicker  
                                                
                                                style={{ width: 180 }}
                                                placeholder=""
                                                value={planTime?moment(planTime):planTime}
                                                onChange={(date: any,dateStrings:string) => { this.handleUpdateCacheSearchParams({planTime:dateStrings}) }}
                                               
                                            />
                                        </FormItem>
                                        <FormItem style={{ marginBottom: 8 }} label="客服计划付款时间倒计时： ">
                                            <Input 
                                                
                                                prefix="≤"
                                                addonAfter="天"
                                                placeholder=""
                                                
                                                style={{ width: 180 }}
                                                value={endTime}
                                                onChange={(e: any) => { this.inputFormatterInt({ endTime: e.target.value }) }}
                                            />
                                        </FormItem>
                                        <FormItem style={{ marginBottom: 8 }} label="收款方类型：" >
                                            <Select
                                                value={payeeType}
                                                style={{ width: 100 }}
                                                onChange={value => { this.handleUpdateCacheSearchParams({ payeeType: value }) }}
                                                >
                                                <option value=''>全部</option>
                                                <option value='1'>服务商</option>
                                                <option value='2'>分公司</option>
                                            </Select>
                                            
                                        </FormItem>
                                        <FormItem style={{ marginBottom: 8 }} label="收款方名称： ">
                                            <Input 
                                                
                                                style={{ width: 250 }}
                                                placeholder=""
                                                value={payeeName}
                                                onChange={(e: any) => { this.handleUpdateCacheSearchParams({ payeeName: e.target.value }) }}
                                            />
                                        </FormItem>
                                        <FormItem style={{ marginBottom: 8 }} label="审批经手人：">
                                            <Organizations 
                                                initValue={approvalHandler}
                                                onChange={value => { this.handleUpdateCacheSearchParams({ approvalHandler: value }) }} 
                                                dataSource={newUserByOrganizationsData[0]}>
                                            </Organizations>
                                            
                                        </FormItem>
                                        <Button type="primary" onClick={e => this.handleSearch()} style={{ marginTop: 3 }} >搜索</Button>
                                        {/*<Button style={{ marginLeft: 8 }} onClick={ e => this.handleReset()}>重置</Button>*/}
                                        
                                    </Form>)
                                }

                            })()
                        }
                        
                        
                    </div>
           
                  
                    <QueueAnim type="bottom" delay="300">
                        
                            
                            {
                                (() => {
                                    if (rolse == "0") {
                                        return (<div key="1-1" style={{marginTop: '20px'}}>
                                            <Table columns={columns[0] }
                                                rowKey={(record: any) => record.code}
                                                dataSource={dataSource}
                                                loading={fetching}
                                                scroll={{ x: 1700 ,y: dataSource.length>0?window.innerHeight*0.6:false}}
                                                pagination={this.pagination()}
                                                /></div>
                                        )
                                    }
                                    if (rolse == "1") {
                                        return (<div key="1-1" style={{marginTop: '20px'}}>
                                            
                                            <Table columns={columns[1] }
                                                rowSelection={rowSelection}
                                                rowKey={(record: any) => record.code}
                                                dataSource={dataSource}
                                                loading={fetching}
                                                scroll={{ x: 2740 , y: dataSource.length>0?window.innerHeight*0.6:false}}
                                                pagination={this.pagination()}
                                                />
                                                <Spin tip="导出中..." spinning={this.state.isExporting}>
                                                    <OutputFile
                                                        outputParams= {selectedRowKeys}
                                                        contentType='application/json'
                                                        outputUrl={`${DOMAIN_OXT}/apiv3_/v1/sppay/export/sppayment/bill/customer`}
                                                        downloadUrl = {`${DOMAIN_OXT}/apiv4_/v1/sppayu/download/download`}
                                                        callback ={this.handleChangeExportStatus}
                                                        pollUrl = {`${DOMAIN_OXT}/apiv4_/v1/sppayu/schedule/get`}
                                                        pollData= {{ type: 4 , userId: this.props.userInfo.userId} }
                                                        >
                                                        
                                                        <Button type="primary" disabled={!hasSelected}>批量导出付款清单（客户维度）与垫款明细</Button>
                                                    </OutputFile>
                                                </Spin>
                                                
                                                </div>)
                                    }
                                 
                                    if (rolse == "2") {
                                        return (<div key="1-1" style={{marginTop: '20px'}}><Table columns={columns[2] }
                                                rowSelection={rowSelection}
                                                rowKey={(record: any) => record.code}
                                                dataSource={dataSource}
                                                loading={fetching}
                                                scroll={{ x: 2525 ,y: dataSource.length>0?window.innerHeight*0.6:false}}
                                                pagination={this.pagination()}
                                                />
                                                <p style={{fontSize:'16px',marginTop:'-50px',paddingBottom:'20px'}}>当前选中的请款总金额：<span style={{color:'red'}}>{formatMoney(selectedTotalMoneys,2,'')}</span></p>
                                                <Button type="primary" disabled={!hasSelected}  onClick={ e => this.batchApprove()}>批量审批</Button>
                                                
                                                <BatchApproval key={rowSelection.toString()}
                                                    modalHandleCancel={this.modalHandleCancel}
                                                    modalHandleOk={this.modalHandleOk}
                                                    isBatchApprove={isBatchApprove}
                                                    userInfo = {userInfo}
                                                    ref={node => this.batchApproval = node}
                                                />
                                                <SingleApproval key={approveRecord}
                                                    modalHandleCancel={this.modalHandleCancel}
                                                    modalHandleOk={this.modalHandleOk}
                                                    singleVisible = {singleVisible}
                                                    approveRecord = {approveRecord}
                                                    userInfo = {userInfo}
                                                    singleApproveOpinion = {singleApproveOpinion}
                                                    singlePlanPayTime = {singlePlanPayTime}
                                                    ref={node => this.singleApproval = node}
                                                />
                                                
                                                </div>)
                                                
                                    }
                                })()
                            }
                            
                            
                            
                            
                        
                    </QueueAnim>
                </div>
                <iframe src={batchExportUrl} style={{display: 'none'}}></iframe>
            </QueueAnim>
        )
    }
}



const mapStateToProps = (state: Any.Store, ownProps: TOwnProps):TStateProps =>  {
    const data = state.get('cashoutNeedsApproval');
    return {
        dataSource: data.get('dataSource').toJS(),
        // cashoutSubmitterData: data.get('cashoutSubmitterData').toJS(),
        // approvalHandlerData: data.get('approvalHandlerData').toJS(),
        userByOrganizationsData:data.get('userByOrganizationsData'),
        userMapData:data.get('userMapData'),
        cacheSearchParams: data.get('cacheSearchParams').toJS(),
        searchParams: data.get('searchParams').toJS(),
        selectedRowKeys: data.get('selectedRowData').toJS(),
        userInfo: state.getIn(['routerPermission', 'permission', 'userInfo']),
        batchExportUrl: data.get('batchExportUrl'),
        total: data.get('total'),
        fetching: data.get('fetching'),
        searchStatus: data.get('searchStatus'),
        //isBatchApprove:data.get('isBatchApprove'),
    }
}
// export default CashoutNeedsApproval
export default connect(mapStateToProps)(CashoutNeedsApproval)




