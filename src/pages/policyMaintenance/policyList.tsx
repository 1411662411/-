import React from 'react';
import { Form, 
        Input, 
        Select, 
        Button, 
        Icon, 
        Row, 
        Col, 
        DatePicker,
        Table,  
        Divider,
        Popover,
        Switch,
        InputNumber
} from 'antd';
import moment from 'moment';
import * as _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import SelectCity from '../../components/select-city/index';
import address from '../../components/select-city/address.json';
import { 
    dispatchPolicyMenergeList,
    getPolicyMenergeDispatch,
} from '../../action/policyMaintenance/policyListAction'
import { PAGINATION_PARAMS } from '../../global/global';
import { statePaginationConfig } from '../../util/pagination';
import { browserHistory } from 'react-router';
import { DOMAIN_OXT, ROUTER_PATH } from '../../global/global';
import './policyList.less';
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
const FormItem = Form.Item;
const Option = Select.Option;
const maps = {
    vetted: {
        0: '待审批',
        1: '审批通过',
        2: '审批驳回',
    },
    customerRemarkVetted: {
        0: '/',
        1: '待审批',
        2: '审批通过',
        3: '免审',
    } 
}
const mapIsShow = {
    'inputwFundStuffTime': 0,
    'inputSpwFundStuffTime': 1
}
class PolicyList extends React.Component<any,any>{
    
