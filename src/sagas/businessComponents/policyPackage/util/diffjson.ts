import { diff  as justDiff } from 'just-diff';
import {
    isArray,
    isObject,
} from '../../../../util/isX';

const findObjctInParents = (arr) => {
    for(let i = arr.length - 1; i >= 0 ; i--) {
        if(isObject(arr[i])) {
            return arr[i];
        }
    }
}


export const diff =  (oldData, newData) => {
    const patch = justDiff(oldData, newData);
    for(let key in patch) {
        const obj = patch[key];
        const {
            op,
            path,
            value,
        } = obj;
        let tempArr:any[] = [];
        path.reduce((data, key) => {
            if(data[key] !== undefined) {
                tempArr.push(data[key]);
                return data[key];
            }
            return data;
        }, newData)
        const node = findObjctInParents(tempArr);
        if(isObject(node)) {
            node._op = op;
        }
       
    }
    return newData;
}


export const removeOP = (data) => {
    const deepEach = (data) => {
        if(isObject(data)) {
            if(Object.prototype.hasOwnProperty.call(data, '_op')) {
                delete data['_op'];
            }
            for(let key in data) {
                deepEach(data[key]);
            }
            return;
        }
        if(isArray(data)) {
            for(let value of data) {
                deepEach(value);
            }
        }
    }

    deepEach(data);

    return data;
}


