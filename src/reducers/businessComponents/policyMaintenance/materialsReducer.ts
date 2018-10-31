import Immutable from 'immutable';
import {
    SET_POLICYPACKAGE_DATA,
    POLICYPACKAGE_FETCHING,
    SUBMIT_POLICYPACKAGE_FETCHING,
    APPROVE_POLICYPACKAGE_FETCHING,
} from '../../../action/businessComponents/policyMaintenance/materialsAction';
const initialState = Immutable.fromJS({
    policypackageFetching: true,
    submitPolicypackageFetching: false,
    approvePolicypackageFetching: false,
    policypackageData: {
        materialTypes: [],
        insuredPersonTypes: [],
        insuredTypes: [],
        insuredTypesMap: {},
        insuredPersonTypesMap: {},
    },
});

const recombinePolicypackageData = (data) => {
    const materialTypes = data.materialTypes;
    const insuredTypes = data.insuredTypes;
    const insuredPersonTypes = data.insuredPersonTypes;
    /**
     * 参保类型map
     */
    let insuredTypesMap:any = {};
    data.insuredTypes = insuredTypes.map(value => {
        insuredTypesMap[value.id] = value.dictName;
        return {
            insuredType: value.id,
            insuredPersonTypes: [],
        }
    });
    data.insuredTypesMap = insuredTypesMap;
    
    /**
     * 参保身份map
     */
    let insuredPersonTypesMap:any = {};
    insuredPersonTypes.map(value => {
        insuredPersonTypesMap[value.id] = value.dictName;
    });
    data.insuredPersonTypesMap = insuredPersonTypesMap;
   


    const arr:any[] = [];
    let index = 0;
    const deep = (obj?) => {
        if(index >= materialTypes.length) {
            return index--;
        }
        if(index === 0) {
            const materialType = materialTypes[index];
            for(let key in materialType) {
                const data = materialType[key];
                const newObj = {
                    label: data.name,
                    value: `${data.id}|${data.name}`,
                };
                arr.push(newObj);
                index ++;
                deep(newObj);
            }
        }
        else {
            const children:any[] = [];
            const materialType = materialTypes[index];
            for(let key in materialType) {
                if(key.startsWith(obj.value.split('|')[0])) {
                    const data = materialType[key];
                    const newObj = {
                        label: data.name,
                        value:`${data.id}|${data.name}`,
                    };
                    children.push(newObj);
                    index ++;
                    deep(newObj);
                }
            }
            if(children.length > 0) {
                obj.children = children;
            }
            index--;
        }
    }
    deep();
    data.materialTypes = arr;

    


    

    /**
     * 有材料数据
     */
    const materialContentJson = data.materialContentJson;
    if(materialContentJson) {
        const materialsInsuredTypes =  materialContentJson.insuredTypes.map(value => {
            return {
                ...value,
                dictName: insuredTypesMap[value.insuredType],
            }
        });
        data.insuredTypes = materialsInsuredTypes;
    }
    


    
    return data;

}




export default (state = initialState, action) => {
    const {
        type,
        params,
        callback,
    } = action;
    switch (type) {
        case SET_POLICYPACKAGE_DATA:
            const data = recombinePolicypackageData(params.data)
            callback && callback(data);
            return state.update('policypackageData', () => Immutable.fromJS(data));
        case POLICYPACKAGE_FETCHING:
            return state.update('policypackageFetching', () => params);
        case SUBMIT_POLICYPACKAGE_FETCHING: 
            return state.update('submitPolicypackageFetching', () => params);
        case APPROVE_POLICYPACKAGE_FETCHING: 
            return state.update('approvePolicypackageFetching', () => params);
        default:
            return state
    }
}