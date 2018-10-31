import * as Immutable from 'immutable';
export const eachUpdateIn = (state: any, data: any, parent:Array<string> = []) => {
    for(let k in data) {
        if(Object.prototype.hasOwnProperty.call(data, k)) {
            const arr: Array<string> = [k]
            state = state.updateIn(parent.concat(arr), () => 
                Array.isArray(data[k]) ?  Immutable.fromJS(data[k]): data[k]
            );
        }
    }
    // state.eachUpdateIn = eachUpdateIn;
    return state;
}