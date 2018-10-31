/**
 * Array去重
 * @param arr {Array} 旧数组
 */
 const unique = (arr: any[]) => {
    const newArr: typeof arr = [];
    let obj:{
        [ propsName : string ] : number
    } = {};
    for (var i = 0; i < arr.length; i++) {
        if (!obj[arr[i]]) {
            newArr.push(arr[i]);
            obj[arr[i]] = 1;
        }
    }
    return newArr;
}
export default unique;