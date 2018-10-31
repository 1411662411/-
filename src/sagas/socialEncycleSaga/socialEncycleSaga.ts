import { takeEvery } from 'redux-saga';
import { browserHistory } from 'react-router';
import { put } from 'redux-saga/effects';
import {
    message
} from 'antd';
import query from '../../util/query';
import { mapCurrentPageToStart } from '../../util/pagination';
import {
    ALL_ENCYCLE_DIS,
    ARTICLE_AA_DIS,
    allEncycleRecieved,
    ALL_ENCYCLE_ADD_DIS,
    ALL_ENCYCLE_EDITOR_DIS,
    ALL_ENCYCLE_DELETE_DIS,
    POLICY_ENCYCLE_ADD_DIS,
    categoryFormlistRecieved,
    CATEGORY_FORM_LIST_DIS,
    IS_CHANGE_COLOR_DIS,
    isChangeColorRecieved,
    PLOCIY_ENCYLE_EDITOR_DIS,
    PLOCIY_ENCYLE_DELETE_DIS,
    PLOCIY_ENCYLE_SORT_DIS,
    ARTICLE_ENCYLE_ADD_DIS,
    articleEncycleListRecieved,
    ARTICLE_ENCYLE_EDITOR_DIS,
    ARTICLE_ENCYLE_DELETE_DIS,
    ARTICLE_ENCYLE_LIST_DIS,
    ARTICLE_ENCYLE_AUDIT_LIST_DIS,
    articleEncycleAuditListRecieved,
    articleAaRecieved,
    ARTICLE_ENCYLE_AUDIT_DIS,
    loadingEncycle,
    spiningLoading,
    spiningAuditLoading,
    tableLoading,
} from '../../action/socialEncycleAction/socialEncycleAction';
import {
    articleEncycleAuditte,
   allEncycleList,
   allEncycleAdd,
   allEncycleEditor,
   allEncycleDelete,
   policyEncycleAdd,
   categoryFormList,
   policyEncycleEditor,
   policyEncycleDelete,
   policyEncycleSort,
   articleEncycleAdd,
   articleEncycleList,
   articleEncycleEditor,
   articleEncycleDelete,
   articleEncycleAuditList
} from '../../api/socialEncycleApi/socialEncycleApi';

const arrList = (arr)=>{
                 let len = arr.length 
                 let aa:any = ''
                 if(len>0){
                     if(arr[0].children){
                        return arrList(arr[0].children)
                     }else{
                         return arr[0]
                     }
                 }
             }

