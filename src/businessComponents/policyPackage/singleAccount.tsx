import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PolicyPackageChoice from '../../components/policyPackage/singleAccount/policyPackageChoice';
import SetMaterials from '../../components/policyPackage/singleAccount/setMaterials';
import SubmitMaterials from '../../components/policyPackage/singleAccount/submitMaterials';
import * as actions from '../../action/businessComponents/policyPackage/singleAccountAction';
import { Map, List, fromJS } from 'immutable';
import { ROUTER_PATH, WSS, DOMAIN_OXT } from '../../global/global';
import query from '../../util/query';
import {
    Alert,
    Spin,
    Divider,
    message,
    Button,
    Input,
    Modal,
} from 'antd';
import './singleAccount.less';
const { TextArea } = Input;
const confirm = Modal.confirm;
const actionCreators = {
    singleaccountPolicylistSaga: actions.singleaccountPolicylistSaga,
    singleaccountDeleteTypeSaga: actions.singleaccountDeleteTypeSaga,
    singleaccountDetailSaga: actions.singleaccountDetailSaga,
    singleaccountSubmitSaga: actions.singleaccountSubmitSaga,
    singleaccountAuditSaga : actions.singleaccountAuditSaga,
    singleaccountEditSaga  : actions.singleaccountEditSaga,
    singleaccountDictionaryNameSaga: actions.singleaccountDictionaryNameSaga,
}

interface TOwnProps {
    /**
     * 编辑 true, 查看： false
     */
    edit?: boolean;
    /** 
     * 角色控制 1：录入， 2： 审核， 3： 编辑， 4：查看 5：客户录入 6：客户查看
     */
    role: 1 | 2 | 3 | 4;
    location?: any;
}
interface TStateProps {
    userInfo: any;
    activeTimeList: any;
    selectDictionaryData: any;
    dataSource: List<Map<any, any>>;
    fetching: boolean;
    submiting: boolean;
}
type TDispatchProps = typeof actionCreators;
type SingleAccountProps = TStateProps & TDispatchProps & TOwnProps;

/**
 * 1：录入， 2： 审核， 3： 编辑， 4：查看 5：客户录入 6：客户查看
 * edit 是否编辑
 * isAdmin 是否为后台人员
 */