    constructor(props) {
        super(props);
        let isShow = [];
        this.visibleList(isShow)
        this.state = {
            ...PAGINATION_PARAMS,
            currentPage: 1,
            pageSize: 20,
            isvisible: isShow,
            policyId: '', //政策包id
            provinceName: '', //省         
            cityName: '', //市
            districtName: '', //区（政策包名）
            allowInsured: '',//是否允许参保
            allowSocialBill: '',//是否允许社保账单启用
            wSocialAttritionTime: '',//平台时间截止日
            calHidden: '',//社保计算器是否启用
            serviceType: '',//服务类型
            wFundStuffTime: '',//平台参保材料收集截止时间
            allowAdviser: '',//社保顾问是否启用
            allowMaterialTourists: '',//材料是否开放给游客
            allowMaterialCustomer: '',//材料是否开放给客户
            allowMaterialAdviser: '',//材料是否开放给社保顾问
            isAjax:false,
            inputwFundStuffTime:'',
            inputallowMaterialTourists:'',
            inputallowMaterialCustomer:'',
            inputallowMaterialAdviser:'',
            inputSpwFundStuffTime:'',
        }

    }
    visibleList(isShow){
        let isShowChild = [false,false]
        for(let i=0; i<20;i++){
            isShow.push(isShowChild)
        }
    } 
    componentWillMount(){
        const {
            policyData
        } = this.props.data;
        const {
            currentPage,
            pageSize,
        } = this.state;
        this.search({ ...policyData, currentPage,pageSize,})
        
       
    }
    search(params){
        const {
            dispatch,
        } = this.props
        dispatch(dispatchPolicyMenergeList(params))
    }
    pagination = () => {
        const {
            type,
            dispatch,
            data
        } = this.props;
        const total = data.recordsTotal
 
        const {
            policyId, //政策包id
            provinceName, //省         
            cityName, //市
            districtName, //区（政策包名）
            allowInsured,//是否允许参保
            allowSocialBill,//是否允许社保账单启用
            wSocialAttritionTime,//平台时间截止日
            calHidden,//社保计算器是否启用
            serviceType,//服务类型
            wFundStuffTime,//平台参保材料收集截止时间
            allowAdviser,//社保顾问是否启用
            allowMaterialTourists,//材料是否开放给游客
            allowMaterialCustomer,//材料是否开放给客户
            allowMaterialAdviser,//材料是否开放给社保        
            currentPage,
            pageSize,
        } = this.state
        let Prams = {
            policyId, //政策包id
            provinceName, //省         
            cityName, //市
            districtName, //区（政策包名）
            allowInsured,//是否允许参保
            allowSocialBill,//是否允许社保账单启用
            wSocialAttritionTime,//平台时间截止日
            calHidden,//社保计算器是否启用
            serviceType,//服务类型
            wFundStuffTime,//平台参保材料收集截止时间
            allowAdviser,//社保顾问是否启用
            allowMaterialTourists,//材料是否开放给游客
            allowMaterialCustomer,//材料是否开放给客户
            allowMaterialAdviser,//材料是否开放给社保        
            currentPage,
            pageSize,
        }
        return statePaginationConfig({
            currentPage,
            pageSize,
            total,
        },
        
            (newParams) => dispatchPolicyMenergeList({ ...Prams, ...newParams }),
            dispatch,
            (currentPage, pageSize) => {
                this.setState({
                    currentPage,
                    pageSize
                });
            },
        )
    }
    handleVisibleChange = (index,text,key) =>{
        let isShowChild = [false, false]
        let isShowChild0 = [true, false]
        let isShowChild1 = [false, true]
        let isShow:any = []
        for (let i = 0; i < 20; i++) {
            if(i==index){
                if (key =='inputwFundStuffTime'){
                    isShow.push(isShowChild0)
                }
                if (key == 'inputSpwFundStuffTime'){
                    isShow.push(isShowChild1)
                }
            }else{
                isShow.push(isShowChild)
            } 
        }
        this.setState({
            isvisible: isShow,
            [key]: text
        })
    }
    isSHowDialog=(index,key)=>{
        let isShowChild = [false, false]
        let isShowChild0 = [true, false]
        let isShowChild1 = [false, true]
        let isShow: any = []
        for (let i = 0; i < 20; i++) {
            isShow.push(isShowChild)
        }
        this.setState({
            isvisible: isShow
        })
    }
    isOk = (index, id,val)=>{
        this.isSHowDialog(index,val)
        const {
            dispatch,
          
        } = this.props
      
        const {
            inputwFundStuffTime,
            inputSpwFundStuffTime
        } = this.state
        let params
        if (val=='inputSpwFundStuffTime'){
            params = {
                id: id,
                spWFundStuffTime: inputSpwFundStuffTime,
                callback: this.searchDispatch
            }
        }
        if (val =='inputwFundStuffTime'){
            params = {
                id: id,
                wFundStuffTime: inputwFundStuffTime,
                callback: this.searchDispatch
            }
           
        }
        dispatch(getPolicyMenergeDispatch(params))
            
       
        
    }
    isInputNum=(value,key)=>{
        this.setState({
            [key]:value
        })

    }
    isInputNumFn = (value,id,index,key)=>{
    //    0true是  1 否
   
        const {
            dispatch,
            
        } = this.props
        let newP =  {
            inputallowMaterialTourists:0,
            inputallowMaterialCustomer:0,
            inputallowMaterialAdviser:0,
        } 
        let params
        if(key==='allowMaterialTourists'){
            newP.inputallowMaterialTourists=value?1:0
              params = {
                    id: id,
                    allowMaterialTourists: newP.inputallowMaterialTourists,
                    callback: this.searchDispatch
                }
           
            
               
            
        } else if (key === 'allowMaterialCustomer'){
            newP.inputallowMaterialCustomer = value ? 1 : 0 
            params = {
                id: id,
                allowMaterialCustomer:newP.inputallowMaterialCustomer, 
                callback: this.searchDispatch
            }
           
            
            
        } else if (key === 'allowMaterialAdviser'){
            newP.inputallowMaterialAdviser=value?1:0
            params = {
                id: id,
                allowMaterialAdviser: newP.inputallowMaterialAdviser,
                callback: this.searchDispatch
            }
            
        }
        dispatch(getPolicyMenergeDispatch(params))
    }
       
