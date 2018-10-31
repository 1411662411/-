
 export let customerNameReg = /[0-9a-zA-Z\x22\u4e00-\u9fa5\（\）\,\.\《\》\·\{\}\【\】\：\s]/g //客户名称特殊字符验证
 export function HtoC(str){  //搜索特殊字符转换
    let reg = /[^\u4e00-\u9fa5a-zA-Z]/g
    let chineseReg = /[\u4e00-\u9fa5]/
    let strCopy = str.replace(reg, '')
    /*
    if(chineseReg.test(str)){ //中文模式
        str = str.replace(/\`/g,'·')
        str = str.replace(/\(/g, '（');
        str = str.replace(/\)/g, '）');
        str = str.replace(/[:]/g,'：')
        str = str.replace(/[,]/g,'，')
        str = str.replace(/[\.]/g,'。')
        str = str.replace(/[;]/g,'；')
        str = str.replace(/[?]/g,'？')
    }else{ //英文模式
        str = str.replace(/\·/g,'`')
        str = str.replace(/\（/g, '(');
        str = str.replace(/\）/g, ')');
        str = str.replace(/[：]/g,':')
        str = str.replace(/，/g, ',');
        str = str.replace(/。/g, '.');
        str = str.replace(/[；]/g,';')
        str = str.replace(/[？]/g,'?')
    }
    */
    str = str.replace(/\(/g, '（');
    str = str.replace(/\)/g, '）');
    str = str.replace(/，/g, ',');
    // str = str.replace(/。/g, '.');
    str = str.replace(/:/g, '：');
    if(/^[\u4E00-\u9FA5\s]+$/.test(str) || !/^[A-Za-z\s]+$/.test(str)){
        str = str.replace(/\s+/g, '');
    }

    // if(/[\s]{2,}/.test(str)){
    //     str = str.replace(/\s+/g, ' ');
    // }

    return str;
}

export function prefixInteger(num, length) {
    return (Array(length).join("0") + num).slice(-length);
}
export function getImgType(src:string){
    let arr = src.split('?')[0].split('.');
    let ext = arr[arr.length - 1].toLowerCase();
    return ext;
}

export function isParent(obj, parentObj) {
    //判断obj元素是否在parentObj内部
    while (obj != undefined && obj != null && obj.tagName.toUpperCase() != 'BODY') {
        if (obj == parentObj) {
            return true;
        }
        obj = obj.parentNode;
    }
    return false;
}
//treeData
/**
 * 
 * @param OldData 数据源
 * @param label 变量名
 * @param value 变量
 * @param children 子元素名
 */
export function getTreeData (OldData:any[], label:string, value:string, children:string){
    let treeData:any[] = [];
    const getChildren = (children) => {
        let newChildren:any = []
        for(let i=0, len=children.length; i < len; i++){
            newChildren.push(getObj(children[i]));
        }
        return newChildren;
    }

    const getObj = (data) => {
        let obj:any = {
            label: data[label],
            value: data[value],
            key: data[value],
        };
        if(data[children]){
            obj.children = getChildren(data[children])
        }
        return obj;
    }
    return getChildren(OldData);
}

export function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}

interface PaginationProps{
    size?: 'small' | '';
    onChange: Function;
    onShowSizeChange: Function;
    total: number;
    pageSize: number; 
    current: number;
    pageSizeOptions?: string[] | number[];
}
export class Pagination{
    public showTotal = (total, range) => `${range[0]}-${range[1]} of ${total}`;
    public showSizeChanger = true;
    public showQuickJumper = true;
    public pageSizeOptions: string[] | number[] = ['20','30','50','100'];
    public onChange 
    public onShowSizeChange
    public total
    public pageSize
    public current
    public size = '';
    constructor(obj:PaginationProps){
        this.size = obj.size || this.size;
        this.onChange = obj.onChange;
        this.onShowSizeChange = obj.onShowSizeChange;
        this.total = obj.total;
        this.pageSize = obj.pageSize;
        this.current = obj.current;
        this.pageSizeOptions = obj.pageSizeOptions || this.pageSizeOptions;
    }
}