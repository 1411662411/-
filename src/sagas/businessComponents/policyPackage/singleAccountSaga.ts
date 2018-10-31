import { takeEvery } from 'redux-saga';
import { browserHistory } from 'react-router';
import { put } from 'redux-saga/effects';
import * as _ from 'lodash';
import {
    ROUTER_PATH,
} from '../../../global/global';
import {
    message,
    Modal,
} from 'antd';
import {
    SINGLEACCOUNT_LIST_SAGA,
    singleaccountListReducers,
    SINGLEACCOUNT_DETAIL_SAGA,
    singleaccountDetailReducers,
    SINGLEACCOUNT_SUBMIT_SAGA,
    SINGLEACCOUNT_EDIT_SAGA,
    SINGLEACCOUNT_AUDIT_SAGA,
    SINGLEACCOUNT_POLICYLIST_SAGA,
    singleaccountPolicylistReducers,
    SINGLEACCOUNT_UPORDOWNPOLICY_SAGA,
    SINGLEACCOUNT_DELETE_TYPE_SAGA,
    SINGLEACCOUNT_UPDATE_VETTED_SAGA,
    SINGLEACCOUNT_DICTIONARY_NAME_SAGA,
    singleaccountDictionaryNameReducers,

    fetching,
    submiting,
} from '../../../action/businessComponents/policyPackage/singleAccountAction';
import {
    singleAccountList,
    getDetail,
    singleAccountSubmit,
    singleAccountEdit,
    singleAccountAudit,
    singleAccountPolicylist,
    singleaccountUpordownpolicy,
    singleAccountDeleteType,
    singleaccountUpdateVetted,
    singleaccountDictionaryNameApi
} from '../../../api/businessComponents/policyPackage/singleAccountApi';
import { diff, removeOP } from './util/diffjson';
function entries(obj) {
    let arr:any[] = [];
    for (let key of Object.keys(obj)) {
      arr.push([key, obj[key]]);
    }
    return arr;
}
const deleteKeyFromObj = (data,keyString)=> {
    const objData = Object.assign({}, JSON.parse(JSON.stringify(data)))
    if(Object.prototype.toString.apply(objData) ==="[object Object]"){
        
        
        for (const key in objData) {
            const data = objData[key]
            if (objData.hasOwnProperty(key)) {
                // 客户需提供
                let offerData = data.offerData;
                // 客户需准备
                let prepareData = data.prepareData;
                
                if(Object.prototype.toString.apply(offerData) ==="[object Object]"){
                    // delete offerData[keyString]
                    for(var i in offerData){
                        delete offerData[i][keyString];
                    }
                   
                }
                
                if(Object.prototype.toString.apply(prepareData) ==="[object Object]"){
                   
                    // delete prepareData[keyString]
                    for(var i in prepareData){
                        delete prepareData[i][keyString]
                    }
                    
                }
            }

        }
        
        
    }
    return new Object(objData)
}
const compare =(property)=>{
    return function(a,b){
        // 未设置index 排后面
        var value1 = a[property] ;
        var value2 = b[property] ;
        return value1 - value2;
    }
}
function* incrementAsync(obj) {
    const {
        type,
        params,
    } = obj;
    switch (type) {
        
        case SINGLEACCOUNT_LIST_SAGA: {
           
            yield put(fetching(true))
            const responeData = yield singleAccountList(params);
            
            if (Number(responeData.error) === 0 || Number(responeData.status) === 0) {
                yield put(singleaccountListReducers(responeData));
                if(params.callback && Object.prototype.toString.apply(params.callback)==="[object Function]"){
                    params.callback()
                }
            }
            yield put(fetching(false))
            break;
        }
        case SINGLEACCOUNT_DICTIONARY_NAME_SAGA: {
           
            yield put(fetching(true))
            const responeData = yield singleaccountDictionaryNameApi({dictKey:"DLHDZXX"});
            
            if (Number(responeData.error) === 0 || Number(responeData.status) === 0) {
                yield put(singleaccountDictionaryNameReducers(responeData));
                
            }
            yield put(fetching(false))
            break;
        }
        
        case SINGLEACCOUNT_POLICYLIST_SAGA: {
            yield put(fetching(true))
            const responeData = yield singleAccountPolicylist(params);
            if (Number(responeData.error) === 0 || Number(responeData.status) === 0) {
                yield put(singleaccountPolicylistReducers(responeData));
                if(params.callback && Object.prototype.toString.apply(params.callback)==="[object Function]"){
                    params.callback()
                }
            }
            yield put(fetching(false))
            break;
        }
        case SINGLEACCOUNT_DETAIL_SAGA: {

            yield put(fetching(true))
            const responeData = yield getDetail(params);
            if ((Number(responeData.error) === 0 || Number(responeData.status) === 0) && responeData.data) {
                const role = params.role;
                const vetted = responeData.data.vetted;
                // // 不能编辑其他人创建的政策包
                // if(role===3 &&createUser && userInfo && (createUser !== userInfo.userName)){
                    
                //     this.setState({visible:true,tipMsg:'只能编辑自己创建的政策包'})
                //     return false;
                // }
                // 只有待审核状态才可以进入审核
                // if(role ===2 && vetted !==0){
                   
                //     Modal.warning({
                //         title: '该政策包已审核或未提交',
                //         okText:"返回上一页",
                //         onOk() {browserHistory.goBack()},
                //     });
                //     yield put(fetching(false))
                //     return false
                    
                // }
                // 不能编辑待审核的政策包
                if(role ===3 && (vetted === 0)){
                   
                    Modal.warning({
                        title: '不能编辑待审核的政策包',
                        okText:"返回上一页",
                        onOk() {browserHistory.goBack()},
                    });
                    yield put(fetching(false))
                    return false
                   
                }

                let materialsData = responeData.data?responeData.data.materials:null;
                // 录入或编辑 清除标记
                
                
                
                
                const id = responeData.data.id;
                if(Object.prototype.toString.apply(materialsData) ==="[object Object]"){
                    let newMaterialsData: any[] = [];
                    let newOriginalMaterials = new Object();
                    console.log(materialsData)

                    for (const key in materialsData) {
                        // 材料数据
                        let materials = new Object();
                        let originalMaterials = new Object();
                        const data = materialsData[key]
                        // if (materialsData.hasOwnProperty(key)) {
                        //     // 客户需提供
                        //     const offerData = data.offerData||'';
                        //     // 客户需准备
                        //     const prepareData = data.prepareData||'';
                        //     materials['key'] = key;
                        //     materials['_op'] = data._op;
                        //     // console.log(offerData)
                        //     if(Object.prototype.toString.apply(offerData) ==="[object String]"){
                        //         // 
                        //         const arrString = offerData.replace(/^\{(.*)\}$/g,'[$1]');
                                
                        //         materials['offerData'] = JSON.parse(offerData.replace(/\"\$(\d+)\"\:/g,''));
                        //         originalMaterials['offerData'] = offerData;
                        //     }
                            
                        //     if(Object.prototype.toString.apply(prepareData) ==="[object String]"){
                                
                        //         const arrString = prepareData.replace(/^\{(.*)\}$/g,'[$1]');
                                
                                
                        //         materials['prepareData'] = JSON.parse(prepareData.replace(/\"\$(\d+)\"\:/g,''));
                        //         originalMaterials['prepareData'] = prepareData;

                               
                        //     }
                        //     newMaterialsData.push(materials);
                        //     newOriginalMaterials[key] = originalMaterials;
                        // }
                        if (materialsData.hasOwnProperty(key)) {
                            // 客户需提供
                            const offerObj = JSON.parse(data.offerData||'{}');
                            // 客户需准备
                            const prepareObj = JSON.parse(data.prepareData||'{}');
                            materials['key'] = key;

                            materials['_op'] = data._op;
                            originalMaterials['key'] = key;
                            originalMaterials['_op'] = data._op;;
                           
                            const offerArr = _.values(_.omit(offerObj,'_op')).sort(compare('index'));
                            
                            materials['offerData'] = offerArr;
                            originalMaterials['offerData'] = offerObj;
                        
                        
                        
                            const prepareArr = _.values(_.omit(prepareObj,'_op')).sort(compare('index'));
                            
                            materials['prepareData'] = prepareArr;
                            originalMaterials['prepareData'] = prepareObj;

                               
                            newMaterialsData.push(materials);
                            newOriginalMaterials[key] = originalMaterials;
                        }
                    }
                    // 不是审核的时候去除标识
                    responeData.data.originalMaterials = params.role ===2? newOriginalMaterials: removeOP(newOriginalMaterials);
                    responeData.data.materials =  params.role ===2? newMaterialsData: removeOP(newMaterialsData);
                    
                    
                }
                yield put(singleaccountDetailReducers(responeData));
                // params.callback && params.callback()
                if (params.callback && Object.prototype.toString.apply(params.callback) === "[object Function]") {
                    params.callback()
                }
            }
            yield put(fetching(false))
            break;
        }
        case SINGLEACCOUNT_DELETE_TYPE_SAGA: {
            yield put(fetching(true))
            const responeData = yield singleAccountDeleteType(params);
            if (Number(responeData.error) === 0 || Number(responeData.status) === 0) {
                
                if(params.callback && Object.prototype.toString.apply(params.callback)==="[object Function]"){
                    message.success('删除成功',3,()=>params.callback())
                }
            }
            yield put(fetching(false))
            break;
        }
        case SINGLEACCOUNT_SUBMIT_SAGA: {
            yield put(fetching(true));
            yield put(submiting(true));
            
            // 
            const {
                id,
                data,
                cloneData,
                originalMaterials,
            } = params;
            let newParams = {
                id,

                ...data,
            };
            const vettedVali = data.vettedVali;
            
            // 审核之后重新编辑添加标识
            if(id && (vettedVali===1 || vettedVali ===2)){



                let materials = data.materials;//new Object(data.materials);
                // const diffMaterials2 = diff(originalMaterials,materials)
                // 删除index 然后对比
                const newMaterials = deleteKeyFromObj(materials,'index');
                const newOriginalMaterials = deleteKeyFromObj(originalMaterials,'index');

               
                // 对比添加修改标识
                const diffMaterials = diff(newOriginalMaterials,newMaterials)
                // 克隆index顺序
                newParams.materials = _.defaultsDeep(diffMaterials,materials)
            }
            const responeData = yield singleAccountSubmit({json:JSON.stringify(newParams)});
            
            if (responeData.msg && (Number(responeData.error) === 0 || Number(responeData.status) === 0)) {
                
                if(params.callback && Object.prototype.toString.apply(params.callback)==="[object Function]"){
                    message.success('提交成功',3,()=>params.callback())
                    
                }
            }
            yield put(submiting(false));
            yield put(fetching(false))
            break;
        }
        case SINGLEACCOUNT_EDIT_SAGA: {
            yield put(fetching(true))
            const responeData = yield singleAccountEdit(params);
            if (Number(responeData.error) === 0 || Number(responeData.status) === 0) {
                
                if(params.callback && Object.prototype.toString.apply(params.callback)==="[object Function]"){
                    params.callback()
                    message.success('更新成功',3,()=>params.callback())
                }
            }
            yield put(fetching(false))
            break;
        }
        case SINGLEACCOUNT_AUDIT_SAGA: {
            yield put(fetching(true))
            const responeData = yield singleAccountAudit(params);
        
            if (Number(responeData.error) === 0 || Number(responeData.status) === 0) {
                
                if(params.callback && Object.prototype.toString.apply(params.callback)==="[object Function]"){
                    
                    message.success('审核成功',3,()=>params.callback())
                }
            }
            yield put(fetching(false))
            break;
        }
        case SINGLEACCOUNT_UPORDOWNPOLICY_SAGA: {
            yield put(fetching(true))
            const responeData = yield singleaccountUpordownpolicy(params);
            
            if (Number(responeData.error) === 0 || Number(responeData.status) === 0) {
                
                if(params.callback && Object.prototype.toString.apply(params.callback)==="[object Function]"){
                    message.success('更新成功',3,()=>params.callback())
                    
                }
            }
            yield put(fetching(false))
            break;
        }
        case SINGLEACCOUNT_UPDATE_VETTED_SAGA: {
            yield put(fetching(true))
            const responeData = yield singleaccountUpdateVetted(params);
            
            if (Number(responeData.error) === 0 || Number(responeData.status) === 0) {
                
                if(params.callback && Object.prototype.toString.apply(params.callback)==="[object Function]"){
                    message.success('更新成功',3,()=>params.callback())
                }
            }
            yield put(fetching(false))
            break;
        }
    }
}

export default function* watchSingleAccountSaga() {
    yield takeEvery([
        SINGLEACCOUNT_LIST_SAGA,
        SINGLEACCOUNT_DETAIL_SAGA,
        SINGLEACCOUNT_SUBMIT_SAGA,
        SINGLEACCOUNT_EDIT_SAGA,
        SINGLEACCOUNT_AUDIT_SAGA,
        SINGLEACCOUNT_POLICYLIST_SAGA,
        SINGLEACCOUNT_UPORDOWNPOLICY_SAGA,
        SINGLEACCOUNT_DELETE_TYPE_SAGA,
        SINGLEACCOUNT_UPDATE_VETTED_SAGA,
        SINGLEACCOUNT_DICTIONARY_NAME_SAGA,
    ], incrementAsync);
}