    //input输入框 
    handlerChange=(value,key)=>{
        this.setState({
            [key]: value.target.value,
            isAjax:true,
        })  
        // this.searchDispatch();
    }
    //select框
    SelectHandlerChange=(value,key)=>{
        this.setState({
            [key]: value,
            isAjax: true,
        }) 
    }
    searchDispatch=()=>{
        const { dispatch } = this.props
        const {
            policyId, //政策包id
            provinceName, //省         
            cityName, //市
            districtName, //区（政策包名）
            allowInsured,//是否允许参保
            allowSocialBill,//是否允许社保账单启用
            wSocialAttritionTime,//平台时间截止日
            calHidden,//社保计算器是否启用
            serviceType,//服务类型
            wFundStuffTime,//平台参保材料收集截止时间
            allowAdviser,//社保顾问是否启用
            allowMaterialTourists,//材料是否开放给游客
            allowMaterialCustomer,//材料是否开放给客户
            allowMaterialAdviser,//材料是否开放给社保        
            currentPage,
            pageSize,
        } = this.state
        let Prams = {
            policyId, //政策包id
            provinceName, //省         
            cityName, //市
            districtName, //区（政策包名）
            allowInsured,//是否允许参保
            allowSocialBill,//是否允许社保账单启用
            wSocialAttritionTime,//平台时间截止日
            calHidden,//社保计算器是否启用
            serviceType,//服务类型
            wFundStuffTime,//平台参保材料收集截止时间
            allowAdviser,//社保顾问是否启用
            allowMaterialTourists,//材料是否开放给游客
            allowMaterialCustomer,//材料是否开放给客户
            allowMaterialAdviser,//材料是否开放给社保        
            currentPage,
            pageSize,
        }
        this.search(Prams)
        this.setState({
            isAjax: false,
        }) 
    }
    aHangder:any =(text,recode,index,val)=>{
        const key = index
        let visibleData = this.state.isvisible[index][mapIsShow[val]]
      
        return (
            <Popover
                content={
                    <a>
                        <InputNumber min={1} max={30} id={val} defaultValue={text} style={{ marginRight: '5px', width: '150px' }} onChange={value => this.isInputNum(value,val)}/>
                        <Button type="primary" style={{ marginRight: '5px' }} size="small" onClick={() => { this.isOk(key,recode.policyId,val)}}>✔</Button> 
                        <Button style={{display:'inline-block',paddingBottom:'4px'}}  size="small"  onClick={()=>(this.isSHowDialog(key,val))}>x</Button> 
                    </a>
                
                }
                trigger="click"
                visible={visibleData}
               
                
            >
                <a onClick={() => { this.handleVisibleChange(key, text,val)}}>
                    {text}
                </a>
            </Popover>
        );
    }
    columns:any =()=> [
            {
                title: '省',
                dataIndex: 'provinceName',
                key: 'provinceName',
                className:'centerStyle',
                width:50,
            }, {
                title: '市',
                dataIndex: 'cityName',
                className: 'centerStyle',
                key: 'cityName',
                width:50,   
            }, {
                title: '政策包名',
                dataIndex: 'districtName',
                className: 'centerStyle',
                key: 'districtName',
                width:150,
            }, {
                title: '类别',
                key: 'service_type', 
                className: 'centerStyle',
                dataIndex: 'service_type',
                width:100,
                render: (text, record) => (
                    text === ' ' ? '全部' : (text === 1 ? '服务商' : (text === 2 ? '自营户' :'服务商+自营户'))
                ),
            },{
                title: '平台截点',
                key: 'w_social_attrition_time',
                className: 'centerStyle',
                dataIndex: 'w_social_attrition_time',
                width:100,
            },{
                title: '平台参保材料收集截止时间',
                key: 'w_fund_stuff_time',
                className: 'centerStyle',
                dataIndex: 'w_fund_stuff_time',
                width:100,
                render: (text, record,index) => 
                {
                    const inputwFundStuffTime = 'inputwFundStuffTime'
                    return this.aHangder(text, record, index, inputwFundStuffTime)
                },
        }, 
        {
            title: 'sp参保材料收集截止截止日',
            key: 'sp_w_fund_stuff_time',
            className: 'centerStyle',
            dataIndex: 'sp_w_fund_stuff_time',
            width: 100,
            render: (text, record, index) => {
                const inputSpwFundStuffTime = 'inputSpwFundStuffTime'
                return this.aHangder(text, record, index, inputSpwFundStuffTime)
            },
        },
        // vetted: {
        //     0: '待审批',
        //     1: '审批通过',
        //     2: '审批驳回',
        // },
        // customerRemarkVetted: {
        //     0: '/',
        //     1: '待审批',
        //     2: '审批通过',
        //     3: '免审',
        // } 
         {
         
                title: '是否开放给游客',
                key: 'allow_material_tourists',
                className:'centerStyle',
                dataIndex: 'allow_material_tourists',
                width: 100,
                render: (text, record, index) => {
                    let isDis 
                    if (record.vetted == 1 ){
                        if (record.customerRemarkVetted == 2 || record.customerRemarkVetted == 3){
                            isDis = false 
                        } else {
                            isDis = true
                        }
                        
                    }else{
                        isDis=true
                    }
                   
                    let flag;
                    text===1?flag=true:flag==false;
                    return <Switch disabled={isDis} checkedChildren="是" unCheckedChildren="否" checked={flag} onChange={value => this.isInputNumFn(value, record.policyId,index,'allowMaterialTourists')}/>
                },
            }, {
                title: '是否开放给客户',
                key: 'allow_material_customer',
                className:'centerStyle',
                dataIndex: 'allow_material_customer',
                width: 100,
                render: (text, record, index) => {
                    let isDis
                    if (record.vetted == 1) {
                        if (record.customerRemarkVetted == 2 || record.customerRemarkVetted == 3) {
                            isDis = false
                        } else {
                            isDis = true
                        }

                    } else {
                        isDis = true
                    }
                    let flag;
                    text===1?flag=true:flag==false;
                    return <Switch disabled={isDis} checkedChildren="是" unCheckedChildren="否" checked={flag} onChange={value => this.isInputNumFn(value, record.policyId,index,'allowMaterialCustomer')}/>
                },
            }, {
                title: '是否开放给顾问',
                key: 'allow_material_adviser',
                className:'centerStyle',
                dataIndex: 'allow_material_adviser',
                width: 100,
                render: (text, record,index) => {
                    let isDis
                    if (record.vetted == 1) {
                        if (record.customerRemarkVetted == 2 || record.customerRemarkVetted == 3) {
                            isDis = false
                        } else {
                            isDis = true
                        }

                    } else {
                        isDis = true
                    }
                    let flag;
                    text===1?flag=true:flag==false;
                    return <Switch disabled={isDis} checkedChildren="是" unCheckedChildren="否" checked={flag} onChange={value => this.isInputNumFn(value, record.policyId,index,'allowMaterialAdviser')}/>
                },
            }, {
                title: '审批状态',
                key: 'action',
                dataIndex: 'vetted',
                className:'centerStyle',
                width: 100,
                render: (text, record) => (
                    <span>
                        {maps.vetted[text] || '/'}
                    </span>
                ),
            }, {
                title: '相关说明（对客户）审批状态',
                key: 'action1',
                width: 100,
                className:'centerStyle',
                dataIndex: 'customerRemarkVetted',
                render: (text, record) => (
                    <span>
                        {maps.customerRemarkVetted[text] || '/'}
                    </span>
                ),
            }, {
                title: '操作',
                key: 'action2',
                width: 100,
                render: (text, record) =>{
                    const arr:JSX.Element[] = [];
                    const {
                        globalVetted,
                    } = text;
                    if(globalVetted === -1) {
                        arr.push(
                            <a onClick={() => browserHistory.push(
                                {
                                    pathname: `${ROUTER_PATH}/newadmin/social/materials/detail`,
                                    query: {
                                        policyId:text.policyId,
                                        role: 0,
                                    },
                                }
                            )}>
                                查看
                            </a>
                        );
                        arr.push(
                            <a onClick={() => browserHistory.push(
                                {
                                    pathname: `${ROUTER_PATH}/newadmin/social/materials/edit`,
                                    query: {
                                        policyId:text.policyId,
                                        role: 1,
                                    },
                                }
                            )}>
                                编辑
                            </a>
                        );
                    }
                    if(globalVetted === 0 || globalVetted === 1) {
                        arr.push(
                            <a onClick={() => browserHistory.push(
                                {
                                    pathname: `${ROUTER_PATH}/newadmin/social/materials/detail`,
                                    query: {
                                        policyId:text.policyId,
                                        role: 0,
                                    },
                                }
                            )}>
                                查看
                            </a>
                        )
                    }
                    if(globalVetted === 1) {
                        arr.push(
                            <a onClick={() => browserHistory.push(
                                {
                                    pathname: `${ROUTER_PATH}/newadmin/social/materials/edit`,
                                    query: {
                                        policyId:text.policyId,
                                        role: 1,
                                    },
                                }
                            )}>
                                编辑
                            </a>
                        );
                    }
                    if(globalVetted === 2) {
                        arr.push(
                            <a onClick={() => browserHistory.push(
                                {
                                    pathname: `${ROUTER_PATH}/newadmin/social/materials/edit`,
                                    query: {
                                        policyId:text.policyId,
                                        role: 1,
                                    },
                                }
                            )}>
                                重新提交
                            </a>
                        );
                    }

                    if(arr.length > 1) {
                        let index = arr.length - 1;
                        const newArr:any[] = [];
                        arr.forEach(value => {
                            newArr.push(value);
                            if(index > 0) {
                                newArr.push(<Divider type="vertical" />);
                                index --;
                            }
                        });
                        return newArr;
                    }
                    else {
                        return arr;
                    }  
                    
                }
            }

];
    render(){
        
        //由于setState为异步的所以写在这里可以保证他执行
        
        if(this.state.isAjax){
            this.searchDispatch()
        }
        let data 
        if(this.props.data.policyData &&this.props.data.policyData.length){
            data = this.props.data.policyData
        }
        else if (this.props.data.policyData && this.props.data.policyData.records){
            data = this.props.data.policyData.records
        }
        else {
            data = [];
        }
        return  (
                <div>
                    <Form layout="inline">
                        <Row>
                            <FormItem>
                                <Col><label>省：</label>

                                <Input style={{ width: 160 }} onBlur={value => this.handlerChange(value,'provinceName')}/>
                                </Col>
                            </FormItem>

                            <FormItem>
                                <Col><label>市：</label>
                                <Input style={{ width: 160 }} onBlur={value => this.handlerChange(value, 'cityName')}/>
                                </Col>
                            </FormItem>

                            <FormItem>
                                <Col><label>政策包名：</label>
                                <Input style={{ width: 160 }} onBlur={value => this.handlerChange(value, 'districtName')}/>
                                </Col>
                            </FormItem>
                            <FormItem>
                                类别：<Select
                                    style={{ width: 140 }}
                                    defaultValue=" "
                                    onChange={value => this.SelectHandlerChange(value, 'serviceType')}
                                >
                                    <Option value=" ">全部</Option>
                                    <Option value="1">服务商</Option>
                                    <Option value="2">自营户</Option>
                                    <Option value="3">自营户+服务商</Option>
                                </Select>
                            </FormItem>

                            <FormItem>
                                <Col><label>平台参保材料收集截止时间：</label>
                                <InputNumber min={1} max={31} onChange={value => this.SelectHandlerChange(value, 'wFundStuffTime')}/>
                                </Col>
                            </FormItem>
                            <FormItem>
                                是否开放给游客：<Select
                                    style={{ width: 100 }}
                                    defaultValue=" "
                                onChange={value => this.SelectHandlerChange(value, 'allowMaterialTourists')}
                                >
                                    <Option value=" ">全部</Option>
                                    <Option value="1">是</Option>
                                    <Option value="0">否</Option>
                                </Select>
                            </FormItem>
                            <FormItem>
                                是否开放个客户：<Select
                                    style={{ width: 100 }}
                                    defaultValue=" "
                                onChange={value => this.SelectHandlerChange(value, 'allowMaterialCustomer')}
                                >
                                    <Option value=" ">全部</Option>
                                    <Option value="1">是</Option>
                                    <Option value="0">否</Option>
                                </Select>
                            </FormItem>
                            <FormItem>
                                是否开放给顾问：<Select
                                    style={{ width: 140 }}
                                    defaultValue=" "
                                onChange={value => this.SelectHandlerChange(value, 'allowMaterialAdviser')}
                                >
                                    <Option value=" ">全部</Option>
                                    <Option value="1">是</Option>
                                    <Option value="0">否</Option>
                                </Select>
                            </FormItem>
                        </Row>
                    </Form>
                <Row style={{ height: "3px", background: '#22baa0', marginTop: "30px" }}></Row>
                <Table 
                    style={{marginTop:"30px"}} 
                    columns={this.columns()} 
                    dataSource={data} 
                    scroll={{ x:1250 }} 
                    pagination={this.pagination()}
                    loading = {this.props.data.fetching}
                    bordered
                />
                </div>
        )
    }
}
const mapStateToProps = (state, ownProps: any): any => {
    let data = state.get('policyListReducer');
        data = data.toJS()
    return {
        data,
        inputIsok:data.isOk
    }
};
export default connect(mapStateToProps)(PolicyList);