const permissionMap ={
    1:{
        edit:true,
        isAdmin:true
    },
    2:{
        edit:true,
        isAdmin:true
    },
    3:{
        edit:true,
        isAdmin:true
    },
    4:{
        edit:true,
        isAdmin:true
    },
    5:{
        edit:true,
        isAdmin:true
    },
    6:{
        edit:true,
        isAdmin:true
    }
    
}
class SingleAccount extends Component<SingleAccountProps,any> {
    sessionStorageSearchParams:any;
    localStorageAddData:any;
    // SINGLEACCOUNT_ADD_DATA
    constructor(props) {
        
        super(props);
        this.localStorageAddData = JSON.parse(localStorage.getItem('SINGLEACCOUNT_ADD_DATA')!)
        this.sessionStorageSearchParams = JSON.parse(sessionStorage.getItem('SINGLE_ACCOUNT_SESSIONSTORAGE')!);
        this.state = {
            id: query('id'),
            policyCategory:[],
            headState: {
                
                policyPackage:{
                    selectVal: [],
                    selectName: [],
                },
                activeTime: '',
                activeTimeList:[],
                rejectReason: ''
            },
            visible:false,
            vetted:0,
            remark:'',
            tipMsg:'没有权限',
            materials:[],
            //** 步骤 1 选择政策包 2 设置政策包 3 提交政策包 */
            step: props.role ===1 ? 1:2,
            isLocalStorage: false,
            waitLocalStorage: true,
        }
        
    }
    componentWillMount() {
        const {
            role
        } = this.props;
        const searchParams = this.sessionStorageSearchParams || {}
        const {
            policyId
        }= searchParams;
        const {
            id
        } = this.state;
        // 优选读取缓存数据
        if(role === 1 && this.localStorageAddData && this.localStorageAddData.materials){
            // 同学，你上次录入的政策包未保存，是否恢复？
            // const that = this;
           
            confirm({
                title: '同学，你上次录入的政策包未保存，是否恢复？',
                content: '',
                okText: '是',
                cancelText: '否',
                onOk:()=> {
                    this.setState({...this.localStorageAddData})
                    this.setState({waitLocalStorage:false,isLocalStorage:true})
                },
                onCancel:()=> {
                    this.setState({waitLocalStorage:false})
                }
              });
            
        }else{
            this.setState({waitLocalStorage:false,headState:{},materials:{}})
        }
        if(this.props.role !==1 && (policyId || id)) {
            const callback = ()=> {
                this.setState({step:2})
            }
            this.props.singleaccountDetailSaga({ policyId:policyId||id ,callback,role:this.props.role});
        }
        
        // 查询数据字典里的客户需提供材料名称
        this.props.singleaccountDictionaryNameSaga({})
        // 自动保存
        if(role === 1 ){
            setInterval(() => {
                this.handleAutoSave()
            },1000*10)
            
        }
        
        
    }
    componentWillUnmount() {
        console.log('组件卸载。。。。。。。')
        // this.handleAutoSave()
        
        this.setState({materials:{},headState: {}})
    }
    componentWillReceiveProps(nextProps){
        const {
            dataSource
        } = nextProps;
        if(dataSource && dataSource.size){
            
            
            this.handleAssemblyData(dataSource.toJS())
        }
    }
    PolicyPackageChoice:any;
    SetMaterials:any;
    SubmitMaterials:any;
    // 组装数据给组件
    handleAssemblyData = (data) => {
        
        const {
            tipMsg,
            materials,
            originalMaterials,
            remark,
            vetted,
            rejectReason,
            effectiveTime,
            packageName,
            provinceId,
            cityId,
            areaId,
            provinceName,
            cityName,
            areaName,
            createUser,
        } = data;
        const {
            headState,
            step,
        } = this.state;
        const {
            role,
            userInfo
        } = this.props;
        // 不能编辑其他人创建的政策包
        // if(role===3 &&createUser && userInfo && (createUser !== userInfo.userName)){
            
        //     this.setState({visible:true,tipMsg:'只能编辑自己创建的政策包'})
        //     return false;
        // }
        // 权限控制
        // if(tipMsg){
        //     this.setState({visible:true,tipMsg})
        //     return false;
        // }
       

        if(step !== 1 && materials  && Object.prototype.toString.apply(materials) ==="[object Array]" ){
            
            const key = materials[0]?materials[0].key : '';
            const socialInsurance = Number.parseInt(key.substr(6,1)) || 0;
            const accumulationFund = Number.parseInt(key.substr(12,1)) || 0;
            
            const policyPackage = {
                selectName:[provinceName,cityName,areaName],
                selectVal:[provinceId,cityId,areaId]
    
            }
            this.setState({materials:{
                    policyCategory:materials || [],
                    socialInsurance,
                    accumulationFund,
                    tabActiveKey:key
                },
                headState:{...headState,rejectReason:vetted===2?rejectReason:'',activeTime:effectiveTime,policyPackage},
                remark,
                vetted,
                originalMaterials
            })
            console.log('update materials state');
            
        }
        
        
    }