export function* incrementAsync(obj) {
    const {
        type,
        params,
        callback,
    } = obj;
    /**去除为空的参数给后台 */

   
    const newParams:any = mapCurrentPageToStart(params);
    switch (type) {
        case IS_CHANGE_COLOR_DIS: {
            yield put(spiningLoading(true));  
                let isChangeColor = callback.isChangeColor
                let catyList = callback.categoryList
                let count = false
                isChangeColor
                isChangeColor.map((k,i)=>{
                    if(count){
                        k.index=0
                    }
                    if(k.classic==params.classic){
                        k.index = params.index
                        k.id=params.id
                        count=true
                    }
                })
              
             const forEachList=(arr:any)=>{
                    arr.map((item,index)=>{
                        oneCategoryArrAll.push(
                            {
                                categoryName:item.categoryName,
                                id:item.id,
                                parentId:item.parentId,
                                encyclopediaCategoryIdString:item.encyclopediaCategoryIdString,
                                auditStatus:item.auditStatus,
                                classTop:classTop
                                }
                            )
                                
                            if(item.children&&item.children.length>0){
                            classTop++
                                forEachList(item.children)
                                return
                            }
                    })
                    classTop--
                    return oneCategoryArrAll
                    }
                
                let oneCategoryArrAll:any=[];
                let classTop=0
                let arr = forEachList(catyList)
                let [oneCategory,twoCategory,threeCategory,fourCategory,fiveCategory] :any= [[],[],[],[],[]]
                 arr.forEach((k,i) => {
                        if(k.classTop==0){
                            oneCategory.push(k)
                        }else if(k.classTop==1){
                            twoCategory.push(k)
                        }else if(k.classTop==2){
                            threeCategory.push(k)
                        }else if(k.classTop==3){
                            fourCategory.push(k)
                        }else if((k.classTop==4)){
                            fiveCategory.push(k)
                        }
                    })
                    let [oneCategoryNew,twoCategoryNew,threeCategoryNew,fourCategoryNew,fiveCategoryNew] :any= [[],[],[],[],[]]
                    let oneSele = isChangeColor[0].index//每一集所选中的类目位置
                    let twoSele = isChangeColor[1].index
                    let threeSele = isChangeColor[2].index
                    let fourSele = isChangeColor[3].index
                    let fiveSele = isChangeColor[4].index
                    if(oneSele!==''){
                        if(oneCategory.length>0){
                                let oneId:any =null
                                if(oneCategory[oneSele]){
                                    oneId = oneCategory[oneSele].id
                                }
                                twoCategory.map((v,i)=>{
                                    if(v.parentId===oneId){
                                        twoCategoryNew.push(v)
                                    }
                                })
                        }
                    }
                    if(twoSele!==''){ 
                        if(twoCategoryNew.length>0){
                            let twoId:any =null
                                if(twoCategoryNew[twoSele]){
                                    twoId = twoCategoryNew[twoSele].id
                                }
                                    threeCategory.map((v,i)=>{
                                        if(v.parentId===twoId){
                                            threeCategoryNew.push(v)
                                        }
                                    })
                        }
                    }
                    if(threeSele!==''){
                        if(threeCategoryNew.length>0){
                            let threeId:any =null
                                if(threeCategoryNew[threeSele]){
                                    threeId = threeCategoryNew[threeSele].id
                                }
                                    fourCategory.map((v,i)=>{
                                        if(v.parentId===threeId){
                                            fourCategoryNew.push(v)
                                        }
                                    })
                                    
                        }  
                    }
                    if(fourSele!==''){  
                        if(fourCategoryNew.length>0){
                            let fourId:any =null
                                if(fourCategoryNew[fourSele]){
                                    fourId = fourCategoryNew[fourSele].id
                                }
                                    fiveCategory.map((v,i)=>{
                                        if(v.parentId===fourId){
                                            fiveCategoryNew.push(v)
                                        }
                                    })
                        }
                    }
                oneCategoryNew = oneCategory
                let classList = {oneCategoryNew,twoCategoryNew,threeCategoryNew,fourCategoryNew,fiveCategoryNew}
                let classListArr = [oneCategoryNew,twoCategoryNew,threeCategoryNew,fourCategoryNew,fiveCategoryNew]
                let seleId = params.id
                let idFa = params.classic+'New'
                let classNum
                if(classList[idFa].length>0){
                    classNum = classList[idFa][0].classTop
                }
                let needId
                if(classNum===4){
                        needId = seleId
                }else if(classNum===3){
                    if(classListArr[4].length>0){
                        let ind = isChangeColor[4].index
                        needId = classListArr[4].length>0&&classListArr[4][ind]?classListArr[4][ind].id:''
                    }else{
                        let ind = isChangeColor[3].index
                        needId = classListArr[3].length>0&&classListArr[3][ind]?classListArr[3][ind].id:''
                    }
                }
                else{
                    for(let k=classNum+1;k<classListArr.length;k++){
                        if(classListArr[k].length==0&&classListArr[k-1].length>0){
                            let ind = isChangeColor[k-1].index
                            needId = classListArr[k-1].length>0&&classListArr[k-1][ind]?classListArr[k-1][ind].id:''
                        }
                    }
                }
                if(needId){
                    let dataww = yield articleEncycleList({
                            categoryId:needId,
                            auditStatus:'',
                            start:0,
                            length:20
                    })
                    if(dataww.status===0){
                        yield put(articleEncycleListRecieved(dataww.data));   
                    }
                }
                yield put(spiningLoading(false)); 
                return yield put(isChangeColorRecieved(isChangeColor));
        }
        case ALL_ENCYCLE_DIS: {
            let data = yield allEncycleList(newParams)
            if(data.status===0){

               return yield put(allEncycleRecieved(data.data));
            }else{
               return 
               
            }
           
        }
        case CATEGORY_FORM_LIST_DIS: {
            yield put(spiningLoading(true));
            yield put(spiningAuditLoading(true));
             let dataa = yield categoryFormList(newParams)
            if(dataa.status==0){
                if(callback){
                    if(newParams.resolve){
                        newParams.resolve({data:dataa.data})
                    }
                    let selecrEl = arrList(dataa.data)
                    
                    if(selecrEl){
                    let dataww = yield articleEncycleList({
                        categoryId:selecrEl?selecrEl.id:'',
                        auditStatus:'',
                        start:0,
                        length:20
                    })
                    if(dataww.status===0){
                       yield put(articleEncycleListRecieved(dataww.data));   
                    }
                    }
                }
                yield put(categoryFormlistRecieved(dataa.data)); 
                yield put(spiningLoading(false));
                yield put(spiningAuditLoading(false));
                 return  
            }
           
        }
        case ALL_ENCYCLE_ADD_DIS: {
            let data = yield allEncycleAdd(newParams)
            let {resovle} = newParams
            if(data.status===0){
                const prams = {
                    provinceName: '',
                    cityName: '',
                    isInner: '',
                    isOpen :'',
                    start: 0,
                    length: 20
                }
                let dataaa = yield allEncycleList(prams)
                if(dataaa.status===0){
                    yield put(allEncycleRecieved(dataaa.data));
                }else{
                   return 
                }
             return  message.success(data.msg);
            }else{
                resovle({data:data.status})
               return 
               
            }
           
        }
        case ALL_ENCYCLE_EDITOR_DIS: {
            yield put(tableLoading(true))
            
            let data = yield allEncycleEditor(newParams)
            if(data.status===0){
                if(data.status===0){
                const prams = {
                    provinceName: '',
                    cityName: '',
                    isInner: '',
                    isOpen :'',
                    start: 0,
                    length: 20
                }
                let dataaa = yield allEncycleList({...prams,...mapCurrentPageToStart(callback)})
                if(dataaa.status===0){
                    yield put(allEncycleRecieved(dataaa.data)); 
                }else{
                   return 
                }
                yield put(tableLoading(false))
             return  message.success(data.msg);
            }else{
               return yield put(tableLoading(false))
            }
            }else{
               return yield put(tableLoading(false))
            }
        }
        case ALL_ENCYCLE_DELETE_DIS: {
            let data = yield allEncycleDelete(newParams)
            if(data.status===0){
                    let dataa = yield allEncycleList(mapCurrentPageToStart(callback))
                    if(dataa.status===0){
                        yield put(allEncycleRecieved(dataa.data));
                    }else{
                        return 
                    }
              return  message.success(data.msg);
            }else{
              return 
            }
            
        }
        case POLICY_ENCYCLE_ADD_DIS:{
            yield put(spiningLoading(true)); 
            let data = yield policyEncycleAdd(newParams)
            let isChangeColor =  callback.old
         
            if(data.status===0){
                let dataa = yield categoryFormList({auditStatus:3,encyclopediaManageId:query('encyclopediaManageId')})
                isChangeColor.map((k,i)=>{
                    if(k.classic==callback.classic){
                        k.index = callback.index,
                        k.id = callback.id
                        return 
                    }
                })
                yield put(articleEncycleListRecieved({
                        current:1,
                        pagesize:20,
                        result:[],
                        total:0
                    })); 
                 yield put(isChangeColorRecieved(isChangeColor));
                 yield put(spiningLoading(false)); 
                if(dataa.status==0){
                    yield put(spiningLoading(false));
                    return yield put(categoryFormlistRecieved(dataa.data));   

                }
            }else{
                yield put(spiningLoading(false));
              return 
            }
        }
        case PLOCIY_ENCYLE_EDITOR_DIS:{
            yield put(spiningLoading(true));  
            let data = yield policyEncycleEditor(newParams)
            if(data.status===0){
                let dataa = yield categoryFormList({auditStatus:3,encyclopediaManageId:query('encyclopediaManageId')})
                if(dataa.status==0){
                    yield put(spiningLoading(false));  
                    return yield put(categoryFormlistRecieved(dataa.data));   
                }
            }else{
                yield put(spiningLoading(false));  
              return 
            }
        }
        case PLOCIY_ENCYLE_DELETE_DIS:{
            yield put(spiningLoading(true));  
            let data = yield policyEncycleDelete(newParams)
            if(data.status===0){
                let dataa = yield categoryFormList({auditStatus:3,encyclopediaManageId:query('encyclopediaManageId')})
                if(dataa.status==0){
                    
                 yield put(categoryFormlistRecieved(dataa.data));   
                 return yield put(spiningLoading(false));  
                }
            }else{
              return yield put(spiningLoading(false));
            }
        }
        case PLOCIY_ENCYLE_SORT_DIS:{
            let data = yield policyEncycleSort(newParams)
            if(data.status===0){
                let dataa = yield categoryFormList({auditStatus:3,encyclopediaManageId:query('encyclopediaManageId')})
                if(dataa.status==0){
                    return yield put(categoryFormlistRecieved(dataa.data));   
                }
            }else{
              return 
            }
        }
        case ARTICLE_ENCYLE_ADD_DIS:{
            let data = yield articleEncycleAdd(newParams)
            yield put(loadingEncycle(true));
            if(data.status===0){
                let dataww = yield articleEncycleList({
                    categoryId:newParams.encyclopediaCategoryId,
                    auditStatus:'',
                    start:0,
                    length:20
                })
                if(dataww.status===0){
                    yield put(articleEncycleListRecieved(dataww.data));   
                }
                let databa = yield categoryFormList({auditStatus:3,encyclopediaManageId:query('encyclopediaManageId')})
                if(databa.status==0){
                    yield put(categoryFormlistRecieved(databa.data));   
                }
                yield put(loadingEncycle(false));
              return  message.success(data.msg)
            }else{
              return 
            }
        }
        case ARTICLE_ENCYLE_EDITOR_DIS:{
            let data = yield articleEncycleEditor(newParams)
            yield put(loadingEncycle(true));
            if(data.status===0){
                let dataww = yield articleEncycleList({
                    categoryId:callback.encyclopediaCategoryId,
                    auditStatus:'',
                    start:0,
                    length:20
                })
                if(dataww.status===0){
                    yield put(articleEncycleListRecieved(dataww.data)); 
                }
                let databa = yield categoryFormList({auditStatus:3,encyclopediaManageId:query('encyclopediaManageId')})
                if(databa.status==0){
                     yield put(categoryFormlistRecieved(databa.data));   
                }
                yield put(loadingEncycle(false));  
              return  message.success(data.msg)
            }else{
              return 
            }
        }
        case ARTICLE_ENCYLE_DELETE_DIS:{
            let data = yield articleEncycleDelete(newParams)
            if(data.status===0){
                let dataww = yield articleEncycleList({
                    categoryId:callback.encyclopediaCategoryId,
                    auditStatus:'',
                    start:0,
                    length:20
                })
                if(dataww.status===0){
                    yield put(articleEncycleListRecieved(dataww.data));   
                }
                let databa = yield categoryFormList({auditStatus:3,encyclopediaManageId:query('encyclopediaManageId')})
                if(databa.status==0){
                     yield put(categoryFormlistRecieved(databa.data));   
                }
              return  message.success(data.msg)
            }else{
              return 
            }
        }
        case ARTICLE_ENCYLE_LIST_DIS:{
            yield put(spiningAuditLoading(true)); 
            let dataww = yield articleEncycleList(newParams)
                if(dataww.status===0){
                    if(newParams.resolve){
                        newParams.resolve({data:dataww.data})
                    }
                    yield put(articleEncycleListRecieved(dataww.data));  
                    return yield put(spiningAuditLoading(false));  
                }else{
                    return yield put(spiningAuditLoading(false));  
                }
        }
         case ARTICLE_ENCYLE_AUDIT_LIST_DIS:{
            let dataww = yield articleEncycleAuditList(newParams)
            
                if(dataww.status===0){
                    
                   return yield put(articleEncycleAuditListRecieved(dataww.data));   
                }else{
                    return
                }
        }
        case ARTICLE_AA_DIS:{
            return yield put(articleAaRecieved(newParams)); 
        }
        case ARTICLE_ENCYLE_AUDIT_DIS:{
            let dataww = yield articleEncycleAuditte(newParams)
                if(dataww.status===0){
                    if(newParams.resolve){
                        newParams.resolve({data:dataww.status})
                    }
                    let databa = yield categoryFormList({auditStatus:1,encyclopediaManageId:query('encyclopediaManageId')})
                    if(databa.status==0){
                        yield put(categoryFormlistRecieved(databa.data));   
                    }
                    return  message.success(dataww.msg);
                }else{
                    return
                }
        }
         default:
            throw ('error from cashOutDetailSaga, action type')

    }
  
}
const removeEmpty = (obj: any) => {
    let newObj = {};
    for (var key in obj) {
        if (obj[key] !== '') {
            newObj[key] = obj[key];
        }
    }
    return newObj;
}
// Our watcher Saga: 在每个 INCREMENT_ASYNC action 调用后，派生一个新的 incrementAsync 任务
export default function* socialEncycleList() {
    yield takeEvery(
        [
            ALL_ENCYCLE_DIS,
            ALL_ENCYCLE_ADD_DIS,
            ALL_ENCYCLE_EDITOR_DIS,
            ALL_ENCYCLE_DELETE_DIS,
            POLICY_ENCYCLE_ADD_DIS,
            CATEGORY_FORM_LIST_DIS,
            IS_CHANGE_COLOR_DIS,
            PLOCIY_ENCYLE_EDITOR_DIS,
            PLOCIY_ENCYLE_DELETE_DIS,
            PLOCIY_ENCYLE_SORT_DIS,
            ARTICLE_ENCYLE_ADD_DIS,
            ARTICLE_ENCYLE_EDITOR_DIS,
            ARTICLE_ENCYLE_DELETE_DIS,
            ARTICLE_ENCYLE_LIST_DIS,
            ARTICLE_ENCYLE_AUDIT_LIST_DIS,
            ARTICLE_AA_DIS,
            ARTICLE_ENCYLE_AUDIT_DIS
        ], incrementAsync)
}
