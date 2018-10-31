import address from '../../../../components/select-city/address.json';
import moment from 'moment';
import {List, Map} from 'immutable';
/**
 * selectCityParams
 * @param param {Object} 参数
 */
export const selectCityParams = ({ selectVal = [] as number[], selectName = [] as string[] } = {}) => {
    return {
        deepMap: [{ name: '省', value: selectVal && selectVal.length >= 1 ? selectVal[0] : undefined }, { name: '市', value: selectVal && selectVal.length >= 2 ? selectVal[1] : undefined }, { name: '区', value: selectVal && selectVal.length >= 3 ? selectVal[2] : undefined }],
        popupStyle: {
            width: 350,
            zIndex: 99999,
        }, /* 弹窗样式 */
        placeholder: '请选择',
        address, /* json方式 方式城市基本数据，与addressApi选项2选1， 优先 address */
        style: {
            width: 166,
        }, /* input 的样式 */
    }
}

/**
 * rangePickerProps 
 * @param startTime {date} 开始 
 * @param endTime {data} 结束
 */
export const rangePickerProps = (startTime, endTime) => {
    /**
     * rangePicker的默认值
     */
    const format = 'YYYY/MM/DD';
    const rangePickerDefaultValue = startTime && endTime && [moment(startTime, format), moment(endTime, format)];
    return {
        format,
        style: {
            width: 338,
        }
    }
}

/**
 * 城市验证方法
 * @param rule 
 * @param value 
 * @param callback 
 */
export const validatorSelectCity = (rule, value, callback) => {
    if(value === undefined) {
        return callback();
    }
    let {
        selectVal = [],
        selectName = []
    } = value;

    // 过滤undefined成员
    selectVal = selectVal.filter(item => !!item)
    selectName = selectName.filter(item => !!item)
    if(selectName.length > 0 && selectName.length <= 2) {
        callback('请选择地区');
    } else {
        callback()
    }
}

/**
 * dateRangeInitialValue 初始值
 * @param start {moment} 开始
 * @param end {moment} 结束
 * @param long {boolean} 是否长期
 */
export const dateRangeInitialValue = (start, end, long?) => {
    if(long && start) {
        return [moment(start), long];
    }
    if(start && end) {
        return [moment(start), moment(end)];
    }
    if(start) {
        return [moment(start)];
    }
    return [];
}

/**
 * validatorDateRange
 * @param rule 
 * @param value 
 * @param callback 
 * @param message 
 */
export const validatorDateRange = (rule, value, callback, message?) => {
    if(value && value.length) {
        if(  (!value[0] && value[1])  || (value[0] && !value[1]) ) {
            return callback(message)
        }
    };
    callback();
}






const createCascaderOptions = (max: number, flag?: boolean, month?: number) => {
    const maxMonth = [1, 3, 5, 7, 8, 10, 12];
    const minMonth = [4, 6, 9, 11 ];
    let arr: any[] = [];
    for(let i = 1; i <= max; i ++ ) {
        /**
         * 2 月
         */
        if(month === 2 && i> 29) {
            continue;
        }
        /**
         * 小月
         */
        //console.log(momth);
        if(month && minMonth.indexOf(month) > -1 && i > 30) {
            continue;
        }
        if(flag) {
            arr.push({
                value: i + '',
                label: i + '月',
                children: createCascaderOptions(31, false, i)
            })
        }
        else {
            arr.push({
                value: i + '',
                label: i + '日',
            })
        }
    }
    return arr;
} 


/**
 * 清缴截点options
 */
export const  cascaderOptions = [{
    value: '1',
    label: '每月',
    children:createCascaderOptions(31),
}, {
    value: '2',
    label: '每年',
    children: createCascaderOptions(12, true),
}];

/**
 * 时间截点options
 */
export const  cascaderOptionsTime = [{
    value: '1',
    label: '每月',
    children:createCascaderOptions(31),
}, {
    value: '2',
    label: '每年',
    children: createCascaderOptions(12, true),
}, {
    value: '3',
    label: '每季度第一个月',
    children: createCascaderOptions(31),
}];


/**
 * formItemLayout
 */
export const formItemLayout = {
    labelCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 8,
        },
    },
    wrapperCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 14,
        },
    }
}



export const  deadLineText = (value?: any[], single : boolean = true,) => {
    if(!value) return '/';
    if(value.length === 3) {
        return value.map((value, index) => {
            if(index === 0) {
                return '每年';
            }
            else if (index === 1) {
                return `${value}/`;
            }
            else {
                return `${value}日${single ? '前' : ''}`;
            }
        }).join('');
    }
    if(value.length === 2) {
        return value.map((value, index) => {
            if(index === 0) {
                if (value == '3') {
                    return '每季度第一个月'
                }
                return '每月';
            }
            else {
                return `${value}日前`;
            }
        })
    }
    return '/';
}

/**
 * 检查是否为空
 * @param value {any} 
 */
export const validatorEmpty = (value) => {
    if (value === undefined || value === '' || value === null) {
        return true;
    }
    return false;
}

export type PersonSourceProps = List<Map<keyof {
    userInfo: string;
    id: number | string;
}, any>>


/**
 * payMethod options
 * 1：现金，2：支票，3：托收，4：转账
 */
export const payMethodOptions = [
    { label: '现金', value: '1' },
    { label: '支票', value: '2' },
    { label: '托收', value: '3' },
    { label: '转账', value: '4' },
];


export type PayMethod =  ('1' | '2' | '3' | '4')[];
/**
 * 获取payMethod中文
 * @param arr {Array} 
 */
export const getPayMethodString = (arr?: PayMethod) => {
    if (!arr || arr.length <= 0) return '/';
    let obj = {} as any;
    payMethodOptions.forEach(({ label, value }, index) => obj[value] = label);
    return arr.map((value) => {
        if (Object.prototype.hasOwnProperty.call(obj, value)) {
            return obj[value];
        }
        return value;
    }).join('、');
}


/**
 * accountUse options
 * 银行账户用途
 */
export const accountUseOptions = [
    { label: '五险', value: '1' },
    { label: '公积金', value: '2' },
    { label: '代发工资', value: '3' },
];


export type AccountUse =  ('1' | '2' | '3' )[];
/**
 * 获取accountUse中文
 * @param arr {Array} 
 */
export const accountUseString = (arr?: AccountUse) => {
    if (!arr || arr.length <= 0) return '/';
    let obj = {} as any;
    accountUseOptions.forEach(({ label, value }, index) => obj[value] = label);
    return arr.map((value) => {
        if (Object.prototype.hasOwnProperty.call(obj, value)) {
            return obj[value];
        }
        return value;
    }).join('、');
}

export const validateUpload = (rule, value, callback, message?) => {
    if (value && value.length) {
        for (let { status } of value) {
            console.log(status)
            if (status === 'error') {
                return callback(message);
            }
        }
    }
    callback();
}