    handleSelectCityChange = (policyPackage) => {
        const {
            headState,
            isLocalStorage
        } = this.state;
        const {
            selectVal, 
            selectName,
        } = policyPackage;
        if(!isLocalStorage && selectVal && selectVal.length ===3){
            // 返回第一步
            
            const callback = ()=> {
                this.setState({step:1,headState: {...headState,policyPackage}})
            }
            
            this.props.singleaccountPolicylistSaga({ areaId:selectVal[2],callback});
        }
        this.setState({isLocalStorage:false})
    }
    handleActiveTimeChange = (activeTime) => {
        const newTimeList = this.props.activeTimeList.toJS();
                    

        const data =  newTimeList.find(function(obj, index, arr) {
            return obj.name == activeTime;
        })
        if(data){
            this.setState({id:data.id})
        }else{
            this.setState({id:undefined})
        }
    }
    handleRemoveMaterialsType = (id,type,callback) => {
        if(id &&  type && callback){
            this.props.singleaccountDeleteTypeSaga({ policyId:id,insuredType:type ,callback})
        }else {
            message.error('参数不匹配')
        }
        
    }
    handleMaterialsType = (data,tabActiveKey) => {
        const {
            materials
        } = this.state;
        
        this.setState({materials:{...materials,policyCategory:data,tabActiveKey}})
        // this.setState({materials:{
        //     policyCategory:materials || [],
        //     socialInsurance,
        //     accumulationFund,
        //     tabActiveKey:key
        // },
    }
    setStep = (key) => {
        // 设置材料信息
        if(key === 2) {
            this.PolicyPackageChoice.validateFields((err, values) => {
                if(err) {
                    return false;
                }
                const {
                    activeTime,
                    policyPackage= {} as any
                } = values;
                const {
                    selectVal,
                    selectName
                } = policyPackage;
                if(selectVal && selectVal.length ===3 && activeTime){
                    // 查询政策包数据
                    const callback = ()=> {
                        this.setState({step:2})
                    }
                    
                    const newTimeList = this.props.activeTimeList.toJS();
                    

                    const data =  newTimeList.find(function(obj, index, arr) {
                        return obj.name == activeTime;
                    }) 
                    // 如果有id 则查询详情 没有直接新增
                    if(data && data.id){
                        if(data.vetted === 0 ){
                            message.error('该政策包已存在且待审核')
                            return false
                        }
                        this.setState({id:data.id})

                        this.props.singleaccountDetailSaga({ policyId:data.id ,callback});
                    }else{
                        this.setState({materials:{},step:2,remark:''})
                        
                    }
                    
                }
                
                
            })
            
        }
        // 提交|审核 材料信息
        if(key === 3){
            const {
                role
            } = this.props;
            let flag = true;
            let flagMsg = '提交失败';
            let data = {} as any;
            // if(role ===2)
            this.PolicyPackageChoice.validateFieldsAndScroll((err, values) => {
                if(err) {
                    flag = false;
                    flagMsg = '请选择政策包';
                }else{
                    const {
                        activeTime,
                        policyPackage= {} as any
                    } = values;
                    
                    const {
                        selectVal,
                        selectName
                    } = policyPackage;
                    if(selectVal && selectVal.length ===3 && activeTime){
                        // data.selectName = selectName;
                        // data.selectVal = selectVal;
                        // 后台需要的数据格式
                        const cityData = {
                            provinceId:selectVal[0],
                            cityId:selectVal[1],
                            areaId:selectVal[2],
                            provinceName:selectName[0],
                            cityName:selectName[1],
                            areaName:selectName[2],
                            effectiveTime:activeTime,
                        }
                        if(role ===1){
                            // const newTimeList = this.props.activeTimeList.toJS();
                            // const policyData =  newTimeList.find(function(obj, index, arr) {
                            //     return obj.name == values.activeTime;
                            // })
                            // debugger
                            // // 匹配选择的政策是否存在
                            // if(policyData && policyData.id){
                            //     this.setState({id:policyData.id})
                            // }
                        }
                       
                        data = Object.assign(data,cityData)
                        
                    }else{
                        // 录入
                        if (role === 1){
                            flag = false;
                            flagMsg = '请选择政策包';
                        }   
                        
                    }
                }
                
                
                
            })
            flag && this.SetMaterials.validateFieldsAndScroll((err, values) => {
                if(err) {
                    flag = false;
                    flagMsg = '请完善材料信息';
                }else {
                    const {
                        policyCategory
                    } = values;
                    var policyObj = new Object();
                    
                    if(policyCategory &&policyCategory.length>0){
                        
                        policyCategory.map(item=>{
                            
                            const key = item.key;
                            if(key){
                                const offerData = item.offerData;
                                const prepareData = item.prepareData;
                                var offerObj = new Object();
                                var prepareObj = new Object();
                                policyObj[key] =　{
                                    key,
                                    offerData:{},
                                    prepareData:{}
                                }
                                if((!offerData && prepareData!)||(offerData && offerData.length < 1 &&  prepareData && prepareData.length < 1) ) {
                                    flag = false;
                                    flagMsg = '存在没有信息项的类别，不能提交';
                                    // return false
                                }else {
                                    if(offerData && Object.prototype.toString.apply(offerData)==="[object Array]"){
                                        console.log(offerData)
                                        offerData.map((offer,index)=> {
                                            if(offer.key){
                                                // offerObj[offer.key] = offer;
                                                offerObj[offer.key] = {...offer,index};
                                            }
    
                                            
                                           
                                        })
                                        policyObj[key].offerData = offerObj;
                                        // policyObj[key].offerData = JSON.stringify(offerData);
                                    }
                                    if(prepareData && Object.prototype.toString.apply(prepareData)==="[object Array]"){
                                        
                                        prepareData.map((prepare,index)=> {
                                            if(prepare.key){
                                                // prepareObj[prepare.key] = prepare;
                                                prepareObj[prepare.key] = {...prepare,index};
                                            }
                                            // 验证材料是否保存
                                            if(prepare.editable){
                                                flag = false
                                                flagMsg = '请检查材料信息是否已保存';
                                            }
                                            
                                            
                                        })
                                        policyObj[key].prepareData = prepareObj;
                                        // policyObj[key].prepareData = JSON.stringify(prepareData);
                                    }
                                }
                                
                                
    
                            }
                            
                        })
                    }
                    else{
                        flag = false;
                        flagMsg = '没有生成类别，不能提交';
                    }
                    
                   
                    

                    data = Object.assign(data,{materials:policyObj});
                    
                }
                
                
            })
            flag && this.SubmitMaterials.validateFieldsAndScroll((err, values) => {
                if(err) {
                    flag = false;
                }else{
                    // const {
                    //     remark,
                    //     approvalStatus,
                    //     rejectReason,
                    //     vetted,
                    // } =  values
                    // data.vetted = vetted || 0;
                    // 
                    // 保存 vetted = 3
                    data = Object.assign(data, values);
                }
                
                
            })
            if(flag){
                
                this.handleSubmitMaterials(data);
            }else{
                message.error(flagMsg)
            }
            
        }
    }
    
    handleAutoSave = () =>{
        
        
            
            const {
                selectDictionaryData,
                activeTimeList,
                dataSource,
    
            } = this.props;
            const {
                headState,
                materials,
                step,
                remark,
                id,
                selectVal,
                tipMsg,
            } = this.state;

            let data = {} as any;
            const policyPackageChoiceData = this.PolicyPackageChoice && this.PolicyPackageChoice.getFieldsValue();
            data.headState = policyPackageChoiceData;
            const setMaterialsData = this.SetMaterials && this.SetMaterials.getFieldsValue();
            data.materials = setMaterialsData;
            const submitMaterials = this.SubmitMaterials && this.SubmitMaterials.getFieldsValue();
            data.remark = submitMaterials && submitMaterials.remark;
            

            localStorage.setItem('SINGLEACCOUNT_ADD_DATA',JSON.stringify({...this.state,...data}))
            console.log('系统自动保存成功')
        
    }
    handleSubmitMaterials = (data) => {
        const callback = ()=> {
            const {
                role
            } = this.props
            if(role === 1){
                localStorage.setItem('SINGLEACCOUNT_ADD_DATA',"{}")
                browserHistory.push(`${ROUTER_PATH}/newadmin/singleaccount/auditlist`);
            }else{
                browserHistory.goBack();
            }
            
        }
        const {
            originalMaterials,
            id,
            vetted,
        } = this.state;
        const {
            
            role
        } = this.props;

        
        // 录入的时候也可能是编辑所以传了id 
        if(role === 1 || role === 3) {
            // 添加审核状态给后台
            if(id) {
                data.vettedVali = vetted;
            }
            this.props.singleaccountSubmitSaga({  data,originalMaterials,id ,callback});
        // 审核
        }else if(role === 2) {
            if(id  && data.approvalStatus) {
                const params = {
                    policyId:id,
                    vetted:data.approvalStatus,
                    rejectReason:data.rejectReason,
                    callback,
                }
                this.props.singleaccountAuditSaga(params)
            }
        }
        
        
        
        
    }
    modalProps = () => {
        return {
            visible: this.state.visible,
            closable: false,
            wrapClassName: 'ant-confirm-warning',
            footer: (
                <span>
                    <Button  type="primary" onClick={ e => { browserHistory.goBack() } }>返回上一页</Button>
                </span>
            )
        }
    }
    
