
const regexpMap = {
    "*": /[\w\W]+/,
    number: /^\d+$/,
    string: /^[\u4E00-\u9FA5\uf900-\ufa2d\w\.\s]+$/,
    /**
     * 邮政编码
     */
    zip: /^[0-9]{6}$/,
    /**
     * 手机
     */
    mobile: /^13[0-9]{9}$|14[0-9]{9}|15[0-9]{9}$|16[0-9]{9}$|17[0-9]{9}$|18[0-9]{9}$|19[0-9]{9}$/,
    /**
     * 邮件
     */
    email: /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
    /**
     * 链接
     */
    url: /^(\w+:\/\/)?\w+(\.\w+)+.*$/,
    /**
     * 英文
     */
    en: /^[a-zA-Z]+$/,
    /**
     * 中文
     */
    zh: /^[\u4E00-\u9FA5\uf900-\ufa2d]+$/,
    /**
     * 身份证
     */
    idcard: /^[1-9]\d{5}(19||2[0-1])\d{2}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X|x)$/,
    /**
     * 座机
     */
    landline: /^(0\d{2,3}-?)?\d{7,8}(-(\d{1,6}))?$/, 
    /**
     * 浮点数
     */
    float: /^([+-]?)\d+\.\d+$/

};

type keys = keyof typeof regexpMap;

/**
 * 自动简单扩展正则
 * @param {string} name 匹配的名称
 */
const getRegExpByName = (name:string, attributes?: Attributes) => {
    if(Object.prototype.hasOwnProperty.call(regexpMap, name)) {
        return regexpMap[name];
    }
    const rule = /^(.+?)(\d+)-(\d+)$/
    const match = name.match(rule);
    /**
     * 不符合规则
     */
    if(!match ||  !Object.prototype.hasOwnProperty.call(regexpMap, match[1])) {
        throw new Error(`${name} 不存在对应的正则 或者不符合 ${rule.toString()} 规则 `);
    }
    const key = match[1];
    let oldRegExp  = peelRegExp(regexpMap[key].toString());

    /**
     * 去掉多余的末尾加号
     */
    if(oldRegExp.endsWith('+')) {
        oldRegExp = oldRegExp.slice(0, oldRegExp.length - 1 );
    }
    const newRegExp = new RegExp(`^(${oldRegExp}){${match[2]},${match[3]}}$`, attributes);
    
    return regexpMap[name] = newRegExp;
}
type Attributes = 'g' | 'i' | 'm' | 'gi' |  'ig' | 'im' | 'mi' | 'gim' | 'gmi' |'img' | 'igm';

interface RegExpInterface {
    (key: keys, attributes?:Attributes): RegExp;
}
interface RegExpInterface {
    (key: string, attributes?:Attributes): RegExp;
}

/**
 * 剥离头尾的正则
 */
const startEnd = /^(\/\^)(.+)(\$\/)$/;  
const start = /^(\/\^)(.+)/;
const end = /(.+)(\$\/)$/
const endWithAttributes= /(.+)\$\/((g?i?m?)|(i?m?g?)|(m?i?g?)|(m?g?i?))$/;
const noStartEnd = /^(\/)(.+)(\/)$/;


/**
 * 剥离正则符号
 * @param key 正则字符串
 */
const peelRegExp = (key:string) => {
    if(startEnd.test(key)) {
        const arr = key.match(startEnd);
        return arr && arr.length > 2 ? arr[2] :  '' ;
    }
    else if (start.test(key)) {
        const arr = key.match(start);
        return arr && arr.length > 2 ? arr[2] :  '' ;
    }
    else if (end.test(key)) {
        const arr = key.match(end);
        return arr && arr.length > 1 ? arr[1] :  '' ;
    }
    else if(endWithAttributes.test(key)) {
        const arr = key.match(endWithAttributes);
        return arr && arr.length > 2 ? arr[2] :  '' ;
    }
    else if(noStartEnd.test(key)) {
        const arr = key.match(noStartEnd);
        return arr && arr.length > 2 ? arr[2] :  '' ;
    }
    else {
        throw new Error('不符合的正则');
    }
}



/**
 * 或的逻辑 regExp | regExp | regExp
 * @param key {string} 
 */
const assemblyRegExp = (key:string, attributes?: Attributes) => {
    const regExps = key.split('|').map(value => {
        return `(${peelRegExp(getRegExpByName(value.trim()).toString())})`;
    });
    
    const newRegExp = new RegExp(`^(${regExps.join('|')})$`, attributes);
    return regexpMap[key] = newRegExp;
}

const getRegExpName:RegExpInterface = (key: string, attributes?: Attributes) => {
    if(Object.prototype.hasOwnProperty.call(regexpMap, key)) {
        return regexpMap[key];
    }
    if(key.indexOf('|') > -1) {
        return assemblyRegExp(key, attributes);
    }
    return getRegExpByName(key, attributes);
}
export default getRegExpName;