import React from 'react';
import { connect } from 'react-redux';
import {Radio, Form, Input, DatePicker, Select, Button, Icon, Table, Spin,Switch,Modal } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import WhiteSpace from '../../../../components/common/WhiteSpace';
import { PAGINATION_PARAMS } from '../../../../global/global';
import { setAdvancedetails } from '../../../../action/businessComponents/cashoutOrderDetailsAction';
import { statePaginationConfig, mapCurrentPageToStart, } from '../../../../util/pagination';

import ResPaymentAll from '../../../../components/socialManagement/resTables/resPaymentAll';  //所有
import ResPaymentLaunch from '../../../../components/socialManagement/resTables/resPaymentLaunch'; //待发
import ResPaymentFinance from '../../../../components/socialManagement/resTables/resPaymentFinance'; //财务
import ResPaymentImport from '../../../../components/socialManagement/resTables/resPaymentImport'; //导入
import  '../../../../css/socialManagement/lanchConfirm.less';
import {resPaymentlistSaga,startMergePaymentSaga,getPaymentDetailSaga} from '../../../../action/socialManagement/resPaymentListAction';  //saga


const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const FormItem = Form.Item;

class ResPaymentList extends React.Component<any, any>{
    constructor(props) {
        super(props);
        this.state={
            loading: false,
            visibleLanch: false,
            visibleConfirm: false,
            dataSource: [],
            selectedRowKeys: [], // 全选 和 单选
            status:0,
            searchParams: {
                ...PAGINATION_PARAMS,
                code:'',
                receiverName:'',
                payType:undefined,
                financePlanPayTime:undefined,
            },
            data: [
                {
                    'code':'sp20180724003-01',
                    'platform':0,  //4 请款平台
                    'platformString':'天吴请款',
                    'payType':1,
                    'payTypeString':'支票',
                    'payStatus':2,
                    'payStatusString':'未支付',
                    'financePlanPayTimeLeftDay':'2天',
                    'financePlanPayTime':646565454565444,//时间戳   //财务计划支付时间 1
                    'financePlanPayTimeString':'2018-7-26 15:00',
                    'businessPlanPayTime':35645756767,//时间戳
                    'businessPlanPayTimeString':'2018-07-31 15:00',
                    'requestCreateTime':3453446546,//时间戳
                    'requestCreateTimeString':'2018-07-31 15:00',
                    'receiverType':1,
                    'receiverTypeString':'服务商',
                    'receiverName':'浙江中通文博服务有限公司',
                    'receiverAccount':'571906919210901',  //3  收款方账号
                    'requestCode':'sp20180724002',
                    'requestType':1,
                    'requestTypeString':'代缴社保款',
                    'estimateAmount':10080.20,
                    'socialPayMonth':'2018-07',
                    'requestSubmitUser':'张小李/ 15511112222',
                    'approver':'COO',
                    'insuredStatus':'/',
                    'insuredItem':'/',
                    'paymentRemark':'合并打款',  // 5 打款备注
                    'businessRemark':'与 sp20180722001-01 合并打款', //6 业务备注
                    'id':1, // 1 id
                    'requestInfoId':101, //2 请款单主键 
                    'mergeParentId':1,
                },
                {
                    'code':'sp20180724002-01',
                    'platform':0,
                    'platformString':'sp请款',
                    'payType':1,
                    'payTypeString':'银行转账',
                    'payStatus':2,
                    'payStatusString':'已支付',
                    'financePlanPayTimeLeftDay':'2天',
                    'financePlanPayTime':646565454565444,//时间戳
                    'financePlanPayTimeString':'2018-7-26 15:00',
                    'businessPlanPayTime':35645756767,//时间戳
                    'businessPlanPayTimeString':'2018-07-31 15:00',
                    'requestCreateTime':3453446546,//时间戳
                    'requestCreateTimeString':'2018-07-31 15:00',
                    'receiverType':1,
                    'receiverTypeString':'服务商',
                    'receiverName':'浙江中通文博服务有限公司',
                    'receiverAccount':'571906919210901',
                    'requestCode':'sp20180724002',
                    'requestType':1,
                    'requestTypeString':'代缴社保款',
                    'estimateAmount':10080.20,
                    'socialPayMonth':'2018-07',
                    'requestSubmitUser':'毛丽丽/ 15511112222',
                    'approver':'CEO',
                    'insuredStatus':'/',
                    'insuredItem':'/',
                    'paymentRemark':'单位代码：123456',
                    'businessRemark':'与 sp20180722001-01 合并打款',
                    'id':2,
                    'requestInfoId':102, //2 请款单主键
                    'mergeParentId':0,
                },
                {
                    'code':'sp20180724001-01',
                    'platform':0,
                    'platformString':'天吴请款',
                    'payType':1,
                    'payTypeString':'银行转账',
                    'payStatus':2,
                    'payStatusString':'已支付',
                    'financePlanPayTimeLeftDay':'2天',
                    'financePlanPayTime':646565454565444,//时间戳
                    'financePlanPayTimeString':'2018-7-26 15:00',
                    'businessPlanPayTime':35645756767,//时间戳
                    'businessPlanPayTimeString':'2018-07-31 15:00',
                    'requestCreateTime':3453446546,//时间戳
                    'requestCreateTimeString':'2018-07-31 15:00',
                    'receiverType':1,
                    'receiverTypeString':'服务商',
                    'receiverName':'浙江中通文博服务有限公司',
                    'receiverAccount':'571906919210901',
                    'requestCode':'sp20180724002',
                    'requestType':1,
                    'requestTypeString':'代缴社保款',
                    'estimateAmount':10080.20,
                    'socialPayMonth':'2018-07',
                    'requestSubmitUser':'王小二/ 15511112222',
                    'approver':'CFO',
                    'insuredStatus':'/',
                    'insuredItem':'/',
                    'paymentRemark':'单位代码：123456',
                    'businessRemark':'与 sp20180722001-01 合并打款',
                    'id':3,
                    'requestInfoId':103, //2 请款单主键
                    'mergeParentId':1,
                },
            ]
        }
    }

    componentWillMount() {
        // 默认加载
        this.handleSearch();
    }
  
    handleSearch = ()=> {
        this.setState({selectedRowKeys:[]});
        this.props.dispatch(resPaymentlistSaga({...this.state.searchParams,status:this.state.status}));// 第一步 UI组件出发action创建函数 
    }

    //tab 切换
    onTabChange = (e) => {  
        this.search.resetFields();//清空操作
        const status =e.target.value;
        const { searchParams } = this.state;
        //切换时清空搜索条件
        searchParams.pageSize = 20,
        searchParams.currentPage = 1,
        searchParams.code ='';
        searchParams.receiverName = '';
        searchParams.payType = undefined,
        searchParams.financePlanPayTime= undefined, 
        this.setState({
            loading:true,
            status:status  //出款单状态
        },function(){
            this.props.dispatch(resPaymentlistSaga({...this.state.searchParams,status:this.state.status}));// 第一步 UI组件出发action创建函数
        });
        setTimeout(() => {
            this.setState({
                loading: false,
            })
        }, 1000)
    }

    //搜索
    onSearch = (searchParams) =>{
            //searchParams指的是获取到的四个搜索条件 并且 使currentPage为1
            let newSearchParems =  this.handleChangeParams(searchParams);
            this.setState({searchParams});  //这一步的目的是让state发生改变从而触发页面重新渲染
            this.props.dispatch(resPaymentlistSaga({...newSearchParems,currentPage:1,status:this.state.status}));// 第一步 UI组件出发action创建函数
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
    //----------------------分页----------------
    pagination = () => {
        const {
            total,
        } = this.props;
        const {searchParams} = this.state;
        const {
            currentPage,
            pageSize,
        } = searchParams;
      
        const setCurrentPage = (currentPage,pageSize) => {
            // this.setState({selectedRowKeys: []});
            this.setSearchParamState({ 'currentPage': currentPage,'pageSize':pageSize})
        }
        return statePaginationConfig({ ...searchParams, currentPage, pageSize ,total:130 },(newParams)=>{this.props.dispatch(resPaymentlistSaga({...searchParams,...newParams,status:this.state.status}))}, null,setCurrentPage)
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
    //---------------------分页--------------------

     //点击发起合并按钮
     handleCombineLanch = () =>{
        this.setState({
            visibleLanch: true,
        })
    }
    handleOk = (e) => {
        this.setState({
          visibleLanch: false,
          visibleConfirm: true,
        });
    }
    handleCancel = (e) => {
        this.setState({
            visibleLanch: false,
        });
    }
    //查看出款单详情
    handleResPaymentDetail = (id) =>{
        let ids = id;
        this.props.dispatch(getPaymentDetailSaga({id:ids}));// 第一步 UI组件出发action创建函数
    }
    //再次确认按钮
    handleOkConfirm = (ReqPaymentList) =>{
        this.setState({
            visibleConfirm: false,
        });
        var params:any = [];
        ReqPaymentList.map((item,index)=>{
            var obj = {};
            if(index != ReqPaymentList.length-1){
                for(let key in item){
                    if(key=='id' || key=='requestInfoId' || key=='receiverAccount' || key=='platform' || key=='paymentRemark' || key=='businessRemark'){
                        obj[key] = item[key]
                    }
                }
                params.push(obj);
            }
        })
        let paymentJSON = JSON.stringify(params);
        this.props.dispatch(startMergePaymentSaga({paymentJSON}));// 第一步 UI组件出发action创建函数 
    }
    handleModifyConfirm= (e) =>{
        this.setState({
            visibleLanch: true,
            visibleConfirm: false,
        });
    }
    search
    render(){
        const {status, selectedRowKeys, dataSource} = this.state;
        return <Spin spinning={this.state.loading}>
                    <RadioGroup onChange={this.onTabChange} value={status}  >
                        <RadioButton value={0}>全部</RadioButton>
                        <RadioButton value={1}>等待发起出款</RadioButton>
                        <RadioButton value={2}>等待财务付款</RadioButton>
                        <RadioButton value={3}>等待导入实缴账单</RadioButton>
                    </RadioGroup>
                    <WhiteSpace height={15}/>
                    <SearchForm ref={node => this.search = node}  onSearch={(searchParams) =>{  
                            this.onSearch(searchParams);
                    }}/>
                    <WhiteSpace />
                    {
                       [status === 0 && <ResPaymentAll dataSource={this.state.data} pagination={this.pagination}  />,
                        status === 1 && <ResPaymentLaunch dataSource={this.state.data}  pagination={this.pagination} handleCombineLanch={this.handleCombineLanch}  visibleLanch={this.state.visibleLanch}  visibleConfirm={this.state.visibleConfirm}  handleResPaymentDetail={this.handleResPaymentDetail} handleOk={this.handleOk} handleCancel={this.handleCancel} handleOkConfirm={this.handleOkConfirm} handleModifyConfirm={this.handleModifyConfirm}/>, 
                        status === 2 && <ResPaymentFinance pagination={this.pagination} />, 
                        status === 3 && <ResPaymentImport pagination={this.pagination} />]
                    } 
                </Spin>
    }
}

interface SearchProps extends FormComponentProps{
    onSearch: (values) => void;
}
class Search extends React.Component<SearchProps, any>{
    constructor(props:SearchProps) {
        super(props);
    }
    // 获取四个搜索条件
    handleSearch = (e)=>{
        e.preventDefault();
        var values = this.props.form.getFieldsValue();   
        var searchParams = {};
        for(let key  in values){
            searchParams[key] = values[key];
            if(key == 'payType' && values[key]!=undefined){
                var payType = parseInt(values[key]) ;
                searchParams[key] = payType;
            }
            if(key == 'financePlanPayTime' && values[key]!=undefined){
                var financePlanPayTime = values[key].unix();
                searchParams[key] = financePlanPayTime;
            }
        }
        this.props.onSearch(searchParams);  //子传父
    }

    render() {
        const {form} = this.props;
        const {getFieldDecorator} = form;
        const config = {
            rules: [{ type: 'object', required: true, message: 'Please select time!' }],
        };
        return (
            <div>
                <Form layout="inline">
                    <FormItem >
                        {getFieldDecorator('code', {
                            rules: [{}],
                        })(
                            <Input placeholder="出款单号" />
                        )}
                    </FormItem>

                    <FormItem >
                        {getFieldDecorator('payType', {
                            rules: [{}],
                        })(
                            <Select style={{width: 174}} placeholder="支付方式" >
                                <Select.Option key='0'>全部</Select.Option>
                                <Select.Option key='1'>银行转账</Select.Option>
                                <Select.Option key='2'>支票</Select.Option>
                            </Select>
                        )}
                    </FormItem>

                    <FormItem >
                        {getFieldDecorator('financePlanPayTime',config)(
                            <DatePicker placeholder="财务计划付款时间" />
                        )}
                    </FormItem>
                    
                    <FormItem >
                        {getFieldDecorator('receiverName', {
                            rules: [{}],
                        })(
                            <Input placeholder="收款方名称" />
                        )}
                    </FormItem>

                    <FormItem><Button type='primary' onClick={this.handleSearch}>搜索</Button></FormItem>

                    
                </Form>
                
            </div>
        );
    }
    
}
const SearchForm = Form.create()(Search);

function mapStateToProps(state?: any) {
    const data = state.get('resPaymentListReducer');
    // console.log(data);
    // return {
    //     dataSource: data.get('dataSource').toJS(),
    //     fetching: data.get('fetching'),
    //     total:data.get('total'),
    //     userInfo: state.getIn(['routerPermission', 'permission', 'userInfo']),

    // }
}

export default connect(mapStateToProps)(ResPaymentList)