    render() {

        
        const activeTime = '';
        const {
            headState,
            materials,
            step,
            remark,
            id,
            selectVal,
            tipMsg,
            waitLocalStorage
        } = this.state;
        const {
            role,
            fetching,
            dataSource,
            activeTimeList,
            selectDictionaryData,
            submiting
        } = this.props;
        
        
        
        const modalProps = this.modalProps();
        return (
            <div>
                {!waitLocalStorage && <PolicyPackageChoice 
                    role={role}
                    edit={1===1?permissionMap[role].edit:false}
                    headState={headState}
                    data= {activeTimeList.toJS()}
                    callback = {this.setStep}
                    selectCityChange = {this.handleSelectCityChange}
                    activeTimeChange = {this.handleActiveTimeChange}
                   
                    ref={node => this.PolicyPackageChoice = node}

                />}
                
                
                {
                    
                   
                    (step>1 && (materials.policyCategory || role ===1)) && <div style={{paddingTop:role===2?30:0}}><SetMaterials 
                       
                        role={role}
                        id = {id}
                        edit={permissionMap[role].edit}
                        isAdmin={permissionMap[role].isAdmin}
                        data = {materials}
                        selectDictionaryData={selectDictionaryData.toJS()}
                        updateMaterialsType = {this.handleMaterialsType}
                        removeMaterialsType = {this.handleRemoveMaterialsType}
                        callback = {this.setStep}
                        ref={node => this.SetMaterials = node}
                    /> <SubmitMaterials 
                        role={role}
                        edit={permissionMap[role].edit}
                        data={remark}
                        submiting = {submiting}
                        isAdmin={permissionMap[role].isAdmin}
                        callback = {this.setStep}
                        

                        ref={node => this.SubmitMaterials = node}
                        /></div>
                    
                }{
                    fetching &&
                    <div style={{ textAlign: 'center' }}>
                        <Spin spinning />
                    </div>
                }
                
                
               
                <Modal {...modalProps}>
                <div className="ant-confirm-body" style={{ padding: '30px 40px' }}>
                    <i className="anticon anticon-exclamation-circle"></i>
                    <span className="ant-confirm-title">{tipMsg}</span>
                    {/* <div className="ant-confirm-content">{只能编辑自己创建的政策包}</div> */}
                </div>
            </Modal>

            </div>
        )
        
        
    }

}
const mapStateToProps = (state: any, ownProps: TOwnProps): TStateProps => {
    const data = state.get('singleAccountReducer');
    return {
        selectDictionaryData: data.get('selectDictionaryData'),
        activeTimeList: data.get('activeTimeList'),
        dataSource: data.get('dataSource'),
        fetching: data.get('fetching'),
        submiting: data.get('submiting'),
        userInfo: state.getIn(['routerPermission', 'permission', 'userInfo']),
    }
}

const mapDispatchToProps = (dispatch): TDispatchProps => {
    return bindActionCreators(actionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SingleAccount);